'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('general_message_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      generalMessageId: {
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
    await queryInterface.addConstraint('general_message_translations', {
      fields: ['generalMessageId'],
      type: 'foreign key',
      name: 'general_message_translations_general_message_id_fk',
      references: {
        table: 'general_messages',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('general_message_translations', {
      fields: ['languageId'],
      type: 'foreign key',
      name: 'general_message_translations_language_id_fk',
      references: {
        table: 'languages',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('general_message_translations','general_message_translations_language_id_fk');
    await queryInterface.removeConstraint('general_message_translations','general_message_translations_general_message_id_fk');
    await queryInterface.dropTable('general_message_translations');
  }
};