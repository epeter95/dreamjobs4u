'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_applied_to_jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      jobId: {
        type: Sequelize.INTEGER
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
    await queryInterface.addConstraint('user_applied_to_jobs', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'user_applied_to_jobs_user_id_fk',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });

    await queryInterface.addConstraint('user_applied_to_jobs', {
      fields: ['jobId'],
      type: 'foreign key',
      name: 'user_applied_to_jobs_job_id_fk',
      references: {
        table: 'jobs',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('user_applied_to_jobs', 'user_applied_to_jobs_user_id_fk');
    await queryInterface.removeConstraint('user_applied_to_jobs', 'user_applied_to_jobs_job_id_fk');
    await queryInterface.dropTable('user_applied_to_jobs');
  }
};