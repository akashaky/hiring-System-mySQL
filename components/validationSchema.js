const Joi = require('@hapi/joi');

const checkEmail = Joi.object({
    email: Joi.string().email().lowercase().required(),
})
const checkSignIn = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
})

const checkCreateUser = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    userRole: Joi.number().min(1).max(4).required(),
    Otp: Joi.number().min(6).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('password')
})

const checkCreateJob = Joi.object({
    jobDomain: Joi.string().min(5).max(50).required(),
    jobPosition: Joi.string().min(5).max(50).required(),
    reqExperience: Joi.string().min(5).max(50).required(),
    jobDescription: Joi.string().min(50).max(250).required(), 
    jobId: Joi.string().max(6).required(),
})
const checkCreateTask = Joi.object({
    taskDescription: Joi.string().required()
})
const checkVerdict = Joi.object({
    appStatus: Joi.number().min(0).max(5).required()
})
const checkAssignTask = Joi.object({
    task : Joi.string().required()    
})
const checkSubmitTask = Joi.object({
    myTask: Joi.string().required()
})



module.exports = {
    checkEmail,
    checkCreateUser,
    checkSignIn,
    checkCreateJob,
    checkCreateTask,
    checkVerdict,
    checkAssignTask,
    checkSubmitTask,

}