const express = require('express');
const router = express.Router();

// Import Controllers
const logout = require("../controllers/userController/logout");
const {sseHandler} = require("../utils/connectWebSocket");
const isLoggedIn = require("../utils/isLoggedIn")
const placeOrder = require("../controllers/userController/placeOrder");
const { logoutShoonya } = require('../utils/logoutShoonya');
const getHolding = require('../controllers/userController/getHolding');
const subscribeStock = require("../controllers/userController/subscribeStock");
const getUserData = require('../controllers/userController/getUserData');
const updateUserDetails = require('../controllers/userController/updateUserDetails');
const getOrders = require('../controllers/userController/getOrders');
const getNotification = require('../controllers/userController/getNotification');



router.post('/logout', isLoggedIn , logout);
router.get('/sendData' ,isLoggedIn,sseHandler)
router.post('/placeOrder' , isLoggedIn ,placeOrder);
router.post('/logoutShoonya' , isLoggedIn ,logoutShoonya);
router.post('/subscribeStock/:stockName' , isLoggedIn , subscribeStock);
router.get('/getHolding',isLoggedIn,getHolding);
router.get('/getUserData',isLoggedIn,getUserData);
router.get("/getOrders" , isLoggedIn , getOrders);
router.get("/getNotifications" , isLoggedIn,getNotification);
router.put('/updateUser',isLoggedIn,updateUserDetails);




module.exports = router;
