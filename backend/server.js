require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');
const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  try {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to create logs directory:', err.message);
  }
}
console.log(process.env.PORT)
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();

    const currencyScheduler = require('./src/services/currencyScheduler');
    currencyScheduler.start();

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`API URL: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      currencyScheduler.stop();
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Only start the HTTP server when run directly (local dev).
// Vercel imports this file as a module and uses the exported app.
if (require.main === module) {
  startServer();
}

module.exports = app;
