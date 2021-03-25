const applicationModel = require('../../models/apply');
const userModel = require('../../models/user')
const newJobModel = require('../../models/job');
const taskModel = require('../../models/task');
const transactionModel = require('../../models/transaction');
const commonResponses = require('../response/commonResponses');


async function allApplications () {
    try{
        let allApps = await applicationModel.findAll({
            'where': {'appStatus': 2},
            attributes:['appStatus','id','taskGiven', 'taskSubmitted', 'candidate', 'appliedJob', 'resume'],
            'include':[{'model': userModel, attributes:['id','name','email']},{'model': newJobModel, attributes:['id','jobDomain', 'jobPosition','reqExperience']}]
              
        });
        return allApps;
    }catch(error){return commonResponses.internalError(res)}
}

async function giveTask(toGiveTask) {
    try{
        let editTask = await applicationModel.update(
            {taskGiven:toGiveTask.taskId},
            {where: {id: toGiveTask.appId}}
        )    
        return editTask;
    }catch(error){return commonResponses.internalError(res)}
}

async function taskCompleted(){
    try{
        let apps = await applicationModel.findAll({
            where : {appStatus: 3},
            attributes:['id','resume','appliedJob', 'candidate','taskSubmitted'],
            'include':[{'model':newJobModel, attributes:['jobDomain','jobPosition', 'reqExperience']},{'model':taskModel, attributes:['taskDescription']}]
        })   
        return apps; 
    }catch(error){return commonResponses.internalError(res)}
}

async function skillRejected(skillDecision){
    try{
        let transaction = await transactionModel.update(
            {skillAcceptedBy:null, skillRejectedBy: skillDecision.userId},
            {where: {id: skillDecision.appId}}
        )
        return transaction;
    }catch(error){return commonResponses.internalError(res)}
}

async function skillAccepted(skillDecision){
    try{
        let transaction = await transactionModel.update(
            {skillAcceptedBy:skillDecision.userId, skillRejectedBy: null},
            {where: {id: skillDecision.appId}}
        )   
        return transaction; 
    }catch(error){return commonResponses.internalError(res)}
}

async function isTaskExists (aboutTask) {
    try{
        let isTask = await taskModel.findOne({
            where: {taskDescription: aboutTask}
        });    
        return isTask;   
    }catch(error){return commonResponses.internalError(res)}     
 }
 
 async function createTask (taskInfo){
try{
    let task = await taskModel.create({
        createdBy: taskInfo.userId,
        taskDescription : taskInfo.taskDetail
    })
    return task;   
}catch(error){return commonResponses.internalError(res)}
 }

 async function allTasks () {
     try{
        let allTask =  await taskModel.findAll({
            attributes: [
                'id', 'taskDescription'],
            'include' :[{'model' : userModel, attributes: [
                'id', 'name', 'email']}]
        })
        return allTask;
     }catch(error){return commonResponses.internalError(res)}
  }
 async function isTask(taskId){
     try{
        let task = await taskModel.findByPk(taskId);
        return task; 
     }catch(error){return commonResponses.internalError(res)}
 }

 async function referedApps(){
     try{
        let allApps = await applicationModel.findAll({
            'where': {'appStatus': 2, 'taskGiven': null},
            attributes:['appStatus','id','taskGiven', 'taskSubmitted', 'candiateEmail', 'appliedJob', 'resume'],
            'include':[{'model': userModel, attributes:['id','name','email'], where: {'userRole':3}},{'model': newJobModel, attributes:['id','jobDomain', 'jobPosition','reqExperience']}]
              
        });
        return allApps;
     }catch(error){return res.error}
 }
 
 module.exports.isTask = isTask;
 module.exports.allTasks = allTasks;
 module.exports.createTask = createTask;
 module.exports.isTaskExists = isTaskExists;

module.exports.skillAccepted =skillAccepted;
module.exports.skillRejected =skillRejected;
module.exports.giveTask = giveTask;
module.exports.allApplications = allApplications;
module.exports.taskCompleted = taskCompleted;
module.exports.referedApps = referedApps;
