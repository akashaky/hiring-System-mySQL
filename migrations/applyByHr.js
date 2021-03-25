'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
			queryInterface.addColumn(
				'Applications','candiateEmail', {
					type: Sequelize.STRING,
					allowNull : true
				}
      ),])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
			queryInterface.removeColumn('Applications','candiateEmail'),    
    ])
  }
};

