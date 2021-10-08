'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LanguageTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Language.hasMany(LanguageTranslation, {
        foreignKey: 'languageElementId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      LanguageTranslation.belongsTo(models.Language, {
        foreignKey: 'languageElementId',
      });
    }
  };
  LanguageTranslation.init({
    languageElementId: DataTypes.INTEGER,
    languageId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'language_translations',
    modelName: 'LanguageTranslation'
  });
  return LanguageTranslation;
};