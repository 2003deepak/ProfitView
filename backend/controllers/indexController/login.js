const bcrypt = require('bcrypt');
const userModel = require('../../models/user');
const { generateToken } = require('../../utils/generateToken');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username });

        if (user) {

            const match = await bcrypt.compare(password, user.password); 

            if (match) {

                // Generate JWT Token
                const token = generateToken(username,"User");
                res.cookie('token', token);
                return res.status(201).json({ status: 'success', message: 'User logged in successfully' , token : token });

            } else {
                
                return res.status(400).json({ status: 'fail', message: 'Invalid Username or Password' });
            }

        } else {


            
            return res.status(400).json({ status: 'fail', message: 'Invalid Username or Password' });
        }
    } catch (err) {

       

        return res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
};


module.exports = login;