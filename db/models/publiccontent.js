'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PublicContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.PagePlace.hasMany(PublicContent, {
        foreignKey: 'pagePlaceId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      PublicContent.belongsTo(models.PagePlace, {
        foreignKey: 'pagePlaceId',
      });
    }
  };
  PublicContent.init({
    key:{ 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    adminName: DataTypes.STRING,
    pagePlaceId: DataTypes.INTEGER,
    link: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'public_contents',
    modelName: 'PublicContent',
  });
  return PublicContent;
};