const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  balance: {
    type: Number,
    default: 1000000,
    min: 0
  },
  reservedAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  resetToken: String,
  resetTokenExpiration: Date
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
