'use strict';
const {
  v4: uuidv4
} = require('uuid');
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class union extends Model {
    static associate(models) {
      union.hasMany(models.chat, {
        foreignKey: 'unionId'
      });
      union.belongsToMany(models.user, {
        through: 'user_unions',
        foreignKey: 'unionId',
        otherKey: 'userId',
      });
      union.hasMany(models.workplace, {
        foreignKey: 'unionId',
        as: 'associatedWorkplaces',
      });
      union.hasMany(models.formQuestion, {
        foreignKey: 'unionId',
        as: 'formQuestions',
      });
      union.hasMany(models.Poll, {
        foreignKey: 'unionId',
        as: 'Poll',
      });
    }
  }

  union.init({
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
  }, {
    hooks: {
      afterCreate: async (union, options) => {
        try {
          const { Chat, UserUnion, Poll, Pubkey } = sequelize.models;
    
          if (!Chat || !UserUnion || !Poll || !Pubkey) {
            throw new Error("Required models (Chat, UserUnion, Poll, Pubkey) are not loaded correctly.");
          }
    
          const transaction = options.transaction || (await sequelize.transaction());
          const userId = options.userId;
    
          if (!userId) {
            throw new Error("User ID not provided in afterCreate hook options");
          }
    
          // Fetch admin pubkey
          const adminPubkey = await Pubkey.findOne({ where: { userId }, transaction });
          if (!adminPubkey) {
            throw new Error("Admin public key not found");
          }
    
          const pubkeyValue = adminPubkey.value;
    
          // Create chats
          await Chat.create(
            {
              id: uuidv4(),
              name: `${union.name} general chat`,
              unionId: union.id,
              isDefault: true,
              isPublic: true,
            },
            { transaction }
          );
    
          await Chat.create(
            {
              id: uuidv4(),
              name: `${union.name} workplace 1 chat`,
              unionId: union.id,
              isDefault: true,
              isPublic: true,
            },
            { transaction }
          );
    
          // Create poll
          await Poll.create(
            {
              id: uuidv4(),
              name: `Poll for ${union.name}`,
              unionId: union.id,
              description: "Poll to unionize.",
              yesCount: 0,
              noCount: 0,
              totalEmployees: 0,
              isActive: true,
            },
            { transaction }
          );
    
          // Associate user with the union
          await UserUnion.create(
            {
              id: uuidv4(),
              userId,
              role: "admin",
              unionId: union.id,
            },
            { transaction }
          );
    
          // Commit transaction
          if (!options.transaction) {
            await transaction.commit();
          }
        } catch (error) {
          console.error("Error in afterCreate hook:", error);
    
          // Rollback transaction
          if (options.transaction) {
            await options.transaction.rollback();
          }
    
          throw error;
        }
      },
    },    

    sequelize,
    modelName: 'union',
    tableName: 'unions',
  });

  return union;
};