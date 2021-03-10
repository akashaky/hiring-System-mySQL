const Sequelize = require('sequelize');
const dbConn = require('../connection/sequelizeConnection');
const newJobModel = require('./job');
const userModel = require('./user')

const transactionModel = dbConn.db.define('transactions', {
	id : {
		type : Sequelize.INTEGER(11),
		allowNull : false,
		autoIncrement : true,
		primaryKey : true
	},
	candidate: {
        type : Sequelize.INTEGER(11),
		allowNull : false,
		references: {
			model: 'users',
			key: 'id'
		}
	},
	appliedJob:{
		type : Sequelize.INTEGER(11),
		allowNull : false,
		references: {
			model: 'jobs',
			key: 'id'
		}
	},
    applicationAcceptedBy:{
        type : Sequelize.INTEGER(11),
		allowNull: true,
		references: {
			model: 'users',
			key: 'id'
		}
    },
    applicationRejectedBy:{
        type : Sequelize.INTEGER(11),
		allowNull: true,
		references: {
			model: 'users',
			key: 'id'
		}
    },
    skillAcceptedBy:{
        type : Sequelize.INTEGER(11),
		allowNull: true,
		references: {
			model: 'users',
			key: 'id'
		}
    },
    skillRejectedBy:{
        type : Sequelize.INTEGER(11),
		allowNull: true,
		references: {
			model: 'users',
			key: 'id'
		}
    },
    hiredBy:{
        type : Sequelize.INTEGER(11),
		allowNull: true,
		references: {
			model: 'users',
			key: 'id'
		}
    },
    rejectedBy:{
        type : Sequelize.INTEGER(11),
		allowNull: true,
		references: {
			model: 'users',
			key: 'id'
		}
    },
}, {
	tableName: 'transactions'
});
module.exports = transactionModel;

transactionModel.belongsTo(userModel, {foreignKey: 'candidate'});
transactionModel.belongsTo(userModel, {foreignKey: 'applicationAcceptedBy'})
transactionModel.belongsTo(userModel, {foreignKey: 'applicationRejectedBy'})
transactionModel.belongsTo(userModel, {foreignKey: 'skillAcceptedBy'})
transactionModel.belongsTo(userModel, {foreignKey: 'skillRejectedBy'})
transactionModel.belongsTo(userModel, {foreignKey: ' hiredBy'})
transactionModel.belongsTo(userModel, {foreignKey: ' rejectedBy'})
transactionModel.belongsTo(newJobModel, {foreignKey: 'appliedJob'});

