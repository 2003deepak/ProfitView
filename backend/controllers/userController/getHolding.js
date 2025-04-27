const holdingModel = require("../../models/holding");

const getHolding = async (req, res) => {
    try {
        // Make sure to use await
        const user = await holdingModel.findOne({ user: req.user._id });

        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "No User Found",
            });
        }

        return res.status(201).json({ 
            status: 'success', 
            message: 'Fetched Holding Successfully', 
            data : user.holdings
        });

    } catch (error) {
        console.error("Error fetching holdings:", error);
        return res.status(500).json({ status: 'fail', message: 'Holdings Error from getHolding API' });
    }
};

module.exports = getHolding;
