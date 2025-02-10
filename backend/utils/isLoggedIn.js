const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const isLoggedIn = (req, res, next) => {
    

    if (req.cookies.token) {
        return res.status(401).json({ status: "fail", message: "User already logined" });
    }

    next();
};

module.exports = isLoggedIn;