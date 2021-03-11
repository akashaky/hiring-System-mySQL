const applicationModel = require('../../models/apply');
const userModel = require('../../models/user')
const newJobModel = require('../../models/job');
const taskModel = require('../../models/task');
const transactionModel = require('../../models/transaction');

async function allApplications (req, res) {    
    let allApps = await applicationModel.findAll({
        'where': {'appStatus': 2},
        attributes:['appStatus','id','taskGiven', 'taskSubmitted', 'candidate', 'appliedJob'],
        'include':[{'model': userModel, attributes:['id','name','email']},{'model': newJobModel, attributes:['id','jobDomain', 'jobPosition','reqExperience']}]
          
    });
    return allApps;
}

async function giveTask(req, res) {
    let editTask = await applicationModel.update(
        {taskGiven:req.body.task},
        {where: {id: req.params.id}}
    )    
    return editTask;
}

async function taskCompleted(req, res){
    let apps = await applicationModel.findAll({
        where : {appStatus: 3},
        attributes:['id','resume','appliedJob', 'candidate'],
        'include':[{'model':newJobModel, attributes:['jobDomain','jobPosition', 'reqExperience']},{'model':taskModel, attributes:['taskDescription']}]
    })   
    return apps; 
}

async function skillRejected(req, res){
    let transaction = await transactionModel.update(
        {skillAcceptedBy:null, skillRejectedBy: req.user.id},
        {where: {id: req.params.id}}
    )
    return transaction;
}

async function skillAccepted(req, res){
    let transaction = await transactionModel.update(
        {skillAcceptedBy:req.user.id, skillRejectedBy: null},
        {where: {id: req.params.id}}
    )   
    return transaction; 
}

module.exports.skillAccepted =skillAccepted;
module.exports.skillRejected =skillRejected;
module.exports.giveTask = giveTask;
module.exports.allApplications = allApplications;
module.exports.taskCompleted = taskCompleted;
