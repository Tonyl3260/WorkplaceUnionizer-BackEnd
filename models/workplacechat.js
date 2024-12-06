'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class workplaceChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      workplaceChat.belongsTo(models.union, {
        foreignKey: 'unionId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      workplaceChat.belongsTo(models.chat, {
        foreignKey: 'chatId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      workplaceChat.belongsTo(models.workplace, {
        foreignKey: 'workplaceId',
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      })
    }
  }
  workplaceChat.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    unionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    workplaceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'workplaceChat',
  });
  return workplaceChat;
};