const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../../models/user');


const register = async(req, res) => {

    let {username , email , password } = req.body ; 

    try{
    
        let userExist = await userModel.findOne({email : email});

        if(userExist){
            return res.status(400).json({ status: 'fail', message: 'User already exists' });

        }else{

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, async (err, hash)=> {
        
                    let user = await userModel.create({
                        
                        username: username,
                        password: hash,
                        email: email,
                    })
                    
                    return res.status(201).json({ status: 'success', message: 'User registered successfully' });
                });
            });
        }


    }catch(err){
        return res.status(500).json({ status: 'fail' , message: 'Internal server error' });
    }

}

module.exports = register;