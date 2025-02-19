const api = require("../userController/connectWebSocket")

const logout = (req, res) => {
    // Clear the cookie and invalidate the session
    res.clearCookie('token');
    res.status(200).json({ status: 'success', message: "Logged out successfully" });
};

module.exports = logout;
