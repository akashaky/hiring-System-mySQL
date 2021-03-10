function invalidUser (req, res) {
    return res.status(401).json({"status":{
        "code":401,
        "message": "Invalid email/ Password"
    }})                
}

function internalError(req, res){
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

function forbidden(req, res){
    return res.status(403).json({"status":{
        "code":403,
        "message":"This request is forbidden to you"
    }})
}

module.exports.forbidden = forbidden;
module.exports.invalidUser = invalidUser;
module.exports.internalError = internalError;
module.exports.joiError = joiError