'use strict';
const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class union extends Model {
    static associate(models) {
      union.hasMany(models.chat, {
        foreignKey: 'unionId',
        as: 'chats',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      union.belongsToMany(models.user, {
        through: 'user_unions',
        foreignKey: 'unionId',
        otherKey: 'userId',
        as: 'members',
      });

      union.hasMany(models.workplace, {
        foreignKey: 'unionId',
        as: 'associatedWorkplaces',
        onUpdate: 'CASCADE',
      });
    }
  }

  union.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      visibility: {
        type: DataTypes.ENUM('public', 'private'),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        afterCreate: async (union, options) => {
          const { userId } = options;
          const Chat = sequelize.models.chat;
          const UserUnion = sequelize.models.user_union;

          if (!userId) {
            console.warn('Warning: User ID not provided in afterCreate hook options.');
            return;
          }

          try {
            const transaction = options.transaction || (await sequelize.transaction());

            // Create a general chat for the union
            await Chat.create(
              {
                id: uuidv4(),
                name: `${union.name} General Chat`,
                unionId: union.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              { transaction }
            );
            console.log(`General chat created for union: ${union.name}`);

            // Add user to union with admin role
            await UserUnion.create(
              {
                id: uuidv4(),
                userId,
                role: 'admin',
                unionId: union.id,
              },
              { transaction }
            );
            console.log(`User ${userId} added to union ${union.id} as admin.`);

            if (!options.transaction) {
              await transaction.commit();
            }
          } catch (error) {
            console.error('Error in afterCreate hook:', error);
            if (!options.transaction) {
              await transaction.rollback();
            }
          }
        },
      },
      sequelize,
      modelName: 'union',
      tableName: 'unions',
    }
  );

  return union;
};
