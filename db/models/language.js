'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Language extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Language.init({
    key: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    adminName: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    flagUrl: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'languages',
    modelName: 'Language',
  });
  return Language;
};