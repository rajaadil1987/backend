function handleMissingRoute(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

function handleServerError(error, req, res) {
  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV !== 'test') {
    process.stderr.write(`${error.stack || error.message}\n`);
  }

  res.status(statusCode).json({
    message: error.message || 'Something went wrong'
  });
}

module.exports = {
  notFound: handleMissingRoute,
  errorHandler: handleServerError
};
