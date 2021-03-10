const responses = require('../components/responses');
const applicationModel = require('../models/apply');
const transactionModel = require('../models/transaction');
const candidateQueries = require('../components/dbQueries/candidate');
const multer = require('multer');
const _ = require('lodash');
const { response } = require('express');

module.exports.allLiveJobs = async function(req, res){
    if(req.user.userRole != 4) responses.forbidden(req,res);
    try{
        let allJobs = await candidateQueries.allOpenings(req, res);
        return res.status(200).json({
            "status":{
                "code": 200,
                "message": "success"
            },
            data: allJobs
        });    
    }catch(error){responses.internalError(req,res)}
}


module.exports.apply = async function(req, res){
    try{
        let jobs = await candidateQueries.isValidJob(req, res);
        if(jobs == null){
            return res.status(400).json({status:{
                "code":404,
                "message": "Job not found"
            }})
        }
        if(req.user.userRole != 4) forbidden(res);
        let registered = await candidateQueries.isAlreadyApplied(req, res);
        if(registered != null){
            return res.status(400).json({
                "status":{
                    "code": 400,
                    "message": "You have already applied for this job"
                }
            }); 
        }   
        applicationModel.uploadedResume(req, res, async function(err){
            if(err){responses.internalError(req,res);}   
            if(req.file == undefined){
                return res.status(400).json({
                    "status":{
                        "code":400,
                        "message": "Resume is required"
                    }
                })
            }                
            if(req.file.mimetype != "application/pdf")  return res.status(400).json({
                "status":{
                    "code":400,
                    "message": "Only pdf files are allowed"
                }
            })
            var userResume = applicationModel.resumePath + '/' +  req.file.filename    
             let newApp = await candidateQueries.createApplication(req, res,userResume);
            let transactionDetails = candidateQueries.createTransaction(req, res)
            return res.status(200).json({"status":{
                "code": "200",
                "message": 'Success'
            }, data: _.pick(newApp, ['id', 'appliedJob','appStatus', 'resume']) })                         
        })

    }catch(error) {responses.internalError(req,res);}          
}