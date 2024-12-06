'use strict';
const { Model, UUIDV4 } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  class Workplace extends Model {
    static associate(models) {
      Workplace.belongsTo(models.union, {
        foreignKey: 'unionId',
        as: 'union',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Workplace.belongsToMany(models.user, {
        through: 'user_workplace',
        foreignKey: 'workplaceId',
        otherKey: 'userId'
      });
    }
  }

  Workplace.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    workplaceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unionId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    hooks: {
      afterCreate: async (Workplace, options) => {
        const { chat, poll } = sequelize.models.chat;
        const newWorkplaceChat = chat.create({
          id: uuidv4(),
          name: Workplace.workplaceName + 'general chat',
          unionId: options.unionId,
          chatKeyVersion: null,
          isDefault: true,
          isPublic: false
        })
        const newAnouncementChat = chat.create({
          id: uuidv4(),
          name: "Anouncements",
          unionId: options.unionId,
          chatKeyVersion: null,
          isDefault: true,
          isPublic: false
        })
        const newWorkplacePoll = await poll.create(
          {
            id: uuidv4(),
            name: `Poll for ${Workplace.workplaceNamename}`,
            unionId: union.id,
            description: "Poll to unionize.",
            options: ["yes", "no"],
            isActive: true,
          },
          {}
        );
      }
    },
    sequelize,
    modelName: 'workplace',
  });

  return Workplace;
};
