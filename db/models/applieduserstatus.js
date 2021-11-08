'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AppliedUserStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AppliedUserStatus.init({
    key: {
      type: DataTypes.STRING,
      unique: true
    },
    adminName: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'applied_user_statuses',
    modelName: 'AppliedUserStatus',
  });
  return AppliedUserStatus;
};