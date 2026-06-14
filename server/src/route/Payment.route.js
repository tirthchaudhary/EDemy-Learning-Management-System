const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, handleRazorpayWebhook } = require('../controller/Payment.controller');
const { AuthMiddleware } = require('../middleware/authMiddleware');

router.post('/create-order', AuthMiddleware, createOrder);
router.post('/verify-payment', AuthMiddleware, verifyPayment);
router.post('/webhook', handleRazorpayWebhook);

module.exports = router;
