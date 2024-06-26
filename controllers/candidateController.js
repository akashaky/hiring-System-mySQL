const applicationModel = require('../models/apply');
const candidateQueries = require('../components/dbQueries/candidate');
const multer = require('multer');
const _ = require('lodash');
const Joi = require('@hapi/joi');
const {applyCheck} = require('./inputValidations/candidates');
const {checkSubmitTask}= require('./inputValidations/candidates');
const candidateResponses = require('../components/response/candidateResponse');
const commonResponses = require('../components/response/commonResponses')
const hrQueries = require('../components/dbQueries/hr');


module.exports.allLiveJobs = async function(req, res){ 
    if(req.user.userRole != 4 && req.user.userRole !=3) {return commonResponses.forbidden(res)}
    try{
        let allJobs = await candidateQueries.allOpenings(); // common to home controller
        return commonResponses.successWithData(res, allJobs);
    }catch(error){return commonResponses.internalError(res)}
}


module.exports.apply = async function(req, res){
    try{
        if(req.user.userRole != 4 && req.user.userRole !=3){return commonResponses.forbidden(res)}

        let toJob = req.params.job;
        let jobs = await candidateQueries.isValidJob(toJob);
        if(jobs == null){return candidateResponses.jobNotExists(res)}

        let uniqueJob = {candidateId: req.user.id, appliedJobId: req.params.job}
        let registered = await candidateQueries.isAlreadyApplied(uniqueJob);
        if(registered != null && req.user.userRole !=3){return candidateResponses.alreadyApplied(res)}   
        applicationModel.uploadedResume(req, res, async function(err){
            if(err){commonResponses.internalError(req,res);}   
            if(req.file == undefined){return candidateResponses.resumeReq(res)} 
            if(req.user.userRole == 3){      
                try{
                    const { error} = await applyCheck.validateAsync(req.body);
                }catch(error){return commonResponses.joiError(error, res)}
            }        
            if(req.file.mimetype != "application/pdf"){return candidateResponses.notPdf(res)}
            var userResume = applicationModel.resumePath + '/' +  req.file.filename  
            let newApp = await candidateQueries.createApplication(req, res,userResume);
            let transactionDetails = candidateQueries.createTransaction(req, res)
            return candidateResponses.applied(newApp, res);                        
        })

    }catch(error){
        return commonResponses.internalError(res)
    }          
}

module.exports.myapplications = async function(req, res){
    if(req.user.userRole != 4 && req.user.userRole !=3){return commonResponses.forbidden(res)}
    try{
      let userId = req.user.id
      let myJobs = await candidateQueries.myApplication(userId);
      return commonResponses.successWithData(res, myJobs); 
    }catch(err){return commonResponses.internalError(res)}     
}
  
module.exports.submitTask = async function (req, res){
    if(req.user.userRole != 4 && req.user.userRole !=3) {return commonResponses.forbidden(res)}
    try{
        let appId = req.params.id; 
        var editedJobStatus = await hrQueries.isApplication(appId);
        if(editedJobStatus==null){{ return commonResponses.notFound(res)}}
        const { error } = await checkSubmitTask.validateAsync(req.body); 
        let toJob = req.params.id;
        let toSubmitTask =  await candidateQueries.currentApplication(toJob);
        if(toSubmitTask.taskSubmitted == req.body.myTask){return candidateResponses.alreadySubmitted(res)}
        if((toSubmitTask.appStatus !=2  && toSubmitTask.appStatus !=3 && toSubmitTask.appStatus !=1) || toSubmitTask.taskGiven == null){
            return commonResponses.unauthorized(res);
        }
      let submission = {toSubmit: req.body.myTask, toJob: req.params.id}  
      const submit = await candidateQueries.submitATask(submission);
       return candidateResponses.taskSubmit(res);
    }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
    }
}