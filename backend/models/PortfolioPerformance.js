const mongoose = require('mongoose');

const performanceEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now // Store full timestamp
  },
  investedAmount: Number,
  actualAmount: Number
}, { _id: false });

const userPerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
    index: true,
  },
  performance: {
    type: [performanceEntrySchema],
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const PortfolioPerformance = mongoose.model('PortfolioPerformance', userPerformanceSchema);
module.exports = PortfolioPerformance;