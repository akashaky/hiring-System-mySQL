const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Joi = require('@hapi/joi');
const config = require('config')
const userQueries = require('../components/dbQueries/users');
const otpQueries = require('../components/dbQueries/otps');
const responses = require('../components/responses');
const checkEmail = require('./inputValidations/email');
const {checkCreateUser, checkSignIn} = require('./inputValidations/users');

module.exports.generateOTP = async function(req, res){    
    try{    
        const { error } = await checkEmail.validateAsync(req.body);  
        let inputEmail = req.body.email;
        let user = await userQueries.findEmail(inputEmail);       
        if(user != null){
            return res.status(401).json({"status":{
                "code":401,
                "message":"User with this email already exists"
            }})
        }else{  
            let otp = await otpQueries.sendOtp(inputEmail);
            return res.status(401).json({"status":{
                "code": 401,
                "message": "OTP sent"
            }})        
        }
       }catch(error){
        if(error.isJoi == true){return responses.joiError(error, res)}
        return responses.internalError(res)
        }
}

module.exports.verifyOTP = async function(req, res,next){
    try{
        let inputOtp = req.body.Otp;
        let isValidOTP = await otpQueries.validateOtp(inputOtp)
        if(isValidOTP == null) return res.status(401).json({"status":{
            "code":200,
            "message": "Invalid OTP"
        }});
        next();
    }catch(err){return responses.internalError(res)}
}

module.exports.create = async function(req, res){
    try{     
        const { error } = await checkCreateUser.validateAsync(req.body);   
        let userOTP =  await otpQueries.findOtp(req,res);
        let user= await userQueries.findEmailWithOtp(req, res,userOTP);
        if(user != null) return res.status(400).json({"status":{
            "code":400,
            "message":"Your account has already been created"
        }})
        //encrptying Password
        const salt = await bcrypt.genSalt(10);
        ePassword = await bcrypt.hash(req.body.password, salt);
        //creating user and token 
        let userData = {email: userOTP.email, name: req.body.name, userRole: req.body.userRole, password: ePassword}
        user = await userQueries.createUser(userData);            
        const token = jwt.sign({_id: user._id, userRole: user.userRole}, config.get('jwtPrivateKey'));
        return res.header('x-auth-token',token).status(200).json({
            "staus":{
                "code": 200,
                "messagae" : "User created"
            },
            data: _.pick(user, ['name', 'email'])
        });      
    }catch(error){
        if(error.isJoi == true){return responses.joiError(error, res)}
        return responses.internalError(res)
     }
}

module.exports.signIn = async function(req, res){
    try{        
        const { error } = await checkSignIn.validateAsync(req.body); 
        let inputEmail = req.body.email;
        let user = await userQueries.findEmail(inputEmail);
        if(user == null){return responses.invalidUser(res)}
        const ValidPassword = await bcrypt.compare(req.body.password, user.password);
        if(!ValidPassword){responses.invalidUser(req,res)}
        const token = jwt.sign({id: user.id, userRole: user.userRole,email:user.email}, config.get('jwtPrivateKey'));
        return res.status(200).json({"status":{
            "code":200,
            "message":"Your JWT is"
        },data:token})
    }catch(error){
        if(error.isJoi == true){return responses.joiError(error, res)}
        return responses.internalError(res)
     }
}

module.exports.auth = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({"status":{
        "code":401,
        "message": 'Accesss Denied. No token Provieded'
    }});
    try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;   
    next();   
    } catch (err){
        return responses.internalError(res)
    }
}

module.exports.profile = async function(req, res){
    try{      
       let uniqueUser = req.user.email; 
       let user = await userQueries.findUser(uniqueUser);
       return res.send(_.pick(user, ['name', 'email', 'id']));
    }catch(err){return responses.internalError(res)}
 }



