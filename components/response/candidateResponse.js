const { func } = require('@hapi/joi');
const _ = require('lodash')

function jobNotExists(res){
    return res.status(400).json({
        "status":{
            "code": 400,
            "message": "Job not found"
        }
    })        
}

function alreadyApplied(res){
    return res.status(400).json({
        "status":{
            "code": 400,
            "message": "You have already applied for this job"
        }
    }); 
}
function resumeReq(res){
    return res.status(400).json({
        "status":{
            "code":400,
            "message": "Resume is required"
        }
    })    
}

function notPdf(res){
    return res.status(400).json({
        "status":{
            "code":400,
            "message": "Only pdf files are allowed"
        }
    })    
}
function applied(newApp, res){
    return res.status(200).json({"status":{
        "code": "200",
        "message": 'Success'
    }, data: _.pick(newApp, ['id', 'appliedJob','appStatus', 'resume']) }) 
}

function alreadySubmitted(res){
    return res.status(400).json({
        "status":{
            "code":400,
            "message": "Task already Submitted"
        }
    })
}

function taskSubmit(res){
    return res.status(200).json({"status":{
        "code":200,
        "message":"Task Submitted"
    }})
}

module.exports.jobNotExists = jobNotExists;
module.exports.alreadyApplied = alreadyApplied;
module.exports.resumeReq = resumeReq
module.exports.notPdf = notPdf;
module.exports.applied = applied;
module.exports.alreadySubmitted = alreadySubmitted;
module.exports.taskSubmit = taskSubmit;