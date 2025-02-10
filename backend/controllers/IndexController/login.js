const bcrypt = require("bcrypt");
const userModel = require("../../models/user");
const { generateToken } = require("../../utils/generateToken");
const shoonyaLogin = require("../../controllers/IndexController/shoonyaLogin");
const WebSocket = require("ws");

// Initialize WebSocket server
const webSocketServer = new WebSocket.Server({ port : 8080 });

function broadcast(data) {
    webSocketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}



const login = async (req, res) => {
    const { username, password } = req.body;


    try {
        const user = await userModel.findOne({ username });

        if (user) {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                // Generate JWT token
                const token = generateToken(username, "User");



                // Shoonya API Login
                const shoonyaLoginResult = await shoonyaLogin();

                const stockNames = {
                    "26009": "Bank Nifty",
                    "26000": "Nifty50",
                    "1": "Sensex"
                };
                
                
                // Handle stock price updates
                function receiveQuote(data) {
                    const stockName = stockNames[data.tk] || "Unknown Stock";
                    const livePrice = { stockName, lp: data.lp  };
                
                    // Broadcasting the live price to all connected WebSocket clients
                    // console.log("Broadcasting live price:", livePrice);
                    broadcast(livePrice);
                }
                
                // Log received orders
                function receiveOrders(data) {
                    console.log("Order received:", data);
                }
                
                // Handle WebSocket connection
                function open() {
                    const instruments = "NSE|26009#NSE|26000#BSE|1";
                    shoonyaLoginResult.api.subscribe(instruments);
                    console.log("Subscribing to instruments:", instruments);
                }
                
                const params = {
                    socket_open: open,
                    quote: receiveQuote,
                    order: receiveOrders
                };

                if (shoonyaLoginResult.status === "success") {

                    shoonyaLoginResult.api.start_websocket(params);

                    return res.status(200).json({
                        status: "success",
                        message: "Login Successful",
                        shoonyaApi: shoonyaLoginResult.api,
                    });
                } else {
                    return res.status(500).json({
                        status: "fail",
                        message: "Shoonya API Login Failed",
                    });
                }
            } else {
                return res.status(401).json({
                    status: "fail",
                    message: "Invalid username or password",
                });
            }
        } else {
            return res.status(404).json({
                status: "fail",
                message: "User not found",
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            status: "fail",
            message: "Internal server error",
        });
    }
};

module.exports = login;
