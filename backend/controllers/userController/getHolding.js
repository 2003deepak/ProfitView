const holdingModel = require("../../models/holding");
const redis = require("../../config/redis"); 

const getHolding = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        
        console.log("User ID:", userId);
        // Try to get holdings from Redis cache
        const cachedHoldings = await redis.get(`holding:${userId}`);

        if (cachedHoldings) {
            return res.status(200).json({
                status: "success",
                message: "Fetched Holding Successfully (from cache)",
                data: JSON.parse(cachedHoldings),
            });
        }

        // If not found in cache, query from database
        const user = await holdingModel.findOne({ user: userId });

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "No User Found",
            });
        }

        const userData = {
            holdings: user.holdings,
            totalInvestment: user.totalInvestment,
          };
          
        // Store the object in Redis
        await redis.set(`holding:${userId}`, JSON.stringify(userData));

      

        return res.status(201).json({
            status: "success",
            message: "Fetched Holding Successfully ( From DB )",
            data: user.holdings,
        });

    } catch (error) {
        console.error("Error fetching holdings:", error);
        return res.status(500).json({
            status: 'fail',
            message: 'Holdings Error from getHolding API'
        });
    }
};

module.exports = getHolding;
