const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xssClean = require('xss-clean');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const shippingRoutes = require('./routes/shippingRoutes');
const paymentController = require('./controllers/paymentController');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const connectDB = require('./config/database');

const app = express();

// Ensure database connection is active on every request (serverless compatible)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.set('trust proxy', 1);
// Stripe webhooks require the raw body for signature verification
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook
);

app.use(helmet());
app.use(xssClean());

app.use(
  cors({
    origin:   "https://global-leather-hub-1fvf.vercel.app",  
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const requestLogFormat = process.env.REQUEST_LOG_FORMAT || 'combined';
if (requestLogFormat === 'dev') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan(requestLogFormat, {
      stream: { write: (message) => logger.http(message.trim()) },
    })
  );
}


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', globalLimiter);


app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Global Leather Hub API is running',
    timestamp: new Date().toISOString(),
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/shipping', shippingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
