'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicContentTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.PublicContent.hasMany(PublicContentTranslation, {
        foreignKey: 'publicContentId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      PublicContentTranslation.belongsTo(models.PublicContent, {
        foreignKey: 'publicContentId',
      });

      models.Language.hasMany(PublicContentTranslation, {
        foreignKey: 'languageId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      PublicContentTranslation.belongsTo(models.Language, {
        foreignKey: 'languageId',
      });
    }
  };
  PublicContentTranslation.init({
    publicContentId: DataTypes.INTEGER,
    languageId: DataTypes.INTEGER,
    title: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'public_content_translations',
    modelName: 'PublicContentTranslation'
  });
  return PublicContentTranslation;
};