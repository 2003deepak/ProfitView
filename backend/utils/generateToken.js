const jwt = require('jsonwebtoken');

const generateToken = (username,role) =>{
    return jwt.sign({username : username , role : role },process.env.JWT_KEY)  
}

module.exports = {generateToken};