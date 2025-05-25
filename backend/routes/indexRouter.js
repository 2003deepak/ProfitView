const express = require('express');
let isLoggedIn = require("../utils/isLoggedIn");
const router = express.Router();

// Import Controllers
const register = require("../controllers/indexController/register");
const login = require("../controllers/indexController/login");
const {requestForgotPassword , resetPassword} = require("../controllers/indexController/forgotPassword");



// Controller to Register new user
router.post("/register",  register);

// Controller for user login
router.post("/login", login);

router.post("/forgotPassword", requestForgotPassword);

router.post("/resetPassword/:token", resetPassword);





module.exports = router;
