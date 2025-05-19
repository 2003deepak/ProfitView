const orderModel = require("../../models/order");
const userModel = require("../../models/user");
const redis = require("../../config/redis");
const orderQueue = require("../../config/bullMq");

// Create Redis publisher instance
const redisPublisher = redis.duplicate();

const updateOrder = async (req, res) => {
    try {
        const { orderId, targetPrice, quantity, isMarketOrder } = req.body;

        // ✅ Enhanced Input validation
        if (!orderId) {
            return res.status(400).json({
                status: "fail",
                message: "Valid orderId must be provided",
            });
        }

        // Validate targetPrice if provided
        if (targetPrice !== undefined && (typeof targetPrice !== "number" || targetPrice <= 0 || isNaN(targetPrice))) {
            return res.status(400).json({
                status: "fail",
                message: "targetPrice must be a positive number",
            });
        }

        // Validate quantity if provided
        if (quantity !== undefined && (typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity))) {
            return res.status(400).json({
                status: "fail",
                message: "quantity must be a positive integer",
            });
        }

        // ✅ Find and validate the existing order
        const existingOrder = await orderModel.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({
                status: "fail",
                message: "Order not found",
            });
        }

        // Check ownership (assuming req.user is populated from auth middleware)
        if (existingOrder.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: "fail",
                message: "Unauthorized to update this order",
            });
        }

        if (["CLOSED", "FAILED"].includes(existingOrder.status)) {
            return res.status(400).json({
                status: "fail",
                message: "Closed or failed orders cannot be updated",
            });
        }

        // Track changes for notification
        const changes = {};
        const originalValues = {
            targetPrice: existingOrder.targetPrice,
            quantity: existingOrder.quantity,
            isMarketOrder: existingOrder.isMarketOrder
        };

        // Get user data
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found",
            });
        }

        // Calculate reserved amount changes for BUY orders
        let reservedAmountChange = 0;
        
        // ✅ Update fields if they are provided and different
        if (targetPrice !== undefined && existingOrder.targetPrice !== targetPrice) {
            // For BUY orders, calculate the difference in reserved amount
            if (existingOrder.action === "BUY") {
                const oldReserved = existingOrder.targetPrice * existingOrder.quantity;
                const newReserved = targetPrice * existingOrder.quantity;
                reservedAmountChange += (newReserved - oldReserved);
            }
            
            existingOrder.targetPrice = targetPrice;
            changes.targetPrice = { from: originalValues.targetPrice, to: targetPrice };
        }

        if (quantity !== undefined && existingOrder.quantity !== quantity) {
            // For BUY orders, calculate the difference in reserved amount
            if (existingOrder.action === "BUY") {
                const oldReserved = existingOrder.targetPrice * existingOrder.quantity;
                const newReserved = existingOrder.targetPrice * quantity;
                reservedAmountChange += (newReserved - oldReserved);
            }
            
            existingOrder.quantity = quantity;
            changes.quantity = { from: originalValues.quantity, to: quantity };
        }

        if (isMarketOrder !== undefined && existingOrder.isMarketOrder !== isMarketOrder) {
            existingOrder.isMarketOrder = isMarketOrder;
            changes.isMarketOrder = { from: originalValues.isMarketOrder, to: isMarketOrder };
            
            // If converting to market order, set target price to current market price
            if (isMarketOrder) {
                const priceData = await redis.get(`livePrice:${existingOrder.stockName}`);
                if (priceData) {
                    const currentPrice = JSON.parse(priceData).price;
                    // For BUY orders, calculate the difference in reserved amount
                    if (existingOrder.action === "BUY") {
                        const oldReserved = existingOrder.targetPrice * existingOrder.quantity;
                        const newReserved = currentPrice * existingOrder.quantity;
                        reservedAmountChange += (newReserved - oldReserved);
                    }
                    
                    changes.targetPrice = { from: existingOrder.targetPrice, to: currentPrice };
                    existingOrder.targetPrice = currentPrice;
                }
            }
        }

        // Check if any changes were made
        if (Object.keys(changes).length === 0) {
            return res.status(200).json({
                status: "success",
                message: "No changes detected",
                order: existingOrder,
            });
        }

        // For BUY orders, validate the user has enough available balance
        if (existingOrder.action === "BUY" && reservedAmountChange !== 0) {
            const newReservedAmount = user.reservedAmount + reservedAmountChange;
            const availableBalance = user.balance - newReservedAmount;
            
            if (availableBalance < 0) {
                return res.status(400).json({
                    status: "fail",
                    message: "Insufficient available balance for this update",
                    availableBalance: user.balance - user.reservedAmount,
                    requiredAdditional: Math.abs(availableBalance)
                });
            }

            // Update the reserved amount
            user.reservedAmount = newReservedAmount;
            await user.save();
        }

        // ✅ Update order in DB
        existingOrder.updatedAt = new Date();
        await existingOrder.save();

        // ✅ Update Redis cache
        await redis.set(`order:active:${orderId}`, "true", "EX", 300); // Refresh TTL

        // Re-add to queue if any execution-related parameters changed
        if (changes.targetPrice || changes.quantity || changes.isMarketOrder) {
            await redis.lrem("pendingOrders", 0, orderId.toString());
            await redis.lpush("pendingOrders", orderId.toString());
            await orderQueue.add("processOrder", { orderId });
        }

        // Clear relevant caches
        await Promise.all([
            redis.del(`userOrders:${req.user._id.toString()}`),
            redis.del(`holding:${req.user._id.toString()}`),
            redis.del(`user:${req.user._id.toString()}:portfolio`)
        ]);

        // Prepare notification message
        let message = "Order updated: ";
        const messageParts = [];
        
        if (changes.targetPrice) {
            messageParts.push(`price changed from ₹${changes.targetPrice.from} to ₹${changes.targetPrice.to}`);
        }
        if (changes.quantity) {
            messageParts.push(`quantity changed from ${changes.quantity.from} to ${changes.quantity.to}`);
        }
        if (changes.isMarketOrder) {
            messageParts.push(`changed to ${changes.isMarketOrder.to ? 'market' : 'limit'} order`);
        }
        
        message += messageParts.join(", ");

        // Publish order update notification
        try {
            await redisPublisher.publish('order-updates', JSON.stringify({
                userId: req.user._id.toString(),
                updateType: "Order Updated",
                status: "success",
                orderId: existingOrder._id.toString(),
                stockName: existingOrder.stockName,
                action: existingOrder.action,
                quantity: existingOrder.quantity,
                previousPrice: originalValues.targetPrice,
                newPrice: existingOrder.targetPrice,
                isMarketOrder: existingOrder.isMarketOrder,
                timestamp: new Date().toISOString(),
                message: message
            }));

            console.log(`📡 Published order update notification for order ${orderId}`);
        } catch (err) {
            console.error('📡 Redis publish error:', err);
        }

        return res.status(200).json({
            status: "success",
            message: "Order updated successfully",
            changes: changes,
            updatedOrder: existingOrder,
        });

    } catch (error) {
        console.error("❌ Error updating order:", error.message);
        return res.status(500).json({
            status: "fail",
            message: "Internal server error while updating order",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = updateOrder;