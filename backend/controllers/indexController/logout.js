const { logoutShoonya } = require("../userController/connectWebSocket");

const logout = (req, res) => {
    // Clear the cookie and invalidate the session
    res.clearCookie('token');

    // Logout from Shoonya API
    if(logoutShoonya()){
        console.log("✅ Logged out from Shoonya API");
    };

    res.status(200).json({ status: 'success', message: "Logged out successfully" });
};

module.exports = logout;
