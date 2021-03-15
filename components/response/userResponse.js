const _ = require('lodash');
function alreadyExists(res){
    return res.status(401).json({"status":{
        "code":401,
        "message":"User with this email already exists"
    }})    
}

function otpSent(res){
    return res.status(200).json({"status":{
        "code": 200,
        "message": "OTP sent"
    }})    
}

function invalidOtp(res){
    return res.status(401).json({"status":{
        "code":200,
        "message": "Invalid OTP"
    }});    
}

function accountExists(res){
    return res.status(400).json({"status":{
        "code":400,
        "message":"Your account has already been created"
    }})    
}
function createdUser(res, user){
    return res.header('x-auth-token',token).status(200).json({
        "staus":{
            "code": 200,
            "messagae" : "User created"
        },
        data: _.pick(user, ['name', 'email'])
    });    
}

function sendToken(res, token){
    return res.status(200).json({"status":{
        "code":200,
        "message":"Your JWT is"
    },data:token})    
}

function noToken(res){
    return res.status(401).json({"status":{
        "code":401,
        "message": 'Accesss Denied. No token Provieded'
    }});
}
function yourProfile(res, user){
    return res.status(200).json({"status":{
        "code":200,
        "message":"Success"
    },data:_.pick(user, ['name', 'email', 'id'])}) 
    
}

module.exports.alreadyExists = alreadyExists;
module.exports.otpSent =otpSent;
module.exports.invalidOtp =invalidOtp;
module.exports.accountExists = accountExists;
module.exports.createdUser =createdUser;
module.exports.noToken =noToken;
module.exports.yourProfile =yourProfile;
module.exports.sendToken =sendToken;