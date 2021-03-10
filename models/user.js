const Sequelize = require('sequelize');
const dbConn = require('../connection/sequelizeConnection');
const userModel= dbConn.db.define('users', {
	id : {
		type : Sequelize.INTEGER(11),
		allowNull : false,
		autoIncrement : true,
		primaryKey : true
	},
	name: {
		type : Sequelize.STRING,
		allowNull : false,
	},
	email: {
		type : Sequelize.STRING,
		allowNull : false,
	},
  password : {
		type : Sequelize.STRING,
		allowNull : false
	},
	userRole: {
		type : Sequelize.INTEGER(11),
		allowNull : false,
	},
  
	
}, {
	tableName: 'users'
});
module.exports = userModel;
