// server.js

// Load environment variables
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError = require('./utils/AppError');
const fs = require('fs');

const app = express();

// Set the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware

// Use Helmet to set secure HTTP headers
app.use(helmet());

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' },
);

// Setup the logger to write to access.log
app.use(morgan('combined', { stream: accessLogStream }));

// Limit repeated requests to public APIs and/or endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

app.use(limiter);

// Parse incoming JSON requests
app.use(express.json());

// Prevent HTTP parameter pollution
app.use(hpp());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the CMS Platform Backend!');
});

// Global Error Handler

// Disable the no-unused-vars rule for the next line
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
});

// Example route that triggers an error
app.get('/error', (req, res, next) => {
  next(new AppError('This is a custom error message', 400));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
