'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('jobs', 'showOnMainPage', {type: Sequelize.BOOLEAN, defaultValue: false});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('jobs', 'showOnMainPage');
  }
};
