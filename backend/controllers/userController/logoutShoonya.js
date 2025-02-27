const Api = require("../../config/shoonya-config/RestApi");
const { authparams } = require("../../config/shoonya-config/cred");
const api = require("./connectWebSocket");



// 📌 Function to start Shoonya WebSocket connection
const logoutShoonya = async (req, res) => {
    try {
        if (!api) {
            return res.json({ status: "success", message: "Shoonya already logged out " });
        }

        // const jData = "";

        // try to log out from the API server of shoonya 
        // const response = await axios.post("https://api.shoonya.com/NorenWClientTP/Logout" , jData = {authparams});
        

    } catch (error) {
        console.error("Error disconnecting to Shoonya WebSocket:", error);
        api = null;
        return res.status(500).json({ status: "fail", message: "Internal server error" });
    }
};


module.exports = { logoutShoonya };
