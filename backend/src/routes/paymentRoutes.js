const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { verifyCheckoutSession } = require('../controllers/paymentController');
const cartController = require('../controllers/cartController');

router.get('/verify-session', protect, verifyCheckoutSession);

router.post('/create-checkout-session', protect, cartController.createStripeCheckoutSession);

module.exports = router;
