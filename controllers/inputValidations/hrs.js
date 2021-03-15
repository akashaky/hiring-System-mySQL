const Joi = require('@hapi/joi');


const checkCreateJob = Joi.object({
    jobDomain: Joi.string().min(5).max(50).required(),
    jobPosition: Joi.string().min(5).max(50).required(),
    reqExperience: Joi.string().min(5).max(50).required(),
    jobDescription: Joi.string().min(50).max(250).required(), 
    jobId: Joi.string().max(6).required(),
})

const checkVerdict = Joi.object({
    appStatus: Joi.number().min(0).max(5).required()
})

module.exports = {
    checkVerdict,
    checkCreateJob
}
