const Sequelize = require('sequelize');
const dbConn = require('../connection/sequelizeConnection');
const userModel = require('../models/user')
const newJobModel = require('./job');
const taskModel = require('./task');
const multer = require('multer');
const path = require('path');
const resume_path = path.join('/uploads');

const applicationModel = dbConn.db.define('applications', {
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
	candiateEmail:{
		type: Sequelize.STRING,
		allowNull: true
	},
	appliedJob:{
		type : Sequelize.INTEGER(11),
		allowNull : false,
		references: {
			model: 'jobs',
			key: 'id'
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
		allowNull: true,
    }
}, {
	tableName: 'applications'
});

let storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', resume_path));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()); 
    }
  });

//static method
applicationModel.uploadedResume = multer ( {storage : storage}).single('resume');
applicationModel.resumePath = resume_path;

module.exports = applicationModel;

applicationModel.belongsTo(userModel, {foreignKey: 'candidate'});
applicationModel.belongsTo(newJobModel, {foreignKey: 'appliedJob'});
applicationModel.belongsTo(taskModel,{foreignKey: 'taskGiven'});
