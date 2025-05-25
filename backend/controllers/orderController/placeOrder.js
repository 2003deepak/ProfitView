const userModel = require("../../models/user");
const orderModel = require("../../models/order");
const holdingModel = require("../../models/holding");
const orderQueue = require("../../config/bullMq");
const redis = require("../../config/redis");

const placeOrder = async (req, res) => {
    try {
        const { stockName, action, quantity, targetPrice , isMarketOrder} = req.body;

        console.log("🟡 Placing order for:", stockName, action, quantity, targetPrice);

        const parsedQuantity = parseInt(quantity, 10);
        const parsedTargetPrice = parseFloat(targetPrice);

        // ✅ Validate user
        const user = await userModel.findOne({ username: req.user.username });
        if (!user) {
            console.log("Error in User")
            return res.status(400).json({ status: "fail", message: "User not found" });
        }

        // ✅ Validate inputs
        if (!["BUY", "SELL"].includes(action)) {
            return res.status(400).json({ status: "fail", message: "Invalid order type" });
        }

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ status: "fail", message: "Invalid quantity" });
        }

        

        if (!isMarketOrder && isNaN(parsedTargetPrice) || parsedTargetPrice <= 0) {
            return res.status(400).json({ status: "fail", message: "Invalid target price" });
        }

        // ✅ Fetch live price from Redis
        const liveDataStr = await redis.get(`livePrice:${stockName}`);
        if (!liveDataStr) {
            return res.status(400).json({
                status: "fail",
                message: "Live stock price not available yet. Please try again in a moment."
            });
        }

       
        const liveData = JSON.parse(liveDataStr);
        const livePrice = liveData.price;

        // console.log(`💹 Live price of ${stockName} = ₹${livePrice}`);

        if (!livePrice || livePrice <= 0) {
            return res.status(400).json({ status: "fail", message: "Invalid live stock price" });
        }

        const totalCost = isMarketOrder ? parsedQuantity * livePrice : parsedQuantity * parsedTargetPrice;

        if (action === "BUY") {
            // ✅ BUY: Check user balance
            if (user.balance < totalCost) {
                return res.status(400).json({
                    status: "fail",
                    message: "Insufficient balance to place BUY order"
                });
            }

            user.balance -= totalCost;
            user.reservedAmount += totalCost;
        } else if (action === "SELL") {
            // ✅ SELL: Check holdings
            const holding = await holdingModel.findOne({ user: user._id });
            if (!holding) {
                return res.status(400).json({ status: "fail", message: "You don't have any holdings yet" });
            }

            const stockHolding = holding.holdings.find(h => h.stock_name === stockName);
            if (!stockHolding || stockHolding.quantity < parsedQuantity) {
                return res.status(400).json({
                    status: "fail",
                    message: `Not enough shares of ${stockName} to SELL. You have ${stockHolding ? stockHolding.quantity : 0}`
                });
            }

        }

        // ✅ Create order
        const order = await orderModel.create({
            user: user._id,
            stockName,
            quantity: parsedQuantity,
            action,
            targetPrice: isMarketOrder ? livePrice : parsedTargetPrice,
            isMarketOrder : isMarketOrder ? true : false ,
            status: "OPEN"
        });

        // ✅ Save user (only needed for BUY as SELL didn't modify balance)
        if (action === "BUY") await user.save();

        // ✅ Push to queue
        await redis.lpush("pendingOrders", order._id.toString());
        await orderQueue.add("processOrder", { orderId: order._id });

        // Delete the userOrders Cache , to get the updated User Order 
        await redis.del(`userOrders:${req.user._id}`);

        // Delete the userData , to update the balance 
        await redis.del(`user:${req.user._id}`);

        console.log("✅ Order placed and added to queue:", order._id);

        return res.status(201).json({
            status: "success",
            message: "Order placed successfully and is now in queue for execution.",
            order
        });

    } catch (err) {
        console.error("🔥 Order placement error:", err);
        return res.status(500).json({ status: "fail", message: "Something went wrong: " + err.message });
    }
};

module.exports = placeOrder;
