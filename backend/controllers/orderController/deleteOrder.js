const orderModel = require("../../models/order");
const userModel = require("../../models/user");
const redis = require("../../config/redis");
const orderQueue = require("../../config/bullMq");

// Create Redis publisher instance
const redisPublisher = redis.duplicate();

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Validate orderId
        if (!orderId) {
            return res.status(400).json({ status: "fail", message: "Order ID is required" });
        }

        // Check if the order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ status: "fail", message: "Order not found" });
        }

        // Check authorization
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user._id.toString() !== order.user.toString()) {
            return res.status(403).json({ status: "fail", message: "Unauthorized to delete" });
        }

        // Credit back reserved amounts
        if (order.action === "BUY") {
            user.reservedAmount -= order.targetPrice * order.quantity;
            user.balance += order.targetPrice * order.quantity;
        } else if (order.action === "SELL") {
            user.holdings[order.stockName] = (user.holdings[order.stockName] || 0) + order.quantity;
        }

        await user.save();

        // Delete the order from database
        await orderModel.findByIdAndDelete(orderId);

        // Remove from Redis and queues
        const redisOperations = [
            // Set tombstone to prevent worker from processing
            redis.set(`order:deleted:${orderId}`, "true", "EX", 60),
            
            // Remove from active orders
            redis.del(`order:active:${order._id}`),
            
            // Remove from pending orders list
            redis.lrem("pendingOrders", 0, order._id.toString()),
            
            // Clear user-related caches
            redis.del(`userOrders:${req.user._id}`),
            redis.del(`user:${req.user._id}`),
            redis.del(`user:${req.user._id}:portfolio`),
            redis.del(`holding:${req.user._id}`)
        ];

        await Promise.all(redisOperations);

        // Remove from Bull queue if being processed
        const jobs = await orderQueue.getJobs(['waiting', 'active', 'delayed']);
        const jobToRemove = jobs.find(job => job.data.orderId === order._id.toString());
        if (jobToRemove) {
            await jobToRemove.remove();
        }

        // Publish notification
        await redisPublisher.publish('order-updates', JSON.stringify({
            userId: user._id.toString(),
            updateType: "Order Deleted",
            status: "success",
            orderId: order._id.toString(),
            stockName: order.stockName,
            action: order.action,
            quantity: order.quantity,
            timestamp: new Date().toISOString()
        }));

        return res.status(200).json({ 
            status: "success", 
            message: "Order deleted successfully",
            data: {
                orderId: order._id,
                stockName: order.stockName,
                action: order.action,
                quantity: order.quantity
            }
        });

    } catch(err) {
        console.error("Order deletion error:", err);
        return res.status(500).json({ 
            status: "fail", 
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? err.message : undefined
        });
    }
};

module.exports = deleteOrder;