const _ = require('lodash');
const Joi = require('@hapi/joi');
const hrQueries = require('../components/dbQueries/hr')
const {checkCreateJob, checkVerdict} = require('./inputValidations/hrs');
const hrResponses = require('../components/response/hrResponse');
const commonResponses = require('../components/response/commonResponses');



//creating new Job
module.exports.createJob = async function(req, res){
    if(req.user.userRole!=3) {return commonResponses.forbidden(res)}  
    try{
        const { error } = await checkCreateJob.validateAsync(req.body); 
        let uniqueJob = req.body.jobId;
        let job = await hrQueries.isJob(uniqueJob)  
        if(job !=null) {return hrResponses.isAlredayExists(res) }          
        let newJob = await hrQueries.createJob(req, res);        
        return hrResponses.createdJob(newJob, res); 

    }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
    }
}

module.exports.getAppDetails = async function (req, res){
    if(req.user.userRole != 3) {return commonResponses.forbidden(res)}     
    try{
        let allAppDetails = await hrQueries.allApplications();
        return commonResponses.successWithData(res, allAppDetails)
    }catch(error){return commonResponses.internalError(res) }
}

module.exports.updateJobAppStatus = async function(req, res){
    if(req.user.userRole != 3){return commonResponses.forbidden(res)}  
    try{
        const { error } = await checkVerdict.validateAsync(req.body);
        let appId = req.params.id
        const isValidApp = await hrQueries.isApplication(appId); //Common queries b/w hm and hr
        if(isValidApp ==null){return hrResponses.invalidApp(res)}  
        if((req.body.appStatus!= 2 && req.body.appStatus != 0)||  isValidApp.appStatus != 1){   
            return commonResponses.unauthorized(res);
        }
        if(isValidApp.appStatus !=1 && isValidApp.appStatus !=0){
            return commonResponses.unauthorized(res);
        }
        if(isValidApp.appStatus == req.body.appStatus){
          return hrResponses.alreadySet(res);
        }  
        let newStatus= {appId: req.params.id, updatedStatus: req.body.appStatus}       
        let editedJobStatus = await hrQueries.updateApplication(newStatus); 
        let appDecision = {userId: req.user.id, appId: req.params.id}
        if(req.body.appStatus == 0){
            let result = await hrQueries.rejectApp(appDecision);
        }
        if(req.body.appStatus == 2){
            let result = await hrQueries.acceptApp(appDecision);
        }      
        const res1 = await hrQueries.isApplication(appId); 
        return hrResponses.isupdated(res1, res)
    }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
    }          
}

module.exports.skillApprovedApp = async function(req, res){
    if(req.user.userRole != 3) {return commonResponses.forbidden(res)}  
    try{      
        let skillApproved = await hrQueries.allSkilledApplications();
        return commonResponses.successWithData(res, skillApproved);
    }catch(error){return commonResponses.internalError(res)}
}

module.exports.finalVerdict = async function(req, res){
    if(req.user.userRole != 3) {return commonResponses.forbidden(res)}  
    try{
        const { error } = await checkVerdict.validateAsync(req.body);
        let appId = req.params.id
        let editedJobStatus = await hrQueries.isApplication(appId);
        if(editedJobStatus == null){
            return hrResponses.appNotFound(res);        
        }

        if(req.body.appStatus != 5 && req.body.appStatus !=0){
            return commonResponses.unauthorized(res);
        }

        if(editedJobStatus.appStatus == req.body.appStatus){
           return commonResponses.formAlreadyAssigned(res);
        }  

        let finalDecision = {userId: req.user.id, appId: req.params.id}
        if(req.body.appStatus == 0){
            let result = await hrQueries.finalReject(finalDecision);
        }
        if(req.body.appStatus == 5){
            let result = await hrQueries.finalAccept(finalDecision);
        }   
        let newStatus= {appId: req.params.id, updatedStatus: req.body.appStatus} 
        let res1 = await hrQueries.updateApplication(newStatus);
        return hrResponses.updated(res);

    }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
        }
}
