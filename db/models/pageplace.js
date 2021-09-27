'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PagePlace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PagePlace.init({
    key: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PagePlace',
  });
  return PagePlace;
};