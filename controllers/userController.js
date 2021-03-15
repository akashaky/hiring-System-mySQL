const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Joi = require('@hapi/joi');
const config = require('config')
const userQueries = require('../components/dbQueries/users');
const otpQueries = require('../components/dbQueries/otps');
const checkEmail = require('./inputValidations/email');
const {checkCreateUser, checkSignIn} = require('./inputValidations/users');
const userResponses = require('../components/response/userResponse');
const commonResponses = require('../components/response/commonResponses');

module.exports.generateOTP = async function(req, res){    
    try{    
        const { error } = await checkEmail.validateAsync(req.body);  
        let inputEmail = req.body.email;
        let user = await userQueries.findEmail(inputEmail);       
        if(user != null){
           return userResponses.alreadyExists(res);
        }else{  
            let otp = await otpQueries.sendOtp(inputEmail);
            return userResponses.otpSent(res);       
        }
       }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
        }
}

module.exports.verifyOTP = async function(req, res,next){
    try{
        let inputOtp = req.body.Otp;
        let isValidOTP = await otpQueries.validateOtp(inputOtp)
        if(isValidOTP == null) {return userResponses.invalidOtp(res)}
        next();
    }catch(err){return commonResponses.internalError(res)}
}

module.exports.create = async function(req, res){
    try{     
        const { error } = await checkCreateUser.validateAsync(req.body);   
        let userOTP =  await otpQueries.findOtp(req,res);
        let user= await userQueries.findEmailWithOtp(req, res,userOTP);
        if(user != null) {return userResponses.accountExists(res)}
        //encrptying Password
        const salt = await bcrypt.genSalt(10);
        ePassword = await bcrypt.hash(req.body.password, salt);
        //creating user and token 
        let userData = {email: userOTP.email, name: req.body.name, userRole: req.body.userRole, password: ePassword}
        user = await userQueries.createUser(userData);            
        const token = jwt.sign({_id: user._id, userRole: user.userRole}, config.get('jwtPrivateKey'));
        return userResponses.createdUser(res, user);  
    }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
     }
}

module.exports.signIn = async function(req, res){
    try{        
        const { error } = await checkSignIn.validateAsync(req.body); 
        let inputEmail = req.body.email;
        let user = await userQueries.findEmail(inputEmail);
        if(user == null){return commonResponses.invalidUser(res)}
        const ValidPassword = await bcrypt.compare(req.body.password, user.password);
        if(!ValidPassword){commonResponses.invalidUser(req,res)}
        const token = jwt.sign({id: user.id, userRole: user.userRole,email:user.email}, config.get('jwtPrivateKey'));
        return userResponses.sendToken(res, token);
    }catch(error){
        if(error.isJoi == true){return commonResponses.joiError(error, res)}
        return commonResponses.internalError(res)
     }
}

module.exports.auth = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token) {return userResponses.noToken(res)}
    try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;   
    next();   
    } catch (err){
        return commonResponses.internalError(res)
    }
}

module.exports.profile = async function(req, res){
    try{      
       let uniqueUser = req.user.email; 
       let user = await userQueries.findUser(uniqueUser);
       return userResponses.yourProfile(res,user);
    }catch(err){return commonResponses.internalError(res)}
 }



