require("dotenv").config();
const { getShoonyaApi } = require('./loginShoonya');
const { STOCK_MAPPINGS, basePrices } = require('../constant/stockMapping');
const redis = require('../config/redis'); 

const SIMULATION_MODE = process.env.SIMULATION_MODE === 'true';
const SIMULATION_UPDATE_INTERVAL = 2000;
const MAX_PRICE_FLUCTUATION = 0.05;

// Redis keys
const REDIS_PRICE_UPDATE_CHANNEL = 'price-updates';
const REDIS_NOTIFICATION_CHANNEL = 'order-executed';

// SSE Client Management
const sseClients = new Map(); // Map<userId, res>

// Redis Pub/Sub Setup
const redisSubscriber = redis.duplicate();

// Subscribe to channels
redisSubscriber.subscribe(REDIS_NOTIFICATION_CHANNEL, (err) => {
  if (err) console.error('📡 Redis subscribe error:', err);
  else console.log('📡 Subscribed to order-executed channel');
});

redisSubscriber.subscribe(REDIS_PRICE_UPDATE_CHANNEL, (err) => {
  if (err) console.error('📡 Redis price update subscribe error:', err);
});

redisSubscriber.on('message', (channel, message) => {
  try {
    if (channel === 'order-executed') {
      const data = JSON.parse(message);
      handleOrderExecution(data);
    } else if (channel === REDIS_PRICE_UPDATE_CHANNEL) {
      // Broadcast price updates to all SSE clients
      sseClients.forEach(res => {
        if (!res.writableEnded) {
          res.write(`data: ${message}\n\n`);
        }
      });
    }
  } catch (err) {
    console.error('❌ Error processing Redis message:', err);
  }
});

// SSE Handler (unchanged)
const sseHandler = async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const userId = req.user?._id?.toString();
  if (!userId) {
    res.status(401).end('Unauthorized');
    return;
  }

  sseClients.set(userId, res);
  console.log(`📡 New SSE connection: ${userId}, total: ${sseClients.size}`);

  res.write('event: connected\ndata: {}\n\n');

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(userId);
    console.log(`❌ SSE connection closed: ${userId}, remaining: ${sseClients.size}`);
  });
};

// Handle Notiifications (unchanged)
const handleOrderExecution = async (data) => {
  const userId = data.userId?.toString();
  console.log(`📢 Received order execution for user: ${userId}`);

  if (!userId) return;

  const res = sseClients.get(userId);
  console.log(`🔍 SSE Clients: ${sseClients.size}, Found client: ${!!res}`);

  if (res) {
    console.log(`📤 Sending notification to ${userId}`);
    res.write(`event: orderExecuted\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  const now = new Date();
  const formattedTime = now.toLocaleTimeString("en-IN", {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const message = `${data.action === 'BUY' ? 'Bought' : 'Sold'} ${data.stockName} at ₹${Number(data.executedPrice).toFixed(2)} on ${formattedTime}`;

  const redisKey = `notifications:${userId}`;

  try {
    await redis.lpush(redisKey, message);
    const ttl = await redis.ttl(redisKey);
    if (ttl === -1) {
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const secondsUntilMidnight = Math.floor((midnight.getTime() - now.getTime()) / 1000);
      await redis.expire(redisKey, secondsUntilMidnight);
      console.log(`⏳ Set expiration for ${redisKey} in ${secondsUntilMidnight} seconds`);
    }
  } catch (err) {
    console.error("❌ Failed to save notification in Redis:", err);
  }
};

// Update Redis with new prices if they've changed
async function updateRedisPrices(stockKey, newPriceData) {
  try {

    const stockName = STOCK_MAPPINGS[stockKey] || `Unknown: ${data.tk}`;
    const redisKey = `livePrice:${stockName}`;
    // Optionally: get the previous JSON to compare
    const currentStr = await redis.get(redisKey);
    const current = currentStr ? JSON.parse(currentStr) : null;

    if (!current || current.price !== newPriceData.price) {
      // SET the new JSON
      await redis.set(redisKey, JSON.stringify(newPriceData));
      // Optionally set a TTL if you want

      const channel = `price-updates:${stockKey}`;
      await redis.publish(channel, JSON.stringify({
        stockKey,
        ...newPriceData
      }));
      return true;
    }
    return false;
  } catch (err) {
    console.error('❌ Redis price update error:', err);
    return false;
  }
}

// Simulation Mode
if (SIMULATION_MODE) {
  console.log("🔧 Simulation Mode Active");
  const simulationData = new Map();

  Object.entries(STOCK_MAPPINGS).forEach(([id, name]) => {
    const basePrice = basePrices[name] || 1000;
    simulationData.set(id, {
      e: id.split('|')[0],
      tk: id.split('|')[1],
      lp: basePrice,
      c: basePrice,
      pc: 0,
      name
    });
  });

  setInterval(async () => {
    try {
      const now = Date.now();
      const updates = [];

      for (const [id, data] of simulationData) {
        const fluctuation = (Math.random() * 2 * MAX_PRICE_FLUCTUATION) - MAX_PRICE_FLUCTUATION;
        const newPrice = parseFloat((data.lp * (1 + fluctuation)).toFixed(2));
        const pc = parseFloat(((newPrice - data.c) / data.c * 100).toFixed(2));
        
        data.lp = newPrice;
        data.pc = pc;

        const stockName = STOCK_MAPPINGS[id] || `Unknown: ${id.split('|')[1]}`;
        const priceData = {
          name: stockName,
          price: newPrice,
          percentageChange: pc,
          lastUpdated: now
        };

        // Update Redis if price changed
        const updated = await updateRedisPrices(id, priceData);
        if (updated) {
          updates.push({
            stockKey: id,
            ...priceData
          });
        }
      }

      // Broadcast to all clients if any updates occurred
      if (updates.length > 0) {
        sseClients.forEach(res => {
          if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify(updates)}\n\n`);
          }
        });
      }
    } catch (err) {
      console.error('🔴 Simulation error:', err);
    }
  }, SIMULATION_UPDATE_INTERVAL);
}

// Real Market Data Handling
async function receiveQuote(data) {
  if (!data?.lp || !data?.tk) return;

  const stockKey = `${data.e}|${data.tk}`;
  const stockName = STOCK_MAPPINGS[stockKey] || `Unknown: ${data.tk}`;
  
  const priceData = {
    name: stockName,
    price: data.lp,
    previousClosingPrice: data.c || 0,
    percentageChange: data.pc || 0,
    lastUpdated: Date.now()
  };

  console.log(priceData);

  // Update Redis if price changed
  const updated = await updateRedisPrices(stockKey, priceData);
  if (updated) {
    console.log("Updated price sent for", stockName, priceData.price);
  }
}

// WebSocket Connection (unchanged)
function connectWebSocket() {
  if (SIMULATION_MODE) {
    console.log("🔧 Simulation Mode - Skipping real WebSocket connection");
    return;
  }

  const api = getShoonyaApi();
  if (!api) {
    console.error("🔴 Cannot initialize WebSocket - API unavailable");
    return;
  }

  api.start_websocket({
    socket_open: (data) => {
      const instruments = Object.keys(STOCK_MAPPINGS);
      api.subscribe(instruments.join('#'));
      console.log(`✅ WebSocket connected, subscribed to ${instruments.length} instruments`);
    },
    quote: receiveQuote,
    order: (data) => console.log('📦 Order Update:', data)
  });
}

module.exports = { 
  connectWebSocket, 
  sseHandler
};