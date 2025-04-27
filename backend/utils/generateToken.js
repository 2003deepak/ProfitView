const jwt = require('jsonwebtoken');

const generateToken = (id,username,role) =>{
    return jwt.sign({_id : id , username : username , role : role },process.env.JWT_KEY)  
}

module.exports = {generateToken};