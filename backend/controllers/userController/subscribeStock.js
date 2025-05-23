const { getShoonyaApi } = require('../../utils/loginShoonya');

const subscribeStock = async (req, res) => {
    const stockName = req.params.stockName;

    // const symbol = console.log("Order ID " + {order._id});

    try{
        const api = getShoonyaApi();

        console.log(api);

        api.subscribe(symbol);  // use the dynamic stockName here
        return res.status(201).json({
            status: "success",
            message: `Stock ${stockName} subscribed`,
            api
            
        });
    }catch(err){
        return res.status(500).json({ status: "fail", message: "Something went wrong in subscribeStock : " + err.message });
    }
    
    
}

module.exports = subscribeStock;
