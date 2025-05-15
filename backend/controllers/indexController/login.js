require("dotenv").config(); 
const bcrypt = require('bcrypt');
const userModel = require('../../models/user');
const { generateToken } = require('../../utils/generateToken');
const { loginShoonya } = require('../../utils/loginShoonya');
const { connectWebSocket } = require('../../utils/connectWebSocket');

const SIMULATION_MODE = process.env.SIMULATION_MODE === 'true';

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Invalid Username or Password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ status: 'fail', message: 'Invalid Username or Password' });
        }

        if(!SIMULATION_MODE){

            // Login to Shoonya
            const shoonyaLogin = await loginShoonya();
            if (shoonyaLogin.status !== 'success') {
                return res.status(500).json({ status: 'fail', message: 'Shoonya login failed' });
            }

        }
        

        // Start WebSocket immediately after successful Shoonya login
        connectWebSocket();

        // Generate JWT token
        const token = generateToken(user._id , username, "User");
        res.cookie('token', token);

        return res.status(201).json({ 
            status: 'success', 
            message: 'User logged in successfully', 
            token 
        });

    } catch (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
};

module.exports = login;
