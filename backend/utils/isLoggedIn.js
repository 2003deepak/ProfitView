const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const isLoggedIn = (req, res, next) => {

    
    try {
        // Check if token exists
        if (!req.cookies.token) {
            return res.status(401).json({ status: "fail", message: "User not logged in" });
        }

        const token = req.cookies.token;
        // Verify the token and decode it
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Attach decoded user info to the request object
        req.user = decoded;

        // Proceed to the next middleware
        next();

    } catch (err) {
        return res.status(401).json({ status: "fail", message: "Invalid or expired token" });
    }
};

module.exports = isLoggedIn;
