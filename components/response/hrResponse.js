const _ = require('lodash');
function isAlredayExists(res){
    return res.status(400).json({status:{
        "code":400,
        "message":"Job with this jobId already exists"
    }});    
}

function createdJob(data, res){
    return res.status(200).json({
        "status":{
            "code": 200,
            "message": "Job Created"
        },
        "data": _.pick(data, ['id', 'jobDomain', 'jobPosition', 'reqExperience', 'jobD', 'jobId'])
    })           
}

function invalidApp(res){
    return res.status(400).json({
        "status":{
            "code":400,
            "message": "Application with this id not found"
        }
     })    
}

function alreadySet(res){
    return res.status(400).json({
        "status":{
            "code":400,
            "message": "The appStatus is already set as per your request"
        }
    })    
}
function isupdated(res1, res){
    return res.status(200).json({
        "status":{
            "code": 200,
            "message": "This job application is updated"
        },
        "data": _.pick(res1, ['id', 'appStatus', 'appliedJob'])
    })    
}
function appNotFound(res){
    return res.status(400).json({"status":{
        "code": "400",
        "message": "Application not found"
    }})   
}

function updated(res) {
    return res.status(200).json({"status":{
        "code":200,
        "message": "Application Updated"
    }})
}


module.exports.invalidApp =invalidApp;
module.exports.createdJob = createdJob;
module.exports.isAlredayExists = isAlredayExists;
module.exports.alreadySet =alreadySet;
module.exports.isupdated = isupdated;
module.exports.appNotFound =appNotFound;
module.exports.updated =updated