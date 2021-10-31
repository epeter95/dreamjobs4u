'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.belongsToMany(models.Category, { through: UserCategory, foreignKey: "userId"});
      models.Category.belongsToMany(models.User, { through: UserCategory, foreignKey: "categoryId"});
    }
  };
  UserCategory.init({
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'user_categories',
    modelName: 'UserCategory',
  });
  return UserCategory;
};