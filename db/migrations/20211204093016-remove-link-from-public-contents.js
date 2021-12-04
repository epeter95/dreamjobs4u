'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('public_contents', 'link');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('public_contents', 'link', {
      type: Sequelize.DataTypes.STRING,
    });
  }
};
