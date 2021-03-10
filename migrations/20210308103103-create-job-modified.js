'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
			queryInterface.addColumn(
				'Jobs','jobID', {
					type : Sequelize.INTEGER, // 1: Sequential, 2: Random
					allowNull : false
				}
      ),
      queryInterface.addColumn(
				 'Jobs','reqExperience', {
					type : Sequelize.STRING, // 1: Sequential, 2: Random
					allowNull : false
				}
      ),      
      queryInterface.addColumn('Jobs', 'createdBy',
      {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'})
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
			queryInterface.removeColumn('Jobs','jobID'),
      queryInterface.removeColumn('Jobs','jobDescription'),
      queryInterface.removeColumn('Jobs','createdBy'),
    
    ])
  }
};

