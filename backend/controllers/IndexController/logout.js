const WebSocket = require("ws");

let activeWebSocketClients = [];

// Function to close the WebSocket connection for a specific client
const closeWebSocketConnection = (ws) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();  // Close the WebSocket connection
        console.log("WebSocket connection closed.");
    }
};

const logout = (req, res) => {
    // Clear the cookie and invalidate the session
    res.clearCookie('token');
    
    // Close WebSocket connection (if any)
    const wsClient = activeWebSocketClients.find((client) => client.username === req.body.username);
    if (wsClient) {
        closeWebSocketConnection(wsClient.ws);
        activeWebSocketClients = activeWebSocketClients.filter(client => client.username !== req.body.username);  // Remove the client from active clients list
    }

    res.status(200).json({ status: 'success', message: "Logged out successfully" });
};

module.exports = logout;
