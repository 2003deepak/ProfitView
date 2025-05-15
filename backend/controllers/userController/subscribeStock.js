const { getShoonyaApi } = require('../../utils/loginShoonya');

const subscribeStock = async (req, res) => {
    const stockName = req.params.stockName;

    try{
        const api = getShoonyaApi();

        console.log(api);

        // api.subscribe("BSE|1");  // use the dynamic stockName here
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
