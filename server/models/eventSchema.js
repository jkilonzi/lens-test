const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { User } = require('./userSchema');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ticketPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  requiresApproval: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  timezone: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'UTC',
  },
  poapName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'poap_name',
  },
  poapDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'poap_description',
  },
  poapImage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'poap_image',
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'published',
    allowNull: false,
  },
  qrCode: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'qr_code',
  },
  eventUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'event_url',
  },
  suiEventId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'sui_event_id',
  },
  creatorWalletAddress: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'creator_wallet_address',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
    field: 'updated_at',
  },
}, {
  tableName: 'events',
  underscored: false,
  timestamps: true,
});

// Define associations
Event.belongsTo(User, { foreignKey: 'userId', as: 'creator' });
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });

module.exports = { Event };