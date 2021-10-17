'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GeneralMessageTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.GeneralMessage.hasMany(GeneralMessageTranslation, {
        foreignKey: 'generalMessageId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      GeneralMessageTranslation.belongsTo(models.GeneralMessage, {
        foreignKey: 'generalMessageId',
      });

      models.Language.hasMany(GeneralMessageTranslation, {
        foreignKey: 'languageId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      GeneralMessageTranslation.belongsTo(models.Language, {
        foreignKey: 'languageId',
      });
    }
  };
  GeneralMessageTranslation.init({
    generalMessageId: DataTypes.INTEGER,
    languageId: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'general_message_translations',
    modelName: 'GeneralMessageTranslation',
  });
  return GeneralMessageTranslation;
};