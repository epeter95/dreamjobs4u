'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ErrorMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ErrorMessage.init({
    key: {
      type: DataTypes.STRING,
      unique: true
    },
    adminName: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'error_messages',
    modelName: 'ErrorMessage',
  });
  return ErrorMessage;
};