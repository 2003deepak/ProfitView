require("dotenv").config({path: "./backend/.env"});
const { Worker } = require("bullmq");
const redis = require("./backend/config/redis");
const orderModel = require("./backend/models/order");
const userModel = require("./backend/models/user");
const holdingModel = require("./backend/models/holding");
const db = require("./backend/config/mongoose-connection");

// Create Redis publisher instance
const redisPublisher = redis.duplicate();

// Track active subscribers to avoid duplicates
const activeSubscribers = new Map();


function isMarketOpen() {
    if (process.env.SIMULATION_MODE === "true") {
        return true; // No time restriction in simulation mode
    }

    const now = new Date();
    const open = new Date(now);
    open.setHours(9, 30, 0, 0);
    const close = new Date(now);
    close.setHours(15, 30, 0, 0);
    return now >= open && now <= close;
}

async function executeOrder(order, user, currentPrice) {
  const stockName = order.stockName;
  const executionCost = currentPrice * order.quantity;

  // Log order confirmation
  console.log(`📝 Order ${order._id} (${order.action})`);
  console.log(`📌 Ordered: ₹${order.targetPrice} | 💹 Current: ₹${currentPrice}`);

  order.executedPrice = currentPrice;
  order.status = "CLOSED";

  let userHolding = await holdingModel.findOne({ user: user._id });

  if (!userHolding) {
      userHolding = new holdingModel({ user: user._id, holdings: [] });
  }

  if (order.action === "BUY") {
      const reservedCost = order.targetPrice * order.quantity;
      const refund = reservedCost - executionCost;

      user.reservedAmount -= reservedCost;
      user.balance += refund;

      const existingStock = userHolding.holdings.find(h => h.stock_name === stockName);
      if (existingStock) {
          const totalQty = existingStock.quantity + order.quantity;
          const totalInvest = (existingStock.average_price * existingStock.quantity) + executionCost;
          existingStock.quantity = totalQty;
          existingStock.average_price = totalInvest / totalQty;
      } else {
          userHolding.holdings.push({
              stock_name: stockName,
              quantity: order.quantity,
              average_price: currentPrice
          });
      }
  } else if (order.action === "SELL") {
      user.balance += executionCost;

      const stock = userHolding.holdings.find(h => h.stock_name === stockName);
      if (stock) {
          stock.quantity -= order.quantity;
          if (stock.quantity <= 0) {
              userHolding.holdings = userHolding.holdings.filter(h => h.stock_name !== stockName);
          }
      }
  }

  await Promise.all([
      order.save(),
      user.save(),
      userHolding.save()
  ]);

  try {
      await redisPublisher.publish('order-updates', JSON.stringify({
          userId: user._id.toString(),
          updateType: "Order Executed",
          status: "success",
          orderId: order._id.toString(),
          stockName,
          action: order.action,
          quantity: order.quantity,
          executedPrice: currentPrice,
          timestamp: new Date().toISOString()
      }));
      console.log('📡 Published order execution');
  } catch (err) {
      console.error('📡 Redis publish error:', err);
  }

  await Promise.all([
      redis.del(`holding:${user._id}`),
      redis.del(`user:${user._id}:portfolio`),
      redis.del(`userOrders:${user._id}`),
      redis.del(`order:active:${order._id}`),
      redis.lrem("pendingOrders", 0, order._id.toString())
  ]);

  console.log(`✅ Executed ${order.action} @ ₹${currentPrice}`);
}

async function handleFailedOrder(order, user) {
    order.status = "FAILED";
    if (order.action === "BUY") {
        user.reservedAmount -= order.targetPrice * order.quantity;
        user.balance += order.targetPrice * order.quantity;
    }

    await redisPublisher.publish('order-updates', JSON.stringify({
        userId: user._id.toString(),
        updateType: "Order Failed",
        status: "fail",
        orderId: order._id.toString(),
        stockName: order.stockName,
        action: order.action,
        quantity: order.quantity,
        timestamp: new Date().toISOString()
    }));

    await Promise.all([
        user.save(),
        order.save(),
        redis.del(`order:active:${order._id}`),
        redis.lrem("pendingOrders", 0, order._id.toString())
    ]);
}

