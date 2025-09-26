const { logger } = require('../utils/logger');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error('Express error handler:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details = {};

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    if (isDevelopment) {
      details.validation = err.errors;
    }
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid request format';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Service unavailable';
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Prepare error response
  const errorResponse = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  };

  // Add additional details in development
  if (isDevelopment) {
    errorResponse.details = {
      ...details,
      stack: err.stack,
      originalMessage: err.message
    };
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * Handle 404 errors for undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundHandler(req, res) {
  const message = `Route ${req.method} ${req.url} not found`;
  
  logger.warn('404 Not Found:', {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    error: 'Not Found',
    message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
}

/**
 * Async error wrapper for route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped route handler
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Validation error handler
 * @param {Object} validationResult - Validation result from express-validator
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function validationErrorHandler(validationResult, req, res, next) {
  if (!validationResult.isEmpty()) {
    const errors = validationResult.array();
    
    logger.warn('Validation errors:', {
      errors,
      url: req.url,
      method: req.method,
      body: req.body
    });

    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method
    });
  }
  
  next();
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  validationErrorHandler
};