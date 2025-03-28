const Api = require("../../config/shoonya-config/RestApi");
const { authparams } = require("../../config/shoonya-config/cred");

let api = null; 
const sseClients = new Set(); 
const stockDataBuffer = new Map(); 


// 📌 Stock mappings (can be moved to a config file)
const STOCK_MAPPINGS = {
    '1': 'SENSEX',
    '236': 'Asian Paints',
    '305': 'Bajaj Holdings & Investment',
    '317': 'Bajaj Finance',
    '324': 'Angel One',
    '371': 'Bata India',
    '404': 'Berger Paints India',
    '474': '3M India',
    '772': 'Dabur India',
    '910': 'Eicher Motors',
    '1038': 'Finolex Cables',
    '1196': 'Kansai Nerolac Paints',
    '1333': 'HDFC Bank',
    '1394': 'Hindustan Unilever',
    '1467': 'Akzo Nobel India',
    '1567': 'Gillette India',
    '1594': 'Infosys',
    '1660': 'ITC',
    '1922': 'Kotak Mahindra Bank',
    '2048': 'Indigo Paints',
    '2181': 'Bosch',
    '2489': 'ICICI Securities',
    '2643': 'Pfizer',
    '2664': 'Pidilite Industries',
    '3411': 'Tata Elxsi',
    '3417': 'Honeywell Automation India',
    '3506': 'Titan Company',
    '3546': 'TTK Prestige',
    '3744': 'Fine Organic Industries',
    '3906': 'Caplin Point Laboratories',
    '4067': 'Marico',
    '4963': 'ICICI Bank',
    '5610': 'Astrazeneca Pharma India',
    '5900': 'Axis Bank',
    '7229': 'HCL Technologies',
    '7401': 'Rajesh Exports',
    '9590': 'Polycab India',
    '9819': 'Havells India',
    '10099': 'Godrej Consumer Products',
    '10447': 'United Spirits',
    '10738': 'Oracle Financial Services Software',
    '10990': 'Radico Khaitan',
    '11301': 'Lux Industries',
    '11536': 'TCS',
    '11654': 'Dr Lal PathLabs',
    '12716': 'TeamLease Services',
    '13404': 'Sun TV Network',
    '14413': 'Page Industries',
    '15039': 'Cera Sanitaryware',
    '15141': 'Colgate-Palmolive (India)',
    '15362': 'V Guard Industries',
    '16669': 'Bajaj Auto',
    '16675': 'Bajaj Finserv',
    '17364': 'Vinati Organics',
    '17927': 'Bayer Cropscience',
    '17963': 'Nestle India',
    '18011': 'Whirlpool Of India',
    '18056': 'Sheela Foam',
    '21154': 'Procter & Gamble Hygiene & Health Care',
    '21501': 'SIS',
    '21690': 'Dixon Technologies',
    '24190': 'Symphony',
    '24225': 'Relaxo Footwears',
    '26000': 'Nifty 50',
    '26009': 'Nifty Bank',
    '31181': 'Multi Commodity Exchange of India',
    '17869' : "JSW Energy",
    '17903': "Abbott India",
    '1576' : "Gillette India",


  }
    


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

        // console.log(data);

        stockDataBuffer.set(stockId, {
            name: stockName,
            price: parseFloat(data.lp) || 0,
            previousClosingPrice : parseFloat(data.c) || 0 ,
            percentageChange : data.pc || 0 ,
            lastUpdated: Date.now()
        });

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
    let instruments = [
        'NSE|26009', 'NSE|26000', 'BSE|1',     'NSE|21154',
        'NSE|2489',  'NSE|324',   'NSE|21154', 'NSE|21154',
        'NSE|317',   'NSE|305',   'NSE|16675', 'NSE|21154',
        'NSE|21154', 'NSE|21154', 'NSE|16669', 'NSE|1467',
        'NSE|404',   'NSE|236',   'NSE|2643',  'NSE|21154',
        'NSE|21154', 'NSE|18011', 'NSE|9819',  'NSE|371',
        'NSE|14413', 'NSE|3506',  'NSE|1660',  'NSE|4067',
        'NSE|1567',  'NSE|772',   'NSE|15141', 'NSE|2664',
        'NSE|21154', 'NSE|17963', 'NSE|1394',  'NSE|1594',
        'NSE|11536', 'NSE|7229',  'NSE|1333',  'NSE|5900',
        'NSE|4963',  'NSE|1922',  'NSE|13404', 'NSE|10990',
        'NSE|10447', 'NSE|910',   'NSE|2181',  'NSE|3546',
        'NSE|15362', 'NSE|24190', 'NSE|18056', 'NSE|24225',
        'NSE|7401',  'NSE|9590',  'NSE|11301', 'NSE|3417',
        'NSE|15039', 'NSE|21690', 'NSE|1038',  'NSE|10099',
        'NSE|474',   'NSE|1196',  'NSE|2048',  'NSE|17364',
        'NSE|3906',  'NSE|3744',  'NSE|11654', 'NSE|17927',
        'NSE|5610',  'NSE|21501', 'NSE|12716', 'NSE|3411',
        'NSE|10738', 'NSE|31181','NSE|17869','NSE|17903','NSE|1576' 
      ]
    api.subscribe(instruments.join("#"));
    console.log("Subscribing to:", instruments);
}


// 📌 Function to start Shoonya WebSocket connection
const connectWebSocket = async (req, res) => {
    try {
        if (api) {
            return res.json({ status: "success", message: "Shoonya WebSocket already connected" });
        }

        api = new Api({});
        const login = await api.login(authparams);
        // console.log(login);

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






