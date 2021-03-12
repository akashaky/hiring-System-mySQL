const _ = require('lodash')
const responses= require('../components/responses');
const Joi = require('@hapi/joi');
const hmQueries = require('../components/dbQueries/hm');
const hrQueries = require('../components/dbQueries/hr')
const {checkCreateTask, checkAssignTask, checkVerdict}= require('../components/validationSchema')

module.exports.createTask = async function(req,res){
    if(req.user.userRole != 2) responses.forbidden(req, res);
    try{      
        const { error } = await checkCreateTask.validateAsync(req.body);
        let anyTask = await hmQueries.isTaskExists(req, res);
        if(anyTask != null){
            return res.status(400).json({status:{
                "code":400,
                "message":"This entity has already created"
            }}); 
        }      
        let newTask = await hmQueries.createTask(req, res);     
        return res.status(200).json({"status":{
            "code": "200",
            "message": "Task Created"
        },data: newTask}) 
    }catch(error){
        if(error.isJoi == true){responses.joiError(error, res)}
        responses.internalError(req,res)
    }
}

module.exports.allTasks = async function(req, res){
    if(req.user.userRole != 2) responses.forbidden(req,res);
    try{
        const allTask = await hmQueries.allTasks(req, res);            
        return res.status(200).json({"status":{
            "code": "200",
            "message": "success"
        }, data: allTask}) 
    }catch(error){
        responses.internalError(req,res);
    }
}

module.exports.jobApps = async function(req, res){    
    if(req.user.userRole != 2) responses.forbidden(req, res);
    try{
        let allJobApps = await hmQueries.allApplications(req, res);
        return res.status(200).json({"status":{
            "code": "200",
            "message": "success"
        },data: allJobApps}) 
    }catch(error){responses.internalError(req,res)}
}


module.exports.assignTask = async function (req, res) { 
    if(req.user.userRole != 2) responses.forbidden(req,res);  
    try{
        const { error } = await checkAssignTask.validateAsync(req.body);
        var editedJobStatus = await hrQueries.isApplication(req, res);
        if(editedJobStatus.taskGiven == req.body.task){
            return res.status(400).json({"status":{
                "code": "400",
                "message": "Task is already assigned as per your request"
            }}) 
        }
        let isTaskExist = await hmQueries.isTask(req, res);
        if(isTaskExist == null){
            return res.status(400).json({"status":{
                "code":400,
                "message": "Task not found"
            }})
        } 
        const jobStatus = await hmQueries.giveTask(req, res);
        return res.status(200).json({
            "status":{
                "code": 200,
                "message": "This job application is updated"
            }
        }) 
    } catch(error){
        if(error.isJoi == true) {responses.responsesjoiError(error, res)}
        responses.internalError(req,res)
       }

}

module.exports.taskCompletedApp = async function (req, res){
    if(req.user.userRole !=2 ) responses.forbidden(req,res);
    try{
        let allTaskCompleted = await hmQueries.taskCompleted(req, res);
        return res.status(200).json({"status":{
            "code": "200",
            "message": "success"
        },data: allTaskCompleted}) 
    }catch(error){responses.internalError(req,res)}
}

module.exports.skillVerdict  = async function (req, res){
    if(req.user.userRole != 2) responses.forbidden(req,res);
    try{        
        const { error } = await checkVerdict.validateAsync(req.body);
        let editJobStatus= await hrQueries.isApplication(req, res);
        if((req.body.appStatus != 4 &&  req.body.appStatus !=0) || editJobStatus.appStatus == 5) {   
            return res.status(401).json({"status":{
                "code": "401",
                "message": "Unauthorized request"
            }})          
        }
        if(editJobStatus.appStatus == req.body.appStatus){
            return res.status(400).json({"status":{
                "code": "400",
                "message": "Form is already assigned as per your request"
            }}) 
        }

        
        let skillResult = await hrQueries.updateApplication(req, res);    
        if(req.body.appStatus == 0){
            let result = await hmQueries.skillRejected(req,res);
        }
        if(req.body.appStatus == 4){
            let result = await hmQueries.skillAccepted(req, res);
        }    
        editJobStatus= await hrQueries.isApplication(req, res);  
        return res.status(200).json({"status":{
            "code": "200",
            "message": "success"
        }, data: _.pick(editJobStatus, ['id', 'appStatus', 'appliedJob'])})
    }catch(error){
        if(error.isJoi == true) {responses.joiError(error, res)}
        responses.internalError(req, res);
    }  
}