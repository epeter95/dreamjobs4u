'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('applied_user_status_translations', ['languageId', 'appliedUserStatusId'], {
      name: 'applied_user_status_translations_languageId_appliedUserStatusId_unique',
      unique: true
    });
    await queryInterface.addIndex('category_translations', ['languageId', 'categoryId'], {
      name: 'category_translations_languageId_categoryId_unique',
      unique: true
    });
    await queryInterface.addIndex('error_message_translations', ['languageId', 'errorMessageId'], {
      name: 'error_message_translations_languageId_errorMessageId_unique',
      unique: true
    });
    await queryInterface.addIndex('general_message_translations', ['languageId', 'generalMessageId'], {
      name: 'general_message_translations_languageId_generalMessageId_unique',
      unique: true
    });
    await queryInterface.addIndex('job_translations', ['languageId', 'jobId'], {
      name: 'job_translations_languageId_jobId_unique',
      unique: true
    });
    await queryInterface.addIndex('language_translations', ['languageId', 'languageElementId'], {
      name: 'job_translations_languageId_languageElementId_unique',
      unique: true
    });
    await queryInterface.addIndex('public_content_translations', ['languageId', 'publicContentId'], {
      name: 'public_content_translations_languageId_publicContentId_unique',
      unique: true
    });
    await queryInterface.addIndex('role_translations', ['languageId', 'roleId'], {
      name: 'role_translations_languageId_roleId_unique',
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('applied_user_status_translations', 'applied_user_status_translations_languageId_appliedUserStatusId_unique');
    await queryInterface.removeIndex('category_translations', 'category_translations_languageId_categoryId_unique');
    await queryInterface.removeIndex('error_message_translations', 'error_message_translations_languageId_errorMessageId_unique');
    await queryInterface.removeIndex('general_message_translations', 'general_message_translations_languageId_generalMessageId_unique');
    await queryInterface.removeIndex('job_translations', 'job_translations_languageId_jobId_unique');
    await queryInterface.removeIndex('language_translations', 'job_translations_languageId_languageElementId_unique');
    await queryInterface.removeIndex('public_content_translations', 'public_content_translations_languageId_publicContentId_unique');
    await queryInterface.removeIndex('role_translations', 'role_translations_languageId_roleId_unique');
  }
};
