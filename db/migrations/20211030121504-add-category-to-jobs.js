'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('jobs', 'categoryId', {type: Sequelize.INTEGER});
    await queryInterface.addConstraint('jobs', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'jobs_category_id_fk',
      references: {
        table: 'categories',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('jobs','jobs_category_id_fk');
    await queryInterface.removeColumn('jobs', 'categoryId');
  }
};
