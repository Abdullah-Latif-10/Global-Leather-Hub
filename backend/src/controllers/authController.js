const User = require('../models/User');
const { generateOTP, getOTPExpiry } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/email');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const logger = require('../utils/logger');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    if (existingUser && !existingUser.isEmailVerified) {
      // Update existing unverified user
      existingUser.username = username;
      existingUser.password = password;
      existingUser.otp = {
        code: otp,
        expiresAt: otpExpiry,
        purpose: 'email_verification',
      };
      await existingUser.save();
    } else {
      // Create new user
      await User.create({
        username,
        email,
        password,
        otp: {
          code: otp,
          expiresAt: otpExpiry,
          purpose: 'email_verification',
        },
      });
    }

    await sendOTPEmail(email, otp, 'verification');

    res.status(201).json({
      success: true,
      message: `Verification code sent to ${email}. Please check your inbox.`,
    });
  } catch (error) {
    next(error);
  }
};


//POST /api/auth/verify-email
const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt +otp.purpose');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or OTP.',
      });
    }

    if (!user.otp || !user.otp.code || user.otp.purpose !== 'email_verification') {
      return res.status(400).json({
        success: false,
        message: 'No pending email verification found.',
      });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code.',
      });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Welcome to Global Leather Hub!',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/auth/resend-otp
const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose = 'email_verification' } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No account found with this email.',
      });
    }

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    user.otp = { code: otp, expiresAt: otpExpiry, purpose };
    await user.save();

    await sendOTPEmail(email, otp, purpose === 'email_verification' ? 'verification' : 'password_change');

    res.status(200).json({
      success: true,
      message: `A new verification code has been sent to ${email}.`,
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in.',
        needsVerification: true,
        email: user.email,
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/auth/refresh-token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Refresh token required.' });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};


// @route   POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Return success to prevent email enumeration, but do not send email
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a verification code has been sent.',
      });
    }

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    user.otp = {
      code: otp,
      expiresAt: otpExpiry,
      purpose: 'password_change',
    };
    await user.save();

    await sendOTPEmail(email, otp, 'password_change');

    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a verification code has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email }).select('+password +otp.code +otp.expiresAt +otp.purpose');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or verification code.',
      });
    }

    if (!user.otp || !user.otp.code || user.otp.purpose !== 'password_change') {
      return res.status(400).json({
        success: false,
        message: 'No pending password reset request found.',
      });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code.',
      });
    }

    user.password = password;
    user.otp = undefined;
    await user.save();

    logger.info(`Password reset successfully for user: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendOTP,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
};
