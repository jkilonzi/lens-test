const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as necessary to import your sequelize instance

const Event = sequelize.define('events', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {  
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: '00:00:00',
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'UTC',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'events',
  timestamps: true,
  underscored: true,
});

module.exports = Event;