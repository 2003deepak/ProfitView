const express = require('express');
const router = express.Router();

// Import Controllers
const logout = require("../controllers/userController/logout");
const {sseHandler} = require("../utils/connectWebSocket");
const isLoggedIn = require("../utils/isLoggedIn")
const placeOrder = require("../controllers/userController/placeOrder");
const { logoutShoonya } = require('../utils/logoutShoonya');
const getHolding = require('../controllers/userController/getHolding');
const subscribeStock = require("../controllers/userController/subscribeStock")



router.post('/logout', isLoggedIn , logout);
router.get('/sendPrices' ,sseHandler)
router.post('/placeOrder' , isLoggedIn ,placeOrder);
router.post('/logoutShoonya' , isLoggedIn ,logoutShoonya);
router.post('/subscribeStock/:stockName' , isLoggedIn , subscribeStock);
router.get('/getHolding',isLoggedIn,getHolding);




module.exports = router;
