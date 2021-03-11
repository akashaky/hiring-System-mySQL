const newJobModel = require('../../models/job');
const userModel = require('../../models/user');
const applicationModel = require('../../models/apply');
const transactionModel = require('../../models/transaction');


async function allApplications (req, res) {
    let allApps = await applicationModel.findAll({
        'where': {'appStatus':1},
        attributes:['appStatus','id','taskGiven', 'taskSubmitted'],
        'include' :[{ 'model' : userModel, 'required' : true, attributes: ['id','name', 'email']},{
            'model': newJobModel, 'required': true, attributes: ['id','jobDomain', 'jobPosition', 'jobId']
        }]     
    });
    return allApps;
}

async function isApplication(req, res){
    let isApp = applicationModel.findByPk(req.params.id);
    return isApp;
}

async function  updateApplication(req, res){
    let app = applicationModel.update(
        { appStatus: req.body.appStatus},
        {where: {id: req.params.id}}  
    )  
    return app;
}

async function rejectApp(req, res){
    let transaction = await transactionModel.update(
        {applicationAcceptedBy:null, applicationRejectedBy: req.user.id},
        {where: {id: req.params.id}}
    )
    return transaction;
}
async function allSkilledApplications (req, res) {    
    let allApps = await applicationModel.findAll({
        'where': {'appStatus': 4},
        attributes:['appStatus','id','taskGiven', 'taskSubmitted', 'candidate', 'appliedJob'],
        'include':[{'model': userModel, attributes:['id','name','email']},{'model': newJobModel, attributes:['id','jobDomain', 'jobPosition','reqExperience']}]
          
    });
    return allApps;
}

async function acceptApp(req, res){
    let transaction = await transactionModel.update(
        {applicationAcceptedBy:req.user.id, applicationRejectedBy: null},
        {where: {id: req.params.id}}
    )   
    return transaction; 
}

async function finalAccept(req, res){
    let transaction = await transactionModel.update(
        {hiredBy:req.user.id, rejectedBy: null},
        {where: {id: req.params.id}}
    )   
    return transaction; 
}
async function finalReject(req, res){
    let transaction = await transactionModel.update(
        {hiredBy:null, rejectedBy: req.user.id},
        {where: {id: req.params.id}}
    )   
    return transaction; 
}


module.exports.finalAccept = finalAccept;
module.exports.finalReject = finalReject;
module.exports.acceptApp = acceptApp;
module.exports.updateApplication = updateApplication;
module.exports.isApplication = isApplication;
module.exports.allApplications = allApplications;
module.exports.rejectApp = rejectApp;
module.exports.allSkilledApplications =allSkilledApplications
