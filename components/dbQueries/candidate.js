const newJobModel = require('../../models/job');
const applicationModel = require('../../models/apply');
const transactionModel = require('../../models/transaction');
const taskModel = require('../../models/task');
const commonResponses = require('../response/commonResponses');

async function allOpenings(){
    try{
        let allJob = await newJobModel.findAll({
            attributes: [
                'id','jobDomain', 'jobPosition', 'jobDomain', 'jobDescription', 'jobId', 'reqExperience'
             ],
        })
        return allJob;
    }catch(error){return commonResponses.internalError(res)}
}

async function createApplication (req, res,userResume) {
    try{
        let currentAppStaus = 1;
        let userEmail = null;
        if(req.user.userRole == 3){currentAppStaus = 2, userEmail= req.body.email}
        let newApplication = await applicationModel.create({
            candidate: req.user.id,
            appliedJob: req.params.job,
            appStatus: currentAppStaus, 
            resume: userResume,  
            candiateEmail: userEmail
        });
        return newApplication;
    }catch(error){return commonResponses.internalError(res)}
}

async function createTransaction(req, res) {
    try{
        let newTransaction = await transactionModel.create({
            candidate: req.user.id,
            appliedJob: req.params.job
        })
     return newTransaction;
    }catch(error){return commonResponses.internalError(res)}
}

 async function isAlreadyApplied(uniqueJob) {
     try{
        let isApplied = await applicationModel.findOne({
            where: {candidate: uniqueJob.candidateId , appliedJob: uniqueJob.appliedJobId}
        });    
        return isApplied; 
     }catch(error){return commonResponses.internalError(res)}
 }

 async function isValidJob(toJob){
     try{
        let isValid= await newJobModel.findByPk(toJob); 
        return isValid; 
     }catch(error){return commonResponses.internalError(res)}
 }

 async function myApplication(userId){
     try{
        let app =  await applicationModel.findAll({
            where :{candidate:userId},
            attributes:['id','appliedJob','resume', 'taskSubmitted','appStatus', 'candiateEmail'],
            'include': [{'model':taskModel, attributes:['taskDescription']}] 
        });    
        return app;
     }catch(error){return commonResponses.internalError(res)}
 }
 async function currentApplication(toJob){
     try{
        let app =  await applicationModel.findOne({
            where :{id: toJob},
            attributes:['id','appliedJob','resume', 'taskGiven', 'taskSubmitted','appStatus'],
            'include': [{'model':taskModel, attributes:['taskDescription']}] 
        });    
        return app;    
     }catch(error){return commonResponses.internalError(res)}      
 }
 
 async function submitATask(submit){
     try{
        let task = await applicationModel.update(
            {taskSubmitted: submit.toSubmit, appStatus: 3},
            {where : {id: submit.toJob}}
        )
        return task;  
     }catch(error){return commonResponses.internalError(res)}
 }

 
module.exports.currentApplication = currentApplication;
module.exports.isValidJob = isValidJob;
module.exports.isAlreadyApplied = isAlreadyApplied;
module.exports.createTransaction = createTransaction;
module.exports.createApplication = createApplication;
module.exports.allOpenings = allOpenings;
module.exports.myApplication = myApplication;
module.exports.submitATask = submitATask;