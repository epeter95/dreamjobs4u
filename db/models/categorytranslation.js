'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Category.hasMany(CategoryTranslation, {
        foreignKey: 'categoryId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      CategoryTranslation.belongsTo(models.Category, {
        foreignKey: 'categoryId',
      });

      models.Language.hasMany(CategoryTranslation, {
        foreignKey: 'languageId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      CategoryTranslation.belongsTo(models.Language, {
        foreignKey: 'languageId',
      });
    }
  };
  CategoryTranslation.init({
    languageId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'category_translations',
    modelName: 'CategoryTranslation'
  });
  return CategoryTranslation;
};