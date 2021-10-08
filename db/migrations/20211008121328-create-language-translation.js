'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('language_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      languageElementId: {
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
    await queryInterface.addConstraint('language_translations', {
      fields: ['languageElementId'],
      type: 'foreign key',
      name: 'language_translations_language_id_fk',
      references: {
        table: 'languages',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addIndex('language_translations', ['languageElementId', 'languageId'], {
      name: 'language_translations_language_element_id_language_id_unique',
      unique: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('language_translations', 'language_translations_language_id_fk');
    await queryInterface.dropTable('language_translations');
  }
};