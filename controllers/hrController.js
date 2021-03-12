const _ = require('lodash');
const Joi = require('@hapi/joi');
const jobQueries = require('../components/dbQueries/jobs');
const hrQueries = require('../components/dbQueries/hr')
const {checkCreateJob, checkVerdict} = require('../components/validationSchema');
const responses = require('../components/responses');


//creating new Job
module.exports.createJob = async function(req, res){
    if(req.user.userRole!=3) {responses.forbidden(req, res)}  
    try{
        const { error } = await checkCreateJob.validateAsync(req.body); 
        let job = await jobQueries.isJob(req, res);    
        if(job !=null) {
            return res.status(400).json({status:{
                "code":400,
                "message":"This entity has already created"
            }});    
        }          
        let newJob = await jobQueries.createJob(req, res);        
        return res.status(200).json({
            "status":{
                "code": 200,
                "message": "Job Created"
            },
            "data": _.pick(newJob, ['id', 'jobDomain', 'jobPosition', 'reqExperience', 'jobD', 'jobId'])
        })           

    }catch(error){
        if(error.isJoi == true){responses.joiError(error, res)} 
        responses.internalError(req,res);
    }
}

module.exports.getAppDetails = async function (req, res){
    if(req.user.userRole != 3) responses.forbidden(req,res)   
    try{
        let allAppDetails = await hrQueries.allApplications(req, res);
        return res.status(200).json({"status":{
            "code": "200",
            "message": "success"
        }, data: allAppDetails}) 
    }catch(error){ responses.internalError(res) }
}

module.exports.updateJobAppStatus = async function(req, res){
    if(req.user.userRole != 3)responses.forbidden(req,res)
    try{
        const { error } = await checkVerdict.validateAsync(req.body);
        const isValidApp = await hrQueries.isApplication(req,res);
        if(isValidApp ==null){
            return res.status(400).json({
                "status":{
                    "code":400,
                    "message": "Application with this id not found"
                }
             })
        }  
        if((req.body.appStatus!= 2 && req.body.appStatus != 0)||  isValidApp.appStatus != 1){
            return res.status(401).json({"status":{
                "code":401,
                "message": "Unauthorized"
            }})        
        }
        if(isValidApp.appStatus !=1 && isValidApp.appStatus !=0){
            return res.status(401).json({"status":{
                "code":401,
                "message": "Unauthorized"
            }})        
        }
        if(isValidApp.appStatus == req.body.appStatus){
            return res.status(400).json({
                "status":{
                    "code":400,
                    "message": "The appStatus is already set as per your request"
                }
            })
        }        
        let editedJobStatus = await hrQueries.updateApplication(req, res);  
        if(req.body.appStatus == 0){
            let result = await hrQueries.rejectApp(req,res);
        }
        if(req.body.appStatus == 2){
            let result = await hrQueries.acceptApp(req, res);
        }      
        const res1 = await hrQueries.isApplication(req, res);
        return res.status(200).json({
            "status":{
                "code": 200,
                "message": "This job application is updated"
            },
            "data": _.pick(res1, ['id', 'appStatus', 'appliedJob'])
        })
    }catch(error){
        if(error.isJoi == true){{responses.joiError(error, res)}}
        responses.internalError(req,res);
    }          
}

module.exports.skillApprovedApp = async function(req, res){
    if(req.user.userRole != 3) responses.forbidden(req,res)
    try{      
        let skillApproved = await hrQueries.allSkilledApplications(req, res);
        return res.status(200).json({"status":{
            "code": "200",
            "message": "Success"
        }, data:skillApproved})  
    }catch(error){responses.internalError(req,res)}
}

module.exports.finalVerdict = async function(req, res){
    if(req.user.userRole != 3)forbidden(res)
    try{
        const { error } = await checkVerdict.validateAsync(req.body);
        let editedJobStatus = await hrQueries.isApplication(req, res);
        if(req.body.appStatus != 5 && req.body.appStatus !=0){
            return res.status(401).json({
                "status":{
                    "code":401,
                    "message": "Unauthorized"
                }
            })
        }
        if(editedJobStatus.appStatus == req.body.appStatus){
            return res.status(400).json({"status":{
                "code": "400",
                "message": "Form is already assigned as per your request"
            }})
        }   
    
        if(req.body.appStatus == 0){
            let result = await hrQueries.finalReject(req,res);
        }
        if(req.body.appStatus == 5){
            let result = await hrQueries.finalAccept(req, res);
        }   
        let res1 = await hrQueries.updateApplication(req,res);
        return res.status(200).json({"status":{
            "code":200,
            "message": "Application Updated"
        }})

    }catch(error){
        if(error.isJoi == true){responses.joiError(error, res)}
        responses.internalError(res)
        }
}


