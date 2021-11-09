'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_applied_to_jobs', 'appliedUserStatusId', {
      type: Sequelize.DataTypes.INTEGER
    });
    await queryInterface.addConstraint('user_applied_to_jobs', {
      fields: ['appliedUserStatusId'],
      type: 'foreign key',
      name: 'user_applied_to_jobs_applied_user_status_id_fk',
      references: {
        table: 'applied_user_statuses',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('user_applied_to_jobs','user_applied_to_jobs_applied_user_status_id_fk');
    await queryInterface.removeColumn('user_applied_to_jobs','appliedUserStatusId');
  }
};
