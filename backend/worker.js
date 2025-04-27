const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const redisClient = require("./config/redis");
const orderModel = require("./models/order");
const userModel = require("./models/user");
const holdingModel = require("./models/holding");
const db = require("./config/mongoose-connection");

async function executeOrder(order, user, currentPrice) {
    const stockName = order.stockName.toUpperCase();
    const executionCost = currentPrice * order.quantity;

    order.executedPrice = currentPrice;
    order.status = "CLOSED";

    if (order.action === "BUY") {
        const reservedCost = order.targetPrice * order.quantity;
        const refund = reservedCost - executionCost;

        user.reservedAmount -= reservedCost;
        user.balance += refund;

        let holding = await holdingModel.findOne({ user: user._id });
        if (!holding) {
            holding = new holdingModel({ user: user._id, holdings: [] });
        }

        const existingStock = holding.holdings.find(h => h.stock_symbol === stockName);
        if (existingStock) {
            const totalQty = existingStock.quantity + order.quantity;
            const totalInvest = (existingStock.average_price * existingStock.quantity) + executionCost;
            existingStock.quantity = totalQty;
            existingStock.average_price = totalInvest / totalQty;
        } else {
            holding.holdings.push({
                stock_symbol: stockName,
                quantity: order.quantity,
                average_price: currentPrice
            });
        }

        await holding.save();
        console.log(`💸 Bought ${order.quantity} of ${stockName} @ ₹${currentPrice}`);
    }

    if (order.action === "SELL") {
        user.balance += executionCost;

        const holding = await holdingModel.findOne({ user: user._id });
        if (holding) {
            const stock = holding.holdings.find(h => h.stock_symbol === stockName);
            if (stock) {
                stock.quantity -= order.quantity;
                if (stock.quantity <= 0) {
                    holding.holdings = holding.holdings.filter(h => h.stock_symbol !== stockName);
                }
                await holding.save();
            }
        }

        console.log(`💰 Sold ${order.quantity} of ${stockName} @ ₹${currentPrice}`);
    }

    await Promise.all([
        order.save(),
        user.save(),
        redisClient.del(`order:active:${order._id}`),
        redisClient.lrem("pendingOrders", 0, order._id.toString())
    ]);

    console.log(`✅ Executed ${order.action} @ ₹${currentPrice}`);
}

const orderWorker = new Worker("orderQueue", async (job) => {
    const { orderId } = job.data;

    try {
        const isActive = await redisClient.get(`order:active:${orderId}`);
        if (isActive) {
            console.log(`ℹ️ Order ${orderId} already being processed`);
            return;
        }

        await redisClient.set(`order:active:${orderId}`, "true", "EX", 300);
        console.log("📥 Processing order:", orderId);

        const order = await orderModel.findById(orderId);
        if (!order || order.status === "CLOSED") return;

        const user = await userModel.findById(order.user);
        if (!user) return console.log("❌ Associated user not found");

        user.reservedAmount = Number(user.reservedAmount);
        user.balance = Number(user.balance);

        const stockName = order.stockName;
        let executed = false;
        const startTime = Date.now();
        const maxDuration = 300000; // 5 mins

        if (order.isMarketOrder) {
            const priceDataStr = await redisClient.get(`livePrice:${stockName}`);
            const currentPrice = priceDataStr ? JSON.parse(priceDataStr).price : null;

            if (currentPrice) {
                await executeOrder(order, user, currentPrice);
                executed = true;
            }
        }

        while (!executed && Date.now() - startTime < maxDuration) {
            const priceDataStr = await redisClient.get(`livePrice:${stockName}`);
            const currentPrice = priceDataStr ? JSON.parse(priceDataStr).price : null;

            if (!currentPrice) {
                await new Promise(res => setTimeout(res, 1000));
                continue;
            }

            console.log(`🧾 Order ${orderId} (${order.action})`);
            console.log(`📌 Ordered: ₹${order.targetPrice} | 💹 Current: ₹${currentPrice}`);

            const shouldExecute = order.action === "BUY"
                ? currentPrice <= order.targetPrice
                : currentPrice >= order.targetPrice;

            if (shouldExecute) {
                await executeOrder(order, user, currentPrice);
                executed = true;
            } else {
                const delay = Math.abs(currentPrice - order.targetPrice) < (order.targetPrice * 0.01) ? 500 : 1000;
                console.log(`⏳ Waiting for price threshold...`);
                await new Promise(res => setTimeout(res, delay));
            }
        }

        if (!executed) {
            console.log(`🕒 Order ${orderId} expired after 5 minutes`);
            await redisClient.del(`order:active:${orderId}`);
            await redisClient.lrem("pendingOrders", 0, orderId.toString());
        }

    } catch (err) {
        console.error("❌ Worker Error:", err.message);
        await redisClient.del(`order:active:${orderId}`);
        throw err;
    }

}, {
    connection: redisClient,
    concurrency: 20,
    limiter: {
        max: 100,
        duration: 1000
    }
});

console.log("⚡ Worker ready for live price execution.");
