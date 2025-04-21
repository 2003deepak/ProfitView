const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const redisClient = require("./config/redis");
const orderModel = require("./models/order");
const userModel = require("./models/user");
const db = require("./config/mongoose-connection");

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

        const user = await userModel.findById(order.user); // 🔍 Fetch user by order.user
        if (!user) {
            console.log("❌ Associated user not found");
            return;
        }

        const stockName = order.stockName;
        let executed = false;
        const startTime = Date.now();
        const maxDuration = 300000; // 5 minutes

        while (!executed && Date.now() - startTime < maxDuration) {
            const priceDataStr = await redisClient.get(`livePrice:${stockName}`);
            const currentPrice = priceDataStr ? JSON.parse(priceDataStr).price : null;

            if (!currentPrice) {
                await new Promise(res => setTimeout(res, 1000));
                continue;
            }

            console.log(`🧾 Order ${orderId} (${order.action})`);
            console.log(`📌 Ordered: ₹${order.price} | 💹 Current: ₹${currentPrice}`);

            const shouldExecute = order.action === "BUY"
                ? currentPrice <= order.price
                : currentPrice >= order.price;

            if (shouldExecute) {
                order.executedPrice = currentPrice;
                order.status = "CLOSED";
                await order.save();

                // 💰 Deduct balance for BUY
                const totalCost = order.price * order.quantity;
                if (order.action === "BUY") {
                    user.balance -= totalCost;
                    await user.save();
                    console.log(`💸 Deducted ₹${totalCost} from user ${user.username}`);
                }

                await redisClient.del(`order:active:${orderId}`);
                await redisClient.lrem("pendingOrders", 0, orderId);

                console.log(`✅ Executed ${order.action} @ ₹${currentPrice}\n`);
                executed = true;
            } else {
                const delay = Math.abs(currentPrice - order.price) < (order.price * 0.01) ? 500 : 1000;
                console.log(`⏳ Waiting for price threshold...`);
                await new Promise(res => setTimeout(res, delay));
            }
        }

        if (!executed) {
            console.log(`🕒 Order ${orderId} expired after 5 minutes`);
            await redisClient.del(`order:active:${orderId}`);
            await redisClient.lrem("pendingOrders", 0, orderId);
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
