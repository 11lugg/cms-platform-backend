// seeders/[timestamp]-demo-template.js

'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'templates',
      [
        {
          id: uuidv4(),
          name: 'Blog Post 2',
          description: 'Template for blog posts',
          components: JSON.stringify({
            header: true,
            footer: true,
            sidebar: false,
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more templates if needed
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('templates', null, {});
  },
};
