// Define stock names for easy reference
const stockNames = {
    "26009": "Bank Nifty",
    "26000": "Nifty50",
    "1": "Sensex"
};


function broadcast(data, webSocketServer) {
    if (!webSocketServer) {
        console.error("WebSocket server is not initialized.");
        return;
    }

    webSocketServer.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
            try {
                client.send(JSON.stringify(data));
            } catch (error) {
                console.error("Error broadcasting data to client:", error);
            }
        }
    });
}

const receiveQuote = (data, webSocketServer) => {
    if (!data || typeof data !== "object") {
        console.error("Invalid data received:", data);
        return;
    }

    const stockName = stockNames[data.tk] || "Unknown Stock";
    const livePrice = {
        stockName,
        lastPrice: data.lp,
        timestamp: new Date().toISOString(),
    };

    console.log("Received stock update:", livePrice);

    // Broadcast the live price to all connected WebSocket clients
    broadcast(livePrice, webSocketServer);
};

/**
 * Handles order updates received from Shoonya API.
 * This is a placeholder and can be extended based on project requirements.
 * @param {Object} data - The order data received.
 */
const receiveOrders = (data) => {
    console.log("Received order update:", data);
    // Add any logic to process orders, if required
};

// Export functions for use in other modules
module.exports = {
    receiveQuote,
    broadcast,
    receiveOrders
};
