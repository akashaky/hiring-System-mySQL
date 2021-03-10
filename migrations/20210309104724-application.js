'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      candidate: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'id',
        }
      },
      appliedJob: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
          model: 'jobs',
          key: 'id',
        }
      },
      resume:{
        type : Sequelize.STRING,
        allowNull : false
      },
      appStatus:{
        type : Sequelize.INTEGER(11),
        allowNull : false,
      },     
      taskGiven:{
        type : Sequelize.INTEGER(11),
		    allowNull : true,
        references: {
          model: 'tasks',
          key: 'id'
        }
    },
      taskSubmitted:{
         type : Sequelize.STRING,
         allowNull : true,
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Applications');
  }
};