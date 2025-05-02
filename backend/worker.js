const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const redisClient = require("./config/redis");
const orderModel = require("./models/order");
const userModel = require("./models/user");
const holdingModel = require("./models/holding");
const db = require("./config/mongoose-connection");

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

        console.log(`💸 Bought ${order.quantity} of ${stockName} @ ₹${currentPrice}`);
    }

    if (order.action === "SELL") {
        user.balance += executionCost;

        const stock = userHolding.holdings.find(h => h.stock_name === stockName);
        if (stock) {
            stock.quantity -= order.quantity;
            if (stock.quantity <= 0) {
                userHolding.holdings = userHolding.holdings.filter(h => h.stock_name !== stockName);
            }
        }

        console.log(`💰 Sold ${order.quantity} of ${stockName} @ ₹${currentPrice}`);
    }

    await Promise.all([
        order.save(),
        user.save(),
        userHolding.save(),
        redisClient.del(`holding:${user._id}`),
        redisClient.del(`user:${user._id}:portfolio`),
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
        const pollingInterval = 1000;

        while (!executed && isMarketOpen()) {
            const priceDataStr = await redisClient.get(`livePrice:${stockName}`);
            const currentPrice = priceDataStr ? JSON.parse(priceDataStr).price : null;

            if (!currentPrice) {
                await new Promise(res => setTimeout(res, pollingInterval));
                continue;
            }

            console.log(`📝 Order ${orderId} (${order.action})`);
            console.log(`📌 Ordered: ₹${order.targetPrice} | 💹 Current: ₹${currentPrice}`);

            const shouldExecute = order.action === "BUY"
                ? currentPrice <= order.targetPrice
                : currentPrice >= order.targetPrice;

            if (shouldExecute) {
                await executeOrder(order, user, currentPrice);
                executed = true;
                break;
            }

            await new Promise(res => setTimeout(res, pollingInterval));
        }

        if (!executed) {
            order.status = "FAILED";
            order.user.reservedAmount -= order.targetPrice * order.quantity;
            order.user.balance += order.targetPrice * order.quantity;
            await order.save();
            await redisClient.del(`order:active:${orderId}`);
            await redisClient.lrem("pendingOrders", 0, orderId.toString());
            console.log(`🕒 Order ${orderId} failed or not executable within market hours`);
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
