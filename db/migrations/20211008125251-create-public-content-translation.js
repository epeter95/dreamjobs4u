'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('public_content_translations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      publicContentId: {
        type: Sequelize.INTEGER
      },
      languageId: {
        type: Sequelize.INTEGER
      },
      title: {
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
    await queryInterface.addConstraint('public_content_translations', {
      fields: ['publicContentId'],
      type: 'foreign key',
      name: 'public_contents_translations_public_contents_id_fk',
      references: {
        table: 'public_contents',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addIndex('public_content_translations', ['publicContentId', 'languageId'], {
      name: 'public_content_translations_public_content_id_language_id_unique',
      unique: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('public_content_translations', 'public_contents_translations_public_contents_id_fk');
    await queryInterface.removeIndex('public_content_translations', 'public_content_translations_public_content_id_language_id_unique');
    await queryInterface.dropTable('PublicContentTranslations');
  }
};