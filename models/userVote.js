'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserVote extends Model {
    static associate(models) {
      UserVote.belongsTo(models.Poll, { foreignKey: 'pollId', as: 'Poll' });
    }
  }

  UserVote.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pollId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vote: {
      type: DataTypes.ENUM('yes', 'no'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UserVote',
    tableName: 'user_votes',
  });

  return UserVote;
};
