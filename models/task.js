const Sequelize = require('sequelize');
const dbConn = require('../connection/sequelizeConnection');
const userModel = require('./user');
const applicationModel = require('./apply');

const taskModel= dbConn.db.define('tasks', {
	id : {
		type : Sequelize.INTEGER(11),
		allowNull : false,
		autoIncrement : true,
		primaryKey : true
	},
	taskDescription: {
		type : Sequelize.STRING,
		allowNull : false,
	},
   createdBy:{
    type : Sequelize.INTEGER(11),
    allowNull : false,
    references: {
        model: 'users',
        key: 'id'
    }
  }	
}, {
	tableName: 'tasks'
});
module.exports = taskModel;
taskModel.belongsTo(userModel, {foreignKey: 'createdBy'});