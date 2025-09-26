/**
 * Simple logger utility
 * Replace with more sophisticated logging library like Winston if needed
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_COLORS = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[35m', // Magenta
  RESET: '\x1b[0m'   // Reset color
};

class Logger {
  constructor() {
    this.level = this.getLogLevel();
    this.enableColors = process.env.NODE_ENV !== 'production';
  }

  /**
   * Get current log level from environment
   * @returns {number} Log level
   */
  getLogLevel() {
    const envLevel = process.env.LOG_LEVEL || 'INFO';
    return LOG_LEVELS[envLevel.toUpperCase()] || LOG_LEVELS.INFO;
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   * @returns {string} Formatted log message
   */
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const color = this.enableColors ? LOG_COLORS[level] : '';
    const resetColor = this.enableColors ? LOG_COLORS.RESET : '';
    
    let formattedMessage = `${color}[${timestamp}] ${level}: ${message}${resetColor}`;
    
    if (Object.keys(meta).length > 0) {
      formattedMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return formattedMessage;
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {Object} meta - Additional metadata
   */
  error(message, meta = {}) {
    if (this.level >= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', message, meta));
    }
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {Object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    if (this.level >= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message, meta));
    }
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {Object} meta - Additional metadata
   */
  info(message, meta = {}) {
    if (this.level >= LOG_LEVELS.INFO) {
      console.log(this.formatMessage('INFO', message, meta));
    }
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {Object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    if (this.level >= LOG_LEVELS.DEBUG) {
      console.log(this.formatMessage('DEBUG', message, meta));
    }
  }

  /**
   * Set log level
   * @param {string} level - New log level
   */
  setLevel(level) {
    const upperLevel = level.toUpperCase();
    if (LOG_LEVELS[upperLevel] !== undefined) {
      this.level = LOG_LEVELS[upperLevel];
      this.info(`Log level set to: ${upperLevel}`);
    } else {
      this.warn(`Invalid log level: ${level}. Available levels: ${Object.keys(LOG_LEVELS).join(', ')}`);
    }
  }

  /**
   * Create child logger with context
   * @param {Object} context - Context to include in all log messages
   * @returns {Object} Child logger
   */
  child(context) {
    const parentLogger = this;
    
    return {
      error: (message, meta = {}) => parentLogger.error(message, { ...context, ...meta }),
      warn: (message, meta = {}) => parentLogger.warn(message, { ...context, ...meta }),
      info: (message, meta = {}) => parentLogger.info(message, { ...context, ...meta }),
      debug: (message, meta = {}) => parentLogger.debug(message, { ...context, ...meta })
    };
  }
}

// Create and export singleton logger instance
const logger = new Logger();

module.exports = { logger, Logger };