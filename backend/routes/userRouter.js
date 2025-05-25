const express = require('express');
const router = express.Router();

// Import Controllers
const logout = require("../controllers/userController/logout");
const {sseHandler} = require("../utils/connectWebSocket");
const isLoggedIn = require("../utils/isLoggedIn")

const { logoutShoonya } = require('../utils/logoutShoonya');
const getHolding = require('../controllers/userController/getHolding');
const subscribeStock = require("../controllers/userController/subscribeStock");
const getUserData = require('../controllers/userController/getUserData');
const updateUserDetails = require('../controllers/userController/updateUserDetails');
const getNotification = require('../controllers/userController/getNotification');
const getPortfolioPerformance = require('../controllers/userController/getPortfolioPerformance');




router.post('/logout', isLoggedIn , logout);
router.get('/sendData' ,isLoggedIn,sseHandler)
router.post('/logoutShoonya' , isLoggedIn ,logoutShoonya);
router.post('/subscribeStock/:stockName' , isLoggedIn , subscribeStock);
router.get('/getHolding',isLoggedIn,getHolding);
router.get('/getUserData',isLoggedIn,getUserData);
router.get("/getNotifications" , isLoggedIn,getNotification);
router.put('/updateUser',isLoggedIn,updateUserDetails);
router.get('/getPortfolioPerformance', isLoggedIn, getPortfolioPerformance);





module.exports = router;
