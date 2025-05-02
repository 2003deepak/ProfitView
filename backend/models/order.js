const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    stockName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    action: {
        type: String,
        enum: ["BUY", "SELL"],
        required: true
    },
    targetPrice: {
        type: Number,
        required: true,
        min: 0
    },
    executedPrice : {
        type : Number , 
        min : 0 , 
        default : null  
    },
    isMarketOrder : {
        type : Boolean , 
        default : false 
    },
    status: {
        type: String,
        enum: ["OPEN", "CLOSED","FAILED"],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);
