const Api = require("../../config/shoonya-config/RestApi");
const { authparams } = require("../../config/shoonya-config/cred");

let api = null; 
const sseClients = new Set(); 
const stockDataBuffer = new Map(); 

// 📌 Stock mappings (can be moved to a config file)
const STOCK_MAPPINGS = {
    26009: "Nifty Bank",
    1: "SENSEX",
    26000: "Nifty 50"
};

// 📌 Function to send SSE updates every 2 seconds
setInterval(() => {
    if (stockDataBuffer.size > 0) {
        const stockUpdates = Array.from(stockDataBuffer.values());

        // Broadcast updates to all connected SSE clients
        sseClients.forEach(client => {
            client.res.write(`data: ${JSON.stringify(stockUpdates)}\n\n`);
        });

        stockDataBuffer.clear(); // Clear buffer after sending
    }
}, 2000);

// 📌 Function to handle received stock quote data
function receiveQuote(data) {
    try {
        const stockId = data.tk.toString();
        const stockName = STOCK_MAPPINGS[stockId] || `Unknown Stock (${stockId})`;

        stockDataBuffer.set(stockId, {
            symbol: stockName,
            price: parseFloat(data.lp) || 0,
            lastUpdated: Date.now()
        });

        console.log("Received Stock Quote:", stockDataBuffer);
    } catch (error) {
        console.error("Error processing stock quote:", error);
    }
}

// 📌 Function to handle order updates
function receiveOrders(data) {
    console.log("Received Order:", data);
}

// 📌 Function to subscribe to instruments when WebSocket opens
function open(data, api) {
    const instruments = 'NSE|26009#NSE|26000#BSE|1';
    api.subscribe(instruments);
    console.log("✅ Subscribed to instruments:", instruments);
}

// 📌 Function to start Shoonya WebSocket connection
const connectWebSocket = async (req, res) => {
    try {
        if (api) {
            return res.json({ status: "success", message: "Shoonya WebSocket already connected" });
        }

        api = new Api({});
        const login = await api.login(authparams);

        if (login.stat !== 'Ok') {
            api = null;
            console.error("Shoonya Login Failed:", login);
            return res.status(500).json({ status: "fail", message: "Shoonya API Login Failed" });
        }

        console.log("✅ Shoonya WebSocket Connected");

        // Set up WebSocket event handlers
        api.start_websocket({
            'socket_open': (data) => open(data, api),
            'quote': (data) => receiveQuote(data),
            'order': (data) => receiveOrders(data),
        });

        return res.json({ status: "success", message: "Shoonya WebSocket connected successfully" });

    } catch (error) {
        console.error("Error connecting to Shoonya WebSocket:", error);
        api = null;
        return res.status(500).json({ status: "fail", message: "Internal server error" });
    }
};

// 📌 SSE Handler for frontend updates
const sseHandler = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = { id: Date.now(), res };
    sseClients.add(client);
    console.log("✅ New SSE client connected. Total clients:", sseClients.size);

    req.on('close', () => {
        sseClients.delete(client);
        console.log("❌ SSE client disconnected. Total clients:", sseClients.size);
    });
};



module.exports = { connectWebSocket, sseHandler, api };
