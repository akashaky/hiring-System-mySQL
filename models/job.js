const Sequelize = require('sequelize');
const dbConn = require('../connection/sequelizeConnection');
const userModel = require('../models/user');


const newJobModel= dbConn.db.define('jobs', {
	id : {
		type : Sequelize.INTEGER(11),
		allowNull : false,
		autoIncrement : true,
		primaryKey : true
	},
	jobPosition : {
		type : Sequelize.STRING,
		allowNull : false,
	},
	jobDomain: {
		type : Sequelize.STRING,
		allowNull : false,
	},
  jobDescription : {
		type : Sequelize.STRING(512),
		allowNull : true
	},
  reqExperience : {
		type : Sequelize.STRING(512),
		allowNull : true
	},
  jobId:{
    type : Sequelize.INTEGER(11),
		allowNull : false,
  },
	createdBy : {
		type : Sequelize.INTEGER(11),
		allowNull : false,
		references: {
			model: 'users',
			key: 'id'
		}
	},
}, {
	tableName: 'jobs'
});

module.exports = newJobModel;
newJobModel.belongsTo(userModel, {foreignKey: 'createdBy'});