const Api = require("../config/shoonya-config/RestApi");
const { authparams } = require("../config/shoonya-config/cred");

let api = null;  

const loginShoonya = async () => {
    try {
        if (api) {
            console.log("✅ Shoonya WebSocket already connected");
            return { status: "success", message: "Shoonya WebSocket already connected" };
        }

        api = new Api({});
        const login = await api.login(authparams);

        if (!login || login.stat !== 'Ok') {   
            api = null;
            console.error("Shoonya Login Failed:", login || "No response received");
            return { status: "fail", message: "Shoonya API Login Failed" };
        }

        console.log("✅ Shoonya API Login Successful");
        return { status: "success", message: "Shoonya Login successful" };

    } catch (error) {
        console.error("Error connecting to Shoonya WebSocket:", error);
        api = null;
        return { status: "fail", message: "Internal server error" };
    }
};

const getShoonyaApi = () => api; // To expose current API instance if needed

module.exports = { loginShoonya, getShoonyaApi };
