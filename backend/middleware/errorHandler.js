export function notFound(_req, res) {
  res.status(404).json({ error: { message: 'Not Found' } });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || err.status || 500;
  const message =
    status === 500 ? 'Internal Server Error' : err.message || 'Request failed';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    },
  });
}

