const express = require('express');
const router = express.Router();

// Import Controllers
const logout = require("../controllers/IndexController/logout");
const isLoggedIn = require("../utils/isLoggedIn");



router.post('/api/logout', isLoggedIn , logout);



module.exports = router;
