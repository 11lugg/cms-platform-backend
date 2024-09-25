// models/content.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    static associate(models) {
      // Define associations here
      Content.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
      Content.belongsTo(models.Template, { foreignKey: 'templateId' });
    }
  }
  Content.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Title is required' },
          notEmpty: { msg: 'Title cannot be empty' },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'Slug is required' },
          notEmpty: { msg: 'Slug cannot be empty' },
        },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: 'Body is required' },
          notEmpty: { msg: 'Body cannot be empty' },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'draft',
        validate: {
          isIn: {
            args: [['draft', 'published']],
            msg: 'Status must be either draft or published',
          },
        },
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        validate: {
          notNull: { msg: 'Author ID is required' },
          notEmpty: { msg: 'Author ID cannot be empty' },
        },
      },
      templateId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'templates',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Content',
      tableName: 'contents',
      timestamps: true,
      paranoid: true,
    },
  );
  return Content;
};
