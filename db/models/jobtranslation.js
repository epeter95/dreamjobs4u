'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Job.hasMany(JobTranslation, {
        foreignKey: 'jobId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      JobTranslation.belongsTo(models.Job, {
        foreignKey: 'jobId',
      });

      models.Language.hasMany(JobTranslation, {
        foreignKey: 'languageId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      JobTranslation.belongsTo(models.Language, {
        foreignKey: 'languageId',
      });
    }
  };
  JobTranslation.init({
    jobId: DataTypes.INTEGER,
    languageId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    taskList: DataTypes.STRING,
    expectationList: DataTypes.STRING,
    offerList: DataTypes.STRING,
    aboutUs: DataTypes.STRING,
    requiredExperience: DataTypes.STRING,
    requiredQualification: DataTypes.STRING,
    requiredLanguage: DataTypes.STRING,
    employmentType: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'job_translations',
    modelName: 'JobTranslation'
  });
  return JobTranslation;
};