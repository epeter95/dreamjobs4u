'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(Job, {
        foreignKey: 'userId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Job.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  };
  Job.init({
    userId: DataTypes.INTEGER,
    companyName: DataTypes.STRING,
    logoUrl: DataTypes.STRING,
    jobLocation: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'jobs',
    modelName: 'Job'
  });
  return Job;
};