const orderModel = require("../../models/order");
const redis = require("../../config/redis");
const moment = require("moment");

const getOrders = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const cacheKey = `userOrders:${userId}`;

    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        status: "success",
        message: "Orders fetched from cache",
        data: JSON.parse(cachedData),
      });
    }

    // Fetch all orders for the user from DB
    const orders = await orderModel.find({ user: userId }).sort({ orderDate: -1 });

    if (!orders) {
      return res.status(404).json({ 
        status: "fail", 
        message: "No orders found",
        data: {
          executedOrders: [],
          openOrders: [],
          todaysOrders: [],
          allOrders: []
        }
      });
    }

    // Get today's date at start of day for comparison
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');

    // Filter orders
    const todaysOrders = orders.filter(order => 
      moment(order.orderDate).isBetween(todayStart, todayEnd, null, '[]')
    );

    const openOrders = todaysOrders.filter(order => 
      order.status === "OPEN" 
    );

    const executedOrders = todaysOrders.filter(order => 
      order.status === "CLOSED"
    );

    // Prepare response data
    const responseData = {
      openOrders,
      executedOrders,
      todaysOrders,
      allOrders: orders
    };

    // Cache result in Redis (5 minutes TTL)
    await redis.set(cacheKey, JSON.stringify(responseData));

    return res.status(200).json({
      status: "success",
      message: "Orders fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

module.exports = getOrders;