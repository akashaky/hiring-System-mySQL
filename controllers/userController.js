const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Joi = require('@hapi/joi');
const config = require('config')
const userQueries = require('../components/dbQueries/users');
const otpQueries = require('../components/dbQueries/otps');
const responses = require('../components/responses');
const {checkEmail, checkCreateUser, checkSignIn} = require('../components/validationSchema');

module.exports.generateOTP = async function(req, res){    
    try{    
        const { error } = await checkEmail.validateAsync(req.body);  
        let users = await userQueries.findEmail(req, res)        
        if(users != null){
            return res.status(401).json({"status":{
                "code":401,
                "message":"User with this email already exists"
            }})
        }else{  
            let otp = await otpQueries.sendOtp(req, res);
            return res.status(200).json({"status":{
                "code": 200,
                "message": "OTP sent"
            }})        
        }
       }catch(error){
           if(error.isJoi == true){responses.joiError(error, res)} 
           responses.internalError(req,res)
        }
}

module.exports.verifyOTP = async function(req, res,next){
    try{
        let isValidOTP = await otpQueries.validateOtp(req, res)
        if(isValidOTP == null) return res.status(401).json({"status":{
            "code":200,
            "message": "Invalid OTP"
        }});
        next();
    }catch(err){responses.internalError(req,res)}
}

module.exports.create = async function(req, res){
    try{     
        const { error } = await checkCreateUser.validateAsync(req.body);   
        let userEmail =  await otpQueries.findOtp(req,res);
        let user= await userQueries.findEmailWithOtp(req, res,userEmail);
        if(user != null) return res.status(400).json({"status":{
            "code":400,
            "message":"Your account has already been created"
        }})
        //encrptying Password
        const salt = await bcrypt.genSalt(10);
        ePassword = await bcrypt.hash(req.body.password, salt);
        //creatingh user and token 
        user = await userQueries.createUser(req, res,userEmail,ePassword);            
        const token = jwt.sign({_id: user._id, userRole: user.userRole}, config.get('jwtPrivateKey'));
        return res.header('x-auth-token',token).status(200).json({
            "staus":{
                "code": 200,
                "messagae" : "User created"
            },
            data: _.pick(user, ['name', 'email'])
        });      
    }catch(error){
        if(error.isJoi == true){responses.joiError(error, res)} 
        responses.internalError(req,res)
     }
}

module.exports.signIn = async function(req, res){
    try{        
        const { error } = await checkSignIn.validateAsync(req.body); 
        let user = await userQueries.findEmail(req, res);
        if(user == null){responses.invalidUser(req,res)}
        const ValidPassword = await bcrypt.compare(req.body.password, user.password);
        if(!ValidPassword){responses.invalidUser(req,res)}
        const token = jwt.sign({id: user.id, userRole: user.userRole,email:user.email}, config.get('jwtPrivateKey'));
        return res.status(200).json({"status":{
            "code":200,
            "message":"Your JWT is"
        },data:token})
    }catch(error){
        if(error.isJoi == true){responses.joiError(error, res)} 
        responses.internalError(req,res)
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
        responses.internalError(req,res)
    }
}

module.exports.profile = async function(req, res){
    try{       
       let user = await userQueries.findUser(req,res);
       return res.send(_.pick(user, ['name', 'email', 'id']));
    }catch(err){responses.internalError(req,res)}
 }



