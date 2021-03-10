const newJobModel = require('../../models/job');

async function createJob (req, res) {
   let newJob = await newJobModel.create({
        jobDomain: req.body.jobDomain,
        jobPosition: req.body.jobPosition,
        reqExperience: req.body.reqExperience,
        jobDescription: req.body.jobDescription,  
        jobId: req.body.jobId,        
        createdBy: req.user.id,                     
    });   
    return newJob;        
}
async function isJob(req, res) {
    let job = await newJobModel.findOne({
        where: {jobId: req.body.jobId}
    });
    return job; 
}

module.exports.isJob = isJob
module.exports.createJob = createJob;