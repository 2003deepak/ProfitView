require("dotenv").config();
const { getShoonyaApi } = require('./loginShoonya');
const { STOCK_MAPPINGS, basePrices } = require('../constant/stockMapping');
const redis = require('../config/redis');

const SIMULATION_MODE = process.env.SIMULATION_MODE === 'true';
const SIMULATION_UPDATE_INTERVAL = 2000;
const MAX_PRICE_FLUCTUATION = 0.05;

// Redis keys
const REDIS_PRICE_UPDATE_CHANNEL = 'price-updates'; // Subscriber listens here
const REDIS_NOTIFICATION_CHANNEL = 'order-executed';

// SSE Client Management
const sseClients = new Map(); // Map<userId, res>

// Redis Pub/Sub Setup
// We need a separate client for subscribing because subscribe is a blocking operation
const redisSubscriber = redis.duplicate();
const redisPublisher = redis.duplicate(); // Use original or a duplicate for publishing


redisSubscriber.subscribe(REDIS_NOTIFICATION_CHANNEL, (err) => {
  if (err) console.error('📡 Redis subscribe error:', err);
  else console.log('📡 Subscribed to order-executed channel');
});

redisSubscriber.subscribe(REDIS_PRICE_UPDATE_CHANNEL, (err) => {
  if (err) console.error('📡 Redis price update subscribe error:', err);
  else console.log('📡 Subscribed to price-updates channel');
});


redisSubscriber.on('message', (channel, message) => {
  try {
    if (channel === REDIS_NOTIFICATION_CHANNEL) { // Use the constant here for clarity
      const data = JSON.parse(message);
      handleOrderExecution(data);
    } else if (channel === REDIS_PRICE_UPDATE_CHANNEL) {
      
      // console.log("I am coming till here");
     // console.log(message);
      sseClients.forEach(res => {
        if (!res.writableEnded) {
          console.log("Sending data from on message of redis subscriber : " + message );
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

// Handle Notifications (unchanged)
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
    // Use the original redis client for commands (LPUSH, TTL, EXPIRE)
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
    const stockName = STOCK_MAPPINGS[stockKey] || `Unknown: ${stockKey}`; // Use stockKey for lookup
    const redisKey = `livePrice:${stockName}`;

    // Optionally: get the previous JSON to compare
    const currentStr = await redis.get(redisKey);
    const current = currentStr ? JSON.parse(currentStr) : null;


    if (!current || current.price !== newPriceData.price) {

      await redis.set(redisKey, JSON.stringify(newPriceData));

      await redisPublisher.publish(REDIS_PRICE_UPDATE_CHANNEL, JSON.stringify({
        stockKey, 
        ...newPriceData
      }));
      
      // console.log(`Published price update for ${stockName} to ${REDIS_PRICE_UPDATE_CHANNEL}`); // Optional log
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
      lp: basePrice, // Last Price
      c: basePrice, // Closing Price (Base for % change)
      pc: 0, // Percentage Change
      name: name // Stock Name
    });
  });

  setInterval(async () => {
    try {
      const now = Date.now();
      // const updates = []; // No longer needed for direct SSE write

      for (const [id, data] of simulationData) {
        const fluctuation = (Math.random() * 2 * MAX_PRICE_FLUCTUATION) - MAX_PRICE_FLUCTUATION;
        // Ensure price doesn't go negative in simulation
        const newPrice = parseFloat(Math.max(0, data.lp * (1 + fluctuation)).toFixed(2));

        // Recalculate percentage change based on original closing price (data.c)
        const pc = parseFloat(((newPrice - data.c) / data.c * 100).toFixed(2));

        // Update simulation data for next interval calculation
        data.lp = newPrice;
        data.pc = pc;

        const stockName = STOCK_MAPPINGS[id] || `Unknown: ${id.split('|')[1]}`;
        const priceData = {
          name: stockName,
          price: newPrice,
          // Include previousClosingPrice and percentageChange for completeness
          previousClosingPrice: data.c,
          percentageChange: pc,
          lastUpdated: now
        };

        // Update Redis if price changed - this *also* publishes to the correct channel now
        await updateRedisPrices(id, priceData);
  
      }


    } catch (err) {
      console.error('🔴 Simulation error:', err);
    }
  }, SIMULATION_UPDATE_INTERVAL);
}

// Real Market Data Handling
async function receiveQuote(data) {
  // Check for essential data points
  if (!data?.lp || !data?.tk || !data?.e) {
      console.warn('Received incomplete quote data:', data);
      return;
  }

  const stockKey = `${data.e}|${data.tk}`;
  const stockName = STOCK_MAPPINGS[stockKey] || `Unknown: ${data.tk}`;

  const priceData = {
    name: stockName,
    price: parseFloat(data.lp),
    previousClosingPrice: data.c || 0,
    percentageChange: data.pc || 0,
    lastUpdated: Date.now()
  };

  // console.log("Sending data from recieve quote these " + stockName + JSON.stringify(priceData));

  // Update Redis if price changed - this will publish to the correct channel
  await updateRedisPrices(stockKey, priceData);
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
      console.log(`✅ WebSocket connected, subscribed to LTP for ${instruments.length} instruments`);
    },
   
    quote: receiveQuote, 
    order: (data) => console.log('📦 Order Update:', data),
    socket_error: (err) => console.error('❌ WebSocket error:', err),
    socket_close: (reason) => console.warn('🔌 WebSocket closed:', reason),
  });
}

module.exports = {
  connectWebSocket,
  sseHandler
};