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
    }
  });
  
  module.exports = mongoose.model("user", userSchema);