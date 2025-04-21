// placeOrder.js

const userModel = require("../../models/user");
const orderModel = require("../../models/order");
const orderQueue = require("../../config/bullMq");
const redisClient = require("../../config/redis");

const placeOrder = async (req, res) => {
    try {
        const { stockName, action, quantity, targetPrice } = req.body;

        console.log("🟡 Placing order for:", stockName, action, quantity, targetPrice);

        const parsedQuantity = parseInt(quantity, 10);
        const parsedTargetPrice = parseFloat(targetPrice);

        // Validate user
        const user = await userModel.findOne({ username: req.user.username });
        if (!user) {
            return res.status(400).json({ status: "fail", message: "User not found" });
        }

        // Validate inputs
        if (!["BUY", "SELL"].includes(action)) {
            return res.status(400).json({ status: "fail", message: "Invalid order type" });
        }

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ status: "fail", message: "Invalid quantity" });
        }

        if (isNaN(parsedTargetPrice) || parsedTargetPrice <= 0) {
            return res.status(400).json({ status: "fail", message: "Invalid target price" });
        }

        // Fetch live price from Redis
        const liveDataStr = await redisClient.get(`livePrice:${stockName}`);
        if (!liveDataStr) {
            return res.status(400).json({ status: "fail", message: "Live stock price not available yet. Please try again in a moment." });
        }

        const liveData = JSON.parse(liveDataStr);
        const livePrice = liveData.price;

        console.log(`💹 Live price of ${stockName} = ₹${livePrice}`);

        if (!livePrice || livePrice <= 0) {
            return res.status(400).json({ status: "fail", message: "Invalid live stock price" });
        }

        const totalCost = parsedQuantity * parsedTargetPrice;

        // Check user balance for BUY
        if (action === "BUY" && user.balance < totalCost) {
            return res.status(400).json({ status: "fail", message: "Insufficient balance" });
        }

        // Create order
        const order = await orderModel.create({
            user: user._id,
            stockName,
            quantity: parsedQuantity,
            action,
            price: parsedTargetPrice,
            status: "OPEN"
        });

        // Save user & push to queue
        await user.save();
        await redisClient.lpush("pendingOrders", order._id.toString());
        await orderQueue.add("processOrder", { orderId: order._id });

        console.log("✅ Order placed and added to queue:", order._id);

        return res.status(201).json({
            status: "success",
            message: "Order placed successfully, processing in queue",
            order
        });

    } catch (err) {
        console.error("🔥 Order placement error:", err);
        return res.status(500).json({ status: "fail", message: "Something went wrong: " + err.message });
    }
};

module.exports = placeOrder;
