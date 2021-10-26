'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jobId: {
        type: Sequelize.INTEGER
      },
      languageId: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      taskList: {
        type: Sequelize.STRING(1024)
      },
      aboutUs:{
        type: Sequelize.STRING(1024)
      },
      expectationList: {
        type: Sequelize.STRING(1024)
      },
      offerList: {
        type: Sequelize.STRING(1024)
      },
      requiredExperience: {
        type: Sequelize.STRING
      },
      requiredQualification: {
        type: Sequelize.STRING
      },
      requiredLanguage: {
        type: Sequelize.STRING
      },
      employmentType: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('job_translations', {
      fields: ['jobId'],
      type: 'foreign key',
      name: 'job_translations_category_id_fk',
      references: {
        table: 'jobs',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('job_translations', {
      fields: ['languageId'],
      type: 'foreign key',
      name: 'job_translations_language_id_fk',
      references: {
        table: 'languages',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('job_translations','job_translations_language_id_fk');
    await queryInterface.removeConstraint('job_translations','job_translations_category_id_fk');
    await queryInterface.dropTable('job_translations');
  }
};