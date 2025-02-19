const {api} = require('./connectWebSocket');

const subscribeStock = async (req, res) =>{
    api.subscribe("BSE|1");

    return res.json({ status: "success", message: "Stock Subscribed" });
}

module.exports = subscribeStock ;