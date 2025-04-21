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
      default: null 
    },
    password: { 
      type: String, 
      default: null 
    },
    email: { 
      type: String, 
      default: null 
    },
    balance : {
      type : Number,
      default : 1000000
    },
    holdings: {
      type : mongoose.Schema.ObjectId,
      ref : "holding"
    }
  });
  
  module.exports = mongoose.model("user", userSchema);