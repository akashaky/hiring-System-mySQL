const Sequelize = require('sequelize');
const dbConn = require('../connection/sequelizeConnection');

const otpModel= dbConn.db.define('otps', {
	id : {
		type : Sequelize.INTEGER(11),
		allowNull : false,
		autoIncrement : true,
		primaryKey : true
	},
	email: {
		type : Sequelize.STRING,
		allowNull : false,
	},
  otp:{
    type : Sequelize.INTEGER(11),
		allowNull : false,
  }	
}, {
	tableName: 'otps'
});
module.exports = otpModel;