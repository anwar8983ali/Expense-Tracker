// Custom error class so we can throw errors with a specific status code
// and have them caught by the central error-handling middleware in App.js
class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
