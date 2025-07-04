// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server Error';
  
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400;
  }
  
  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(', ')}`;
    statusCode = 400;
  }
  
  // Handle Mongoose CastError (invalid ID)
  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }
  
  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File size cannot be larger than 5MB';
    statusCode = 400;
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};