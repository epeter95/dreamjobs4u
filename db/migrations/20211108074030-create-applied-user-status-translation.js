'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('applied_user_status_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appliedUserStatusId: {
        type: Sequelize.INTEGER
      },
      languageId: {
        type: Sequelize.INTEGER
      },
      text: {
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
    await queryInterface.addConstraint('applied_user_status_translations', {
      fields: ['appliedUserStatusId'],
      type: 'foreign key',
      name: 'applied_user_status_translations_applied_user_status_id_fk',
      references: {
        table: 'applied_user_statuses',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('applied_user_status_translations', {
      fields: ['languageId'],
      type: 'foreign key',
      name: 'applied_user_status_translations_language_id_fk',
      references: {
        table: 'languages',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('applied_user_status_translations','applied_user_status_translations_applied_user_status_id_fk');
    await queryInterface.removeConstraint('applied_user_status_translations','applied_user_status_translations_language_id_fk');
    await queryInterface.dropTable('applied_user_status_translations');
  }
};