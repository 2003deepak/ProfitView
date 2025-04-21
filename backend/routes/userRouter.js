const express = require('express');
const router = express.Router();

// Import Controllers
const logout = require("../controllers/userController/logout");
const {sseHandler} = require("../utils/connectWebSocket");
const isLoggedIn = require("../utils/isLoggedIn")
const placeOrder = require("../controllers/userController/placeOrder");
const { logoutShoonya } = require('../utils/logoutShoonya');



router.post('/logout', isLoggedIn , logout);
router.get('/sendPrices' ,sseHandler)
router.post('/placeOrder' , isLoggedIn ,placeOrder);
router.post('/logoutShoonya' , isLoggedIn ,logoutShoonya);




module.exports = router;
