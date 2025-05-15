const redis = require("../../config/redis");

const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await redis.lrange(`notifications:${userId}`, 0, -1);

        return res.status(200).json({ status: "success", message: notifications });
    } catch (err) {
        console.error("Error fetching notifications:", err);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

module.exports = getNotification;
