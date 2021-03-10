const taskModel = require('../models/task');
const responses= require('../components/responses');
const Joi = require('@hapi/joi');
const userModel = require('../models/user');
const taskQueries = require('../components/dbQueries/task');
const {checkCreateTask}= require('../components/validationSchema')

module.exports.createTask = async function(req,res){
    if(req.user.userRole != 2) responses.forbidden(req, res);
    try{      
        const { error } = await checkCreateTask.validateAsync(req.body);
        let anyTask = await taskQueries.isTaskExists(req, res);
        if(anyTask != null){
            return res.status(400).json({status:{
                "code":400,
                "message":"This entity has already created"
            }}); 
        }      
        let newTask = await taskQueries.createTask(req, res);     
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
        const allTask = await taskQueries.allTasks(req, res);            
        return res.status(200).json({"status":{
            "code": "200",
            "message": "success"
        }, data: allTask}) 
    }catch(error){
        responses.internalError(req,res);
    }
}