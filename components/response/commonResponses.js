const { func } = require("joi");

function successWithData(res,data){
    return res.status(200).json({"status":{
        "code":200,
        "message":"Success"
    },"data": data})
}

function invalidUser (res) {
    return res.status(401).json({"status":{
        "code":401,
        "message": "Invalid email/ Password"
    }})                
}

function internalError(res){
    return res.status(500).json({"status":{
        "code":500,
        "message": "Internal server error"
    }});
}
function joiError(error, res){
    return res.status(400).json({status:{
        "code":400,
        "message": error.details[0].message
    }});  
}

function forbidden(res){
    return res.status(403).json({"status":{
        "code":403,
        "message":"This request is forbidden to you"
    }})
}

function unauthorized(res){
    return res.status(401).json({
        "status":{
            "code": 401,
            "message": "Unauthorized"
        }
    }); 
}

function formAlreadyAssigned(res) {
    return res.status(400).json({"status":{
        "code": "400",
        "message": "Form is already assigned as per your request"
    }}) 
    
}

function notFound(res){
    return res.status(400).json({"status":{
        "code": "400",
        "message": "Application not found"
    }}) 
}


module.exports.successWithData = successWithData;
module.exports.forbidden = forbidden;
module.exports.invalidUser = invalidUser;
module.exports.internalError = internalError;
module.exports.joiError = joiError
module.exports.unauthorized = unauthorized;
module.exports.formAlreadyAssigned = formAlreadyAssigned;
module.exports.notFound = notFound;
