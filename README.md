CMS Platform Backend

Welcome to the CMS Platform Backend repository! This project is a Content Management System (CMS) backend built with Node.js, Express, and Sequelize ORM, using PostgreSQL as the database. It provides RESTful APIs for user authentication, content management, and template handling.

Table of Contents

    •	Features
    •	Prerequisites
    •	Installation
    •	Environment Variables
    •	Database Setup
    •	Running the Application
    •	Project Structure
    •	API Documentation
    •	Available Scripts
    •	Linting and Formatting
    •	Contributing
    •	License
    •	Contact
    •	Additional Notes
    •	Acknowledgments

Features

    •	User Authentication: Secure user registration and login using JWT.
    •	Role-Based Access Control: Restrict access to certain resources based on user roles.
    •	Content Management: CRUD operations for content with relations to users and templates.
    •	Template Handling: Create and manage templates for content.
    •	Security Enhancements: Implements security best practices with Helmet, rate limiting, input sanitization, and more.
    •	API Documentation: Comprehensive API documentation using Swagger (OpenAPI 3.0).
    •	Error Handling: Centralized error handling with custom error classes.

Prerequisites

    •	Node.js: Version 12.x or higher
    •	npm: Version 6.x or higher
    •	PostgreSQL: Version 10.x or higher
    •	Git: For version control

Installation

    1.	Clone the Repository

git clone https://github.com/your-username/cms-platform-backend.git
cd cms-platform-backend

    2.	Install Dependencies

npm install

Environment Variables

Create a .env file in the root directory of the project and configure the following environment variables:

# Server Configuration

PORT=3000

# Database Configuration

DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# JWT Secret Key

JWT_SECRET=your_jwt_secret_key

# Other Configurations

NODE_ENV=development

Note: Replace placeholders with your actual configuration values.

Database Setup

    1.	Create the Database

Ensure PostgreSQL is running, and create a database:

createdb your_db_name

    2.	Run Migrations

npx sequelize-cli db:migrate

    3.	Seed the Database (Optional)

If you have seeders to populate initial data:

npx sequelize-cli db:seed:all

Running the Application

Development Mode

Start the application in development mode with hot-reloading using nodemon:

npm run dev

Production Mode

Start the application in production mode:

npm start

The server will start on the port specified in your .env file (default is 3000).

Project Structure

cms-platform-backend/
├── config/
│ └── config.js
├── controllers/
│ ├── authController.js
│ ├── contentController.js
│ └── templateController.js
├── logs/
│ └── access.log
├── middleware/
│ └── auth.js
├── migrations/
│ ├── [timestamp]-create-user.js
│ ├── [timestamp]-create-template.js
│ └── [timestamp]-create-content.js
├── models/
│ ├── content.js
│ ├── index.js
│ ├── template.js
│ └── user.js
├── routes/
│ ├── auth.js
│ ├── contents.js
│ └── templates.js
├── seeders/
│ ├── [timestamp]-demo-user.js
│ └── [timestamp]-demo-template.js
├── services/
│ └── emailService.js
├── utils/
│ └── AppError.js
├── tests/
│ └── (test files)
├── .env
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── README.md
├── server.js
└── swagger.js

Key Directories and Files

    •	config/: Contains database configuration files.
    •	controllers/: Holds controller functions for handling requests.
    •	middleware/: Custom middleware functions, including authentication.
    •	models/: Sequelize models representing database tables.
    •	routes/: Defines application routes and associates them with controllers.
    •	services/: Contains reusable business logic and external service integrations.
    •	utils/: Utility classes and functions.
    •	server.js: The main entry point of the application.
    •	swagger.js: Swagger configuration for API documentation.

API Documentation

API documentation is available via Swagger UI.

    •	Access the Documentation: http://localhost:3000/api-docs

Available Endpoints

Authentication

    •	POST /auth/register: Register a new user.
    •	POST /auth/login: Authenticate a user and retrieve a JWT token.

Contents

    •	POST /contents: Create new content (authentication required).
    •	GET /contents: Retrieve all contents.

Templates

    •	POST /templates: Create a new template.

Authentication

    •	JWT Bearer Tokens: Authenticate protected routes by including an Authorization header with the value Bearer your_jwt_token.

Available Scripts

    •	Start Application

npm start

    •	Start in Development Mode

npm run dev

    •	Run Migrations

npx sequelize-cli db:migrate

    •	Run Seeders

npx sequelize-cli db:seed:all

    •	Undo Migrations

npx sequelize-cli db:migrate:undo:all

    •	Run Tests

npm test

    •	Lint Code

npm run lint

    •	Format Code

npm run format

Linting and Formatting

    •	ESLint: Linting is configured using ESLint with the configuration file eslint.config.mjs.
    •	Prettier: Code formatting is managed by Prettier, with configuration in .prettierrc.

Running Linting and Formatting

    •	Lint the Code

npm run lint

    •	Format the Code

npm run format

Contributing

Contributions are welcome! Please follow these steps:

    1.	Fork the Repository
    2.	Create a Feature Branch

git checkout -b feature/your-feature-name

    3.	Commit Your Changes

git commit -m "Add your commit message"

    4.	Push to Your Fork

git push origin feature/your-feature-name

    5.	Open a Pull Request

Additional Notes

    •	Security: Ensure that your .env file and any other sensitive files are included in .gitignore to prevent accidental commits.
    •	Error Handling: The application uses a centralized error handling mechanism to capture and respond to errors consistently.
    •	Logging: Application logs are stored in the logs/ directory. Consider implementing log rotation to manage log file sizes.
    •	Testing: Implement unit and integration tests in the tests/ directory to ensure code reliability.

Acknowledgments

    •	Express.js: Fast, unopinionated, minimalist web framework for Node.js
    •	Sequelize: Promise-based Node.js ORM for various SQL dialects
    •	Swagger: API documentation and design tools
    •	bcrypt: Library to help you hash passwords
    •	jsonwebtoken: For generating and verifying JWT tokens
    •	express-validator: For validating and sanitizing user input
