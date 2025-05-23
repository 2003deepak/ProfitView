const express = require('express');
const router = express.Router();

// Import Controllers
const placeOrder = require("../controllers/orderController/placeOrder");
const updateOrder = require("../controllers/orderController/updateOrder");
const deleteOrder = require("../controllers/orderController/deleteOrder");
const isLoggedIn = require("../utils/isLoggedIn");
const getOrders = require('../controllers/orderController/getOrders');



router.post('/placeOrder' , isLoggedIn , placeOrder);
router.get('/getOrders' , isLoggedIn , getOrders);
router.post('/updateOrder' ,isLoggedIn , updateOrder);
router.post('/deleteOrder' ,isLoggedIn , deleteOrder);




module.exports = router;
