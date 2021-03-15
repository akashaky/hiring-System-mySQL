const { func } = require("joi");
const _ = require('lodash');

function alreadytask(res){
    return res.status(400).json({status:{
        "code":400,
        "message":"This task has already created"
    }}); 
}
function alredayAssigned(res){
    return res.status(400).json({"status":{
        "code": "400",
        "message": "Task is already assigned as per your request"
    }}) 
    
}

function  notATAsk(res){
    return res.status(400).json({"status":{
        "code":400,
        "message": "Task not found"
    }})    
}

function isUpdated(res){
    return res.status(200).json({
        "status":{
            "code": 200,
            "message": "This job application is updated"
        }
    }) 
}

function edited(editJobStatus, res){
    return res.status(200).json({"status":{
        "code": "200",
        "message": "success"
    }, data: _.pick(editJobStatus, ['id', 'appStatus', 'appliedJob'])})
}


module.exports.alreadytask = alreadytask;
module.exports.alredayAssigned =alredayAssigned;
module.exports.notATAsk =notATAsk;
module.exports.isUpdated = isUpdated
module.exports.edited =edited;