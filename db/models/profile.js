'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasOne(Profile, {
        foreignKey: 'userId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Profile.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  };
  Profile.init({
    userId: {
      type:DataTypes.INTEGER,
      unique: true
    },
    phone: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    cvPath: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'profiles',
    modelName: 'Profile',
  });
  return Profile;
};