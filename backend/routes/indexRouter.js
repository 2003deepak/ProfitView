const express = require('express');
let isLoggedIn = require("../utils/isLoggedIn");
const router = express.Router();

// Import Controllers
const register = require("../controllers/IndexController/register");
const login = require("../controllers/IndexController/login");



// Controller to Register new user
router.post("/register", isLoggedIn, register);

// Controller for user login
router.post("/login", isLoggedIn , login);






module.exports = router;
