const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const {
  register,
  verifyEmail,
  resendOTP,
  login,
  refreshToken,
  logout,
} = require('../controllers/authController');

const {
  registerValidator,
  loginValidator,
  otpValidator,
} = require('../validators/authValidators');

const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { verifyCloudflareTurnstile } = require('../middleware/cloudflare');

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many OTP requests, please try again later.' },
});

router.post('/register', authLimiter, registerValidator, validate, verifyCloudflareTurnstile, register);
router.post('/verify-email', otpLimiter, otpValidator, validate, verifyEmail);
router.post('/resend-otp', otpLimiter, resendOTP);
router.post('/login', authLimiter, loginValidator, validate, verifyCloudflareTurnstile, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);

module.exports = router;
