'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('language_translations', 'job_translations_languageId_languageElementId_unique');
    await queryInterface.removeIndex('public_content_translations', 'public_content_translations_languageId_publicContentId_unique');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('language_translations', ['languageId', 'languageElementId'], {
      name: 'job_translations_languageId_languageElementId_unique',
      unique: true
    });
    await queryInterface.addIndex('public_content_translations', ['languageId', 'publicContentId'], {
      name: 'public_content_translations_languageId_publicContentId_unique',
      unique: true
    });
  }
};
