'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        type: Sequelize.INTEGER
      },
      languageId: {
        type: Sequelize.INTEGER
      },
      name: {
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
    await queryInterface.addConstraint('role_translations', {
      fields: ['roleId'],
      type: 'foreign key',
      name: 'role_translations_role_id_fk',
      references: {
        table: 'roles',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('role_translations', {
      fields: ['languageId'],
      type: 'foreign key',
      name: 'role_translations_language_id_fk',
      references: {
        table: 'languages',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('role_translations','role_translations_role_id_fk');
    await queryInterface.removeConstraint('role_translations','role_translations_language_id_fk');
    await queryInterface.dropTable('role_translations');
  }
};