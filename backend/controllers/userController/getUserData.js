const userModel = require("../../models/user");
const redis = require("../../config/redis");

const getUserData = async (req, res) => {
    try {
        const userId = req.user._id;

        // Try to get user from Redis cache
        const cachedUser = await redis.get(`user:${userId}`);

        if (cachedUser) {
            return res.status(200).json({
                status: "success",
                message: "User data fetched successfully (cached)",
                data: JSON.parse(cachedUser),  // Parse string back to object
            });
        }

        // If not in cache, fetch from database
        const currentUser = await userModel.findOne({ _id: userId });

        if (!currentUser) {
            return res.status(404).json({ status: "fail", message: "User not found" });
        }

        const userData = currentUser.toObject(); // Convert Mongoose document to plain JS object

        // Store the user data in Redis (stringify it)
        await redis.set(`user:${userId}`, JSON.stringify(userData));

        return res.status(200).json({
            status: "success",
            message: "User data fetched successfully",
            data: userData,
        });

    } catch (err) {
        return res.status(500).json({ status: "fail", message: "Something went wrong: " + err.message });
    }
};

module.exports = getUserData;
