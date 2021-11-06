'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAppliedToJob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(UserAppliedToJob, {
        foreignKey: 'userId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      UserAppliedToJob.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      models.Job.hasMany(UserAppliedToJob, {
        foreignKey: 'jobId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      UserAppliedToJob.belongsTo(models.Job, {
        foreignKey: 'jobId',
      });
    }
  };
  UserAppliedToJob.init({
    userId: DataTypes.INTEGER,
    jobId: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'user_applied_to_jobs',
    modelName: 'UserAppliedToJob',
  });
  return UserAppliedToJob;
};