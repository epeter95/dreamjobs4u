'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AppliedUserStatusTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.AppliedUserStatus.hasMany(AppliedUserStatusTranslation, {
        foreignKey: 'appliedUserStatusId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      AppliedUserStatusTranslation.belongsTo(models.AppliedUserStatus, {
        foreignKey: 'appliedUserStatusId',
      });

      models.Language.hasMany(AppliedUserStatusTranslation, {
        foreignKey: 'languageId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      AppliedUserStatusTranslation.belongsTo(models.Language, {
        foreignKey: 'languageId',
      });
    }
  };
  AppliedUserStatusTranslation.init({
    appliedUserStatusId: DataTypes.NUMBER,
    languageId: DataTypes.NUMBER,
    text: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'applied_user_status_translations',
    modelName: 'AppliedUserStatusTranslation',
  });
  return AppliedUserStatusTranslation;
};