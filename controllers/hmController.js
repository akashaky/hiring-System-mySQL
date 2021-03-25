const _ = require('lodash')
const Joi = require('@hapi/joi');
const hmQueries = require('../components/dbQueries/hm');
const hrQueries = require('../components/dbQueries/hr')
const hmResponses = require('../components/response/hmResponse');
const commonResponses = require('../components/response/commonResponses');
const {checkCreateTask, checkAssignTask, checkVerdict}= require('./inputValidations/hms')

module.exports.createTask = async function(req,res){
    if(req.user.userRole != 2) {return commonResponses.forbidden(res)}
    try{      
        const { error } = await checkCreateTask.validateAsync(req.body);
        let aboutTask = req.body.taskDescription;
        let anyTask = await hmQueries.isTaskExists(aboutTask);
        
        if(anyTask != null){return hmResponses.alreadytask(res)} 
        let taskInfo = {taskDetail :aboutTask, userId: req.user.id}; 
        let newTask = await hmQueries.createTask(taskInfo);     
        return commonResponses.successWithData(res, newTask);
    }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
    }
}

module.exports.allTasks = async function(req, res){
    if(req.user.userRole != 2) {return commonResponses.forbidden(res)}
    try{
        const allTask = await hmQueries.allTasks();            
        return commonResponses.successWithData(res,allTask);
    }catch(error){
       return commonResponses.internalError(res)
    }
}

module.exports.jobApps = async function(req, res){    
    if(req.user.userRole != 2) {return commonResponses.forbidden(res)}
    try{
        let allJobApps = await hmQueries.allApplications();
        return commonResponses.successWithData(res, allJobApps);
    }catch(error){return commonResponses.internalError(res)}
}


module.exports.assignTask = async function (req, res) { 
    if(req.user.userRole != 2) {return commonResponses.forbidden(res)}
    try{
        const { error } = await checkAssignTask.validateAsync(req.body);
        let appId = req.params.id; 
        var editedJobStatus = await hrQueries.isApplication(appId);
        if(editedJobStatus==null){{ return commonResponses.notFound(res)}}
        if(editedJobStatus.taskGiven == req.body.task){return hmResponses.alredayAssigned(res)}
        if(editedJobStatus.appStatus != 2){return commonResponses.unauthorized(res)}
        let taskId = req.body.task;
        let isTaskExist = await hmQueries.isTask(taskId);
        if(isTaskExist == null){return hmResponses.notATask(res)} 
        let toGiveTask = {appId:req.params.id, taskId : req.body.task}
        const jobStatus = await hmQueries.giveTask(toGiveTask);
        return hmResponses.isUpdated(res);
    } catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
       }

}

module.exports.taskCompletedApp = async function (req, res){
    if(req.user.userRole !=2 ) {return commonResponses.forbidden(res)}
    try{
        let allTaskCompleted = await hmQueries.taskCompleted();
        return commonResponses.successWithData(res, allTaskCompleted);
    }catch(error){return commonResponses.internalError(res)}
}

module.exports.skillVerdict  = async function (req, res){
    if(req.user.userRole != 2){return commonResponses.forbidden(res)}
    try{        
        const { error } = await checkVerdict.validateAsync(req.body);
        let appId=  req.params.id;
        let editJobStatus= await hrQueries.isApplication(appId);
        if(editJobStatus == null){ return commonResponses.notFound(res)}
        if((req.body.appStatus != 4 &&  req.body.appStatus !=0) || editJobStatus.appStatus == 5 || editJobStatus.appStatus==0 || editJobStatus.appStatus==4 ||editJobStatus.appStatus != 3) {   
           return commonResponses.unauthorized(res);       
        }
        if(editJobStatus.appStatus == req.body.appStatus){return commonResponses.formAlreadyAssigned(res)}      
        let newStatus= {appId: req.params.id, updatedStatus: req.body.appStatus}  
        let skillResult = await hrQueries.updateApplication(newStatus); 
        
        let skillDecision = {userId: req.user.id, appId: req.params.id}
        if(req.body.appStatus == 0){
            let result = await hmQueries.skillRejected(skillDecision);
        }
        if(req.body.appStatus == 4){
            let result = await hmQueries.skillAccepted(skillDecision);
        }    
        editJobStatus= await hrQueries.isApplication(appId);  
        return hmResponses.edited(editJobStatus, res);
    }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
    }  
}


module.exports.allReferedApplications = async function(req, res){
    try{
        let referredApplications = await hmQueries.referedApps();
        return commonResponses.successWithData(res, referredApplications);
    }catch(error){return commonResponses.internalError(res);}
}