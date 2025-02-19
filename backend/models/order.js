const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   
    orderedBy: {
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
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["OPEN", "CLOSED"],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);
