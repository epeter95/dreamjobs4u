'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Job.hasMany(Event, {
        foreignKey: 'jobId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Event.belongsTo(models.Job, {
        foreignKey: 'jobId',
      });
    }
  };
  Event.init({
    ownerId: DataTypes.INTEGER,
    link: DataTypes.STRING,
    jobId: DataTypes.INTEGER,
    startDate: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'events',
    modelName: 'Event'
  });
  return Event;
};