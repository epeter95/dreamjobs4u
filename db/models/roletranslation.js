'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Role.hasMany(RoleTranslation, {
        foreignKey: 'roleId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      RoleTranslation.belongsTo(models.Role, {
        foreignKey: 'roleId',
      });

      models.Language.hasMany(RoleTranslation, {
        foreignKey: 'languageId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      RoleTranslation.belongsTo(models.Language, {
        foreignKey: 'languageId',
      });
    }
  };
  RoleTranslation.init({
    roleId: DataTypes.INTEGER,
    languageId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'role_translations',
    modelName: 'RoleTranslation',
  });
  return RoleTranslation;
};