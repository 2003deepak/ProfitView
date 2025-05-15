const api = require("../../utils/connectWebSocket")

const logout = async (req, res) => {
    // Clear the cookie and invalidate the session

    res.clearCookie('token');
    res.status(200).json({ status: 'success', message: "Logged out successfully" });
};

module.exports = logout;
