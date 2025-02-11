const express = require('express');
const router = express.Router();

// Import Controllers
const logout = require("../controllers/indexController/logout");
const {connectWebSocket,sseHandler} = require("../controllers/userController/connectWebSocket");
const isLoggedIn = require("../utils/isLoggedIn");



router.post('/api/logout', logout);
router.post('/api/connect/websocket',connectWebSocket) ;
router.get('/api/sendPrices',sseHandler) ;



module.exports = router;
