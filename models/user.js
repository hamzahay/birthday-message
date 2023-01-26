'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { 
          args: true,
          msg: 'email is required' 
        },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { 
          args: true,
          msg: 'email is required' 
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { 
          args: true,
          msg: 'email is required' 
        },
        isEmail: { 
          args: true,
          msg: 'not a valid email format' 
        },
      }
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { 
          args: true,
          msg: 'email is required' 
        },
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { 
          args: true,
          msg: 'email is required' 
        },
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};