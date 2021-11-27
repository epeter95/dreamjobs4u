'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('job_translations', 'aboutUs', {
      type: Sequelize.STRING(2048),
    });

    await queryInterface.changeColumn('job_translations', 'jobDescription', {
      type: Sequelize.STRING(4196),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('job_translations', 'aboutUs', {
      type: Sequelize.STRING(1024),
    });

    await queryInterface.changeColumn('job_translations', 'jobDescription', {
      type: Sequelize.STRING(2048),
    });
  }
};
