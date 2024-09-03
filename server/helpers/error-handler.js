function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    // JWT authentication error
    return res.status(401).send({ message: 'Unauthorized access.' });
  }

  if (err.name === 'ValidationError') {
    // Mongoose validation error
    return res.status(400).send({ message: err.message });
  }

  // Default to 500 server error
  return res.status(500).send({ message: err.message || 'An unexpected error occurred.' });
}

module.exports = errorHandler;