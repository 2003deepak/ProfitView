const mongoose = require('mongoose');

const DailyPortfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: String, // e.g., "2025-05-03"
    required: true,
    index: true
  },
  invested: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    required: true
  },
  gain: {
    type: Number,
    default: function () {
      return ((this.current - this.invested) / this.invested) * 100;
    }
  }
}, { timestamps: true });

// Ensure only one entry per user per date
DailyPortfolioSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyPortfolio', DailyPortfolioSchema);
