// models/template.js

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    static associate(models) {
      // Define associations here
      Template.hasMany(models.Content, { foreignKey: 'templateId' });
    }
  }
  Template.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'Name is required' },
          notEmpty: { msg: 'Name cannot be empty' },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      components: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        validate: {
          notNull: { msg: 'Components are required' },
        },
      },
    },
    {
      sequelize,
      modelName: 'Template',
      tableName: 'templates',
      timestamps: true,
      paranoid: true,
    },
  );
  return Template;
};
