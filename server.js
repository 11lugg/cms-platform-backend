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
const authRouter = require('./routes/auth');
const auth = require('./middleware/auth');

const db = require('./models');

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

// Use the auth routes
app.use('/auth', authRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the CMS Platform Backend!');
});

// Example route that triggers an error
app.get('/error', (req, res, next) => {
  next(new AppError('This is a custom error message', 400));
});

// Route to test database interaction
app.get('/test-db', async (req, res, next) => {
  try {
    const newUser = await db.User.create({
      // Intentionally omit required fields or provide invalid data
      email: 'invalid-email', // Invalid email format
      password: 'short', // Password less than 8 characters
      // Omit 'username' to trigger 'Username is required' validation error
    });
    res.json(newUser);
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
});

// Create a new template
app.post('/templates', async (req, res, next) => {
  try {
    const template = await db.Template.create(req.body);
    res.status(201).json(template);
  } catch (error) {
    next(error);
  }
});

// Create new content
app.post('/contents', auth(), async (req, res, next) => {
  try {
    const content = await db.Content.create({
      ...req.body,
      authorId: req.user.id,
    });
    res.status(201).json(content);
  } catch (error) {
    next(error);
  }
});

// Get all contents with associated author and template
app.get('/contents', async (req, res, next) => {
  try {
    const contents = await db.Content.findAll({
      include: [
        {
          model: db.User,
          as: 'author',
          attributes: ['id', 'username', 'email'],
        },
        { model: db.Template },
      ],
    });
    res.json(contents);
  } catch (error) {
    next(error);
  }
});

// Global Error Handler

// Disable the no-unused-vars rule for the next line
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      status: 'fail',
      errors: messages,
    });
  }

  // Handle JWT errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ msg: 'Invalid token' });
  }

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

// Start the server after the database connection is established
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');

    // Start the server after the DB connection is successful
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
