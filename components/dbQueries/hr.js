const newJobModel = require('../../models/job');
const userModel = require('../../models/user');
const applicationModel = require('../../models/apply');
const transactionModel = require('../../models/transaction');
const responses = require('../responses');


async function allApplications () {
    try{
        let allApps = await applicationModel.findAll({
            'where': {'appStatus':1},
            attributes:['appStatus','id','taskGiven', 'taskSubmitted'],
            'include' :[{ 'model' : userModel, 'required' : true, attributes: ['id','name', 'email']},{
                'model': newJobModel, 'required': true, attributes: ['id','jobDomain', 'jobPosition', 'jobId']
            }]     
        });
        return allApps;
    }catch(error){responses.internalError(res)}
}

async function allSkilledApplications () {    
    try{
        let allApps = await applicationModel.findAll({
            'where': {'appStatus': 4},
            attributes:['appStatus','id','taskGiven', 'taskSubmitted', 'candidate', 'appliedJob'],
            'include':[{'model': userModel, attributes:['id','name','email']},{'model': newJobModel, attributes:['id','jobDomain', 'jobPosition','reqExperience']}]
              
        });
        return allApps;
    }catch(error){responses.internalError(res)}
}

async function isJob(uniqueJob) {
    try{
        let job = await newJobModel.findOne({
            where: {jobId: uniqueJob}
        });
        return job; 
    }catch(error){responses.internalError(res)}
}

async function createJob (req, res) {
    try{
        let newJob = await newJobModel.create({
            jobDomain: req.body.jobDomain,
            jobPosition: req.body.jobPosition,
            reqExperience: req.body.reqExperience,
            jobDescription: req.body.jobDescription,  
            jobId: req.body.jobId,        
            createdBy: req.user.id,                     
        });   
        return newJob;  
    }catch(error){responses.internalError(res)}      
}

async function rejectApp(appDecision){
    try{
        let transaction = await transactionModel.update(
            {applicationAcceptedBy:null, applicationRejectedBy: appDecision.userId},
            {where: {id: appDecision.appId}}
        )
        return transaction;
    }catch(error){responses.internalError(res)}
}

async function acceptApp(appDecision){
    try{
        let transaction = await transactionModel.update(
            {applicationAcceptedBy:appDecision.userId, applicationRejectedBy: null},
            {where: {id: appDecision.appId}}
        )   
        return transaction; 
    }catch(error){responses.internalError(res)}
}

async function finalAccept(finalDecision){
    try{
        let transaction = await transactionModel.update(
            {hiredBy:finalDecision.userId, rejectedBy: null},
            {where: {id: finalDecision.appId}}
        )   
        return transaction; 
    }catch(error){responses.internalError(res)}
}
async function finalReject(finalDecision){
    try{
        let transaction = await transactionModel.update(
            {hiredBy:null, rejectedBy: finalDecision.userId},
            {where: {id: finalDecision.appId}}
        )   
        return transaction; 
    }catch(error){responses.internalError(res)}
}
//Below are the common queries between hm and hr
async function isApplication(appId){ 
    try{
        let isApp = await applicationModel.findByPk(appId);
        return isApp;
    }catch(error){responses.internalError(res)}
}

async function updateApplication(newStatus){
    try{
        let app = await applicationModel.update(
            { appStatus: newStatus.updatedStatus},
            {where: {id: newStatus.appId}}  
        )  
        return app;
    }catch(error){responses.internalError(res)}
}


module.exports.finalAccept = finalAccept;
module.exports.finalReject = finalReject;
module.exports.acceptApp = acceptApp;
module.exports.updateApplication = updateApplication;
module.exports.isApplication = isApplication;
module.exports.allApplications = allApplications;
module.exports.rejectApp = rejectApp;
module.exports.allSkilledApplications =allSkilledApplications
module.exports.isJob = isJob
module.exports.createJob = createJob;
