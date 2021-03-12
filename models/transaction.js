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
	appliedJob:{
		type : Sequelize.INTEGER(11),
		allowNull : false,
		references: {
			model: 'jobs',
			key: 'id'
		}
	},
	candidate: {
        type : Sequelize.INTEGER(11),
		allowNull : false,
		references: {
			model: 'users',
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
        type : Sequelize.INTEGER,
		allowNull: true,
		references: {
			model: 'users',
			key: 'id'
		}
    },
    skillRejectedBy:{
        type : Sequelize.INTEGER,
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

transactionModel.belongsTo(userModel, {foreignKey: 'candidate', as:'applicant'});
transactionModel.belongsTo(userModel, {foreignKey: 'applicationAcceptedBy', as: 'AppAcceptedBy'})
 transactionModel.belongsTo(userModel, {foreignKey: 'applicationRejectedBy', as: 'AppRejectedBy'})
 transactionModel.belongsTo(userModel, {foreignKey: 'skillAcceptedBy', as: 'SkillAcceptedBy'})
  transactionModel.belongsTo(userModel, {foreignKey: 'skillRejectedBy', as: 'SkillRejectedBy'})
  transactionModel.belongsTo(userModel, {foreignKey: 'hiredBy', as: 'HiredBy'})
  transactionModel.belongsTo(userModel, {foreignKey: 'rejectedBy', as:'RejectedBy'})
transactionModel.belongsTo(newJobModel, {foreignKey: 'appliedJob'});

