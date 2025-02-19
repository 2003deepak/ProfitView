const express = require('express');
const router = express.Router();

// Import Controllers
const logout = require("../controllers/indexController/logout");
const {connectWebSocket,sseHandler} = require("../controllers/userController/connectWebSocket");
const isLoggedIn = require("../utils/isLoggedIn");
const subscribeStock = require("../controllers/userController/subscribeStock");



router.post('/api/logout', logout);
router.post('/api/connect/websocket',connectWebSocket) ;
router.get('/api/sendPrices',sseHandler) ;
router.post('/api/subscribeStock',subscribeStock) ;



module.exports = router;
