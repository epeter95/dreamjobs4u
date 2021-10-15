'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.addColumn('users', 'roleId', {
      type: Sequelize.DataTypes.INTEGER,
    });
    await queryInterface.addConstraint('users', {
      fields: ['roleId'],
      type: 'foreign key',
      name: 'users_role_id_fk',
      references: {
        table: 'roles',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('users','users_role_id_fk');
    await queryInterface.removeColumn('users', 'roleId');
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.DataTypes.STRING,
    });
  }
};