const orderWorker = new Worker("orderQueue", async (job) => {
    const { orderId } = job.data;
    let priceSubscriber = null;

    try {
        // Check if order is already being processed
        const isActive = await redis.get(`order:active:${orderId}`);
        if (isActive) {
            console.log(`ℹ️ Order ${orderId} already being processed`);
            return;
        }

        await redis.set(`order:active:${orderId}`, "true", "EX", 300);
        console.log("📥 Processing order:", orderId);

        const order = await orderModel.findById(orderId);
        if (!order || order.status === "CLOSED") {
            await redis.del(`order:active:${orderId}`);
            return;
        }

        const user = await userModel.findById(order.user);
        if (!user) {
            console.log("❌ Associated user not found");
            await redis.del(`order:active:${orderId}`);
            return;
        }

        user.reservedAmount = Number(user.reservedAmount);
        user.balance = Number(user.balance);

        const stockName = order.stockName;

        // 1. First check current price immediately
        const priceDataStr = await redis.get(`livePrice:${stockName}`);
        const currentPrice = priceDataStr ? JSON.parse(priceDataStr).price : null;

        if (currentPrice) {
            const shouldExecute = order.action === "BUY"
                ? currentPrice <= order.targetPrice
                : currentPrice >= order.targetPrice;

            if (shouldExecute) {
                await executeOrder(order, user, currentPrice);
                return;
            }
        }

        // 2. If not executed immediately and market is closed, fail the order
        if (!isMarketOpen()) {
            await handleFailedOrder(order, user);
            console.log(`🕒 Market closed - order ${orderId} failed`);
            return;
        }

        // 3. Set up price subscription for this specific stock
        // Check if we already have a subscriber for this stock
        if (!activeSubscribers.has(stockName)) {
            priceSubscriber = redis.duplicate();
            activeSubscribers.set(stockName, priceSubscriber);
            
            priceSubscriber.on('message', async (channel, message) => {
                if (channel !== `price-updates:${stockName}`) return;

                try {
                    const priceData = JSON.parse(message);
                    const currentPrice = priceData.price;

                    // Get all active orders for this stock
                    const activeOrders = await orderModel.find({
                        stockName,
                        status: "OPEN",
                        $or: [
                            { action: "BUY", targetPrice: { $gte: currentPrice } },
                            { action: "SELL", targetPrice: { $lte: currentPrice } }
                        ]
                    });

                    for (const activeOrder of activeOrders) {
                        const orderUser = await userModel.findById(activeOrder.user);
                        if (orderUser) {
                            await executeOrder(activeOrder, orderUser, currentPrice);
                        }
                    }
                } catch (err) {
                    console.error(`❌ Error processing price update for ${stockName}:`, err);
                }
            });

            await priceSubscriber.subscribe(`price-updates:${stockName}`);
            console.log(`👂 Subscribed to price updates for ${stockName}`);
        }

        // 4. Add order to watch list
        await redis.lpush(`watchlist:${stockName}`, orderId);
        console.log(`👀 Added order ${orderId} to watchlist for ${stockName}`);

        // 5. Set timeout for order execution (30 minutes)
        setTimeout(async () => {
            const orderStillOpen = await orderModel.findOne({ _id: orderId, status: "OPEN" });
            if (orderStillOpen) {
                await handleFailedOrder(orderStillOpen, user);
                console.log(`⏰ Order ${orderId} timed out`);
            }
        }, 1800000); // 30 minutes

    } catch (err) {
        console.error("❌ Worker Error:", err.message);
        await redis.del(`order:active:${orderId}`);
        throw err;
    }
}, {
    connection: redis,
    concurrency: 20,
    limiter: {
        max: 100,
        duration: 1000
    }
});


console.log("⚡ Order execution worker ready");