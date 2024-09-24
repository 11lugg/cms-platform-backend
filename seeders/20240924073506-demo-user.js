// seeders/[timestamp]-demo-user.js

'use strict';

const { v4: uuidv4 } = require('uuid'); // Import the uuid module

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(), // Generate a UUID
          username: 'admin',
          email: 'admin@example.com',
          password: 'hashed_password', // Replace with an actual hashed password
          role: 'admin',
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more users if needed
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
