'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ErrorMessageTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ErrorMessage.hasMany(ErrorMessageTranslation, {
        foreignKey: 'errorMessageId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      ErrorMessageTranslation.belongsTo(models.ErrorMessage, {
        foreignKey: 'errorMessageId',
      });

      models.Language.hasMany(ErrorMessageTranslation, {
        foreignKey: 'languageId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      ErrorMessageTranslation.belongsTo(models.Language, {
        foreignKey: 'languageId',
      });
    }
  };
  ErrorMessageTranslation.init({
    errorMessageId: DataTypes.INTEGER,
    languageId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'error_message_translations',
    modelName: 'ErrorMessageTranslation',
  });
  return ErrorMessageTranslation;
};