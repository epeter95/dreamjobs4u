'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('public_content_translations', {
      fields: ['languageId'],
      type: 'foreign key',
      name: 'public_contents_translations_language_id_fk',
      references: {
        table: 'languages',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('public_content_translations', 'public_contents_translations_language_id_fk');
  }
};
