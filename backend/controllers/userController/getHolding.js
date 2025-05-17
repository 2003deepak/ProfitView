const holdingModel = require("../../models/holding");
const redis = require("../../config/redis");

const getHolding = async (req, res) => {
    try {
        const userId = req.user._id.toString();

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
        const userHoldings = await holdingModel.findOne({ user: userId });

        if (!userHoldings) {
            const emptyData = {
                holdings: [],
                totalInvestment: 0,
            };

            // Optionally cache the empty result
            await redis.set(`holding:${userId}`, JSON.stringify(emptyData));

            return res.status(201).json({
                status: "success",
                message: "No Holdings Found (From DB)",
                data: emptyData,
            });
        }

        // If holdings exist, build the response data
        const userData = {
            holdings: userHoldings.holdings || [],
            totalInvestment: userHoldings.totalInvestment || 0,
        };

        // Store the object in Redis
        await redis.set(`holding:${userId}`, JSON.stringify(userData));

        return res.status(201).json({
            status: "success",
            message: "Fetched Holding Successfully (From DB)",
            data: userData,
        });

    } catch (error) {
        console.error("Error fetching holdings:", error);
        return res.status(500).json({
            status: "fail",
            message: "Holdings Error from getHolding API"
        });
    }
};

module.exports = getHolding;
