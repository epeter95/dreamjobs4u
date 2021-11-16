'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.belongsToMany(models.Event, { through: EventUser, foreignKey: "userId"});
      models.Event.belongsToMany(models.User, { through: EventUser, foreignKey: "eventId"});
    }
  };
  EventUser.init({
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'event_users',
    modelName: 'EventUser'
  });
  return EventUser;
};