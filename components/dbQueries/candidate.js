const newJobModel = require('../../models/job');
const applicationModel = require('../../models/apply');
const transactionModel = require('../../models/transaction');

async function allOpenings (req, res) {
    let allJob = await newJobModel.findAll({
        attributes: [
            'id','jobDomain', 'jobPosition', 'jobDomain', 'jobDescription', 'jobId', 'reqExperience'
         ],
    })
    return allJob;
}

async function createApplication (req, res,userResume) {
   let newApplication = await applicationModel.create({
    candidate: req.user.id,
    appliedJob: req.params.job,
    appStatus: 1, 
    resume: userResume  
});
return newApplication;
}

async function createTransaction(req, res) {
    let newTransaction = await transactionModel.create({
        candidate: req.user.id,
        appliedJob: req.params.job
    })
 return newTransaction;
 }

 async function isAlreadyApplied(req, res) {
     let isApplied = await applicationModel.findOne({
         where: {candidate: req.user.id, appliedJob: req.params.job}
     });    
     return isApplied; 
 }

 async function isValidJob(req, res) {
     let isValid= await newJobModel.findByPk(req.params.job); 
     return isValid;    
 }

module.exports.isValidJob = isValidJob;
module.exports.isAlreadyApplied = isAlreadyApplied;
module.exports.createTransaction = createTransaction;
module.exports.createApplication = createApplication;
module.exports.allOpenings = allOpenings;