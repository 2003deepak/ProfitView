const bcrypt = require('bcrypt');
const userModel = require('../../models/user');


const placeOrder = async (req,res) =>{

    const {orderedBy,stockName,quantity,action,price,status} = req.body ; 

    // First check the orderedBy is valid and correct or not 
    let user = userModel.find({_id : orderedBy});

    if(!user){
        return res.status(400).json({ status: 'fail', message: 'User not found' });
    }

    


}

modules.export = {placeOrder} ; 