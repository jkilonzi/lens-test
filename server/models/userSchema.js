const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  walletAddress: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  avatarUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'user',
    allowNull: false,
  },
  google_oauth_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
}, {
  tableName: 'User',
  underscored: false,
  timestamps: true,
});

// Create OTP model
const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'otps',
  underscored: false,
  timestamps: false,
});

// Define associations
User.hasMany(OTP, { foreignKey: 'userId', onDelete: 'CASCADE' });
OTP.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, OTP };