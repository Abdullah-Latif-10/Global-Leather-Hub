const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { verifyCheckoutSession } = require('../controllers/paymentController');

router.get('/verify-session', protect, verifyCheckoutSession);

module.exports = router;
