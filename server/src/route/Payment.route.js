const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, handleRazorpayWebhook, testRazorpay } = require('../controller/Payment.controller');
const { AuthMiddleware } = require('../middleware/authMiddleware');

router.get('/test', testRazorpay);
router.post('/create-order', AuthMiddleware, createOrder);
router.post('/verify-payment', AuthMiddleware, verifyPayment);
router.post('/webhook', handleRazorpayWebhook);

module.exports = router;
