const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  holdings: [
    {
      stock_name: {
        type: String,
        required: true,
        trim: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 0
      },
      average_price: {
        type: Number,
        required: true,
        min: 0
      },
    }
  ],
  totalInvestment: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

holdingSchema.pre("save", function (next) {
  this.totalInvestment = this.holdings.reduce(
    (sum, h) => sum + h.quantity * h.average_price,
    0
  );
  next();
});

module.exports = mongoose.model("holding", holdingSchema);
