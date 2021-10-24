'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('profiles', 'jobTitle', {type: Sequelize.STRING});
    await queryInterface.addColumn('profiles', 'age', {type: Sequelize.INTEGER});
    await queryInterface.addColumn('profiles', 'currentSalary', {type: Sequelize.STRING});
    await queryInterface.addColumn('profiles', 'expectedSalary', {type: Sequelize.STRING});
    await queryInterface.addColumn('profiles', 'country', {type: Sequelize.STRING});
    await queryInterface.addColumn('profiles', 'zipcode', {type: Sequelize.STRING});
    await queryInterface.addColumn('profiles', 'city', {type: Sequelize.STRING});
    await queryInterface.addColumn('profiles', 'address', {type: Sequelize.STRING});
    await queryInterface.addColumn('profiles', 'description', {type: Sequelize.STRING(1023)});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('profiles','jobTitle');
    await queryInterface.removeColumn('profiles','age');
    await queryInterface.removeColumn('profiles','expectedSalary');
    await queryInterface.removeColumn('profiles','currentSalary');
    await queryInterface.removeColumn('profiles','country');
    await queryInterface.removeColumn('profiles','zipcode');
    await queryInterface.removeColumn('profiles','city');
    await queryInterface.removeColumn('profiles','address');
    await queryInterface.removeColumn('profiles','description');
  }
};
