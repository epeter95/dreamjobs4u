'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('job_translations', 'payment', {type: Sequelize.STRING});
    await queryInterface.addColumn('job_translations', 'jobType', {type: Sequelize.STRING});
    await queryInterface.addColumn('job_translations', 'experience', {type: Sequelize.STRING});
    await queryInterface.addColumn('job_translations', 'qualification', {type: Sequelize.STRING});
    await queryInterface.addColumn('job_translations', 'language', {type: Sequelize.STRING});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('job_translations', 'payment');
    await queryInterface.removeColumn('job_translations', 'jobType');
    await queryInterface.removeColumn('job_translations', 'experience');
    await queryInterface.removeColumn('job_translations', 'qualification');
    await queryInterface.removeColumn('job_translations', 'language');
  }
};
