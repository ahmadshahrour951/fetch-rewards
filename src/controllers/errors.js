const generalError = (error, req, res, next) =>
/**
 * This catches ALL errors and handles them for the user to understand.
 */
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal Server Error',
    data: error.data || null,
  });

const notFoundError = (req, res) =>
/**
 * This handles ALL 404 errors that don't exist in this server
 */
  res.status(404).json({ message: 'API endpoint not found.' });

module.exports = {
  generalError,
  notFoundError,
};
