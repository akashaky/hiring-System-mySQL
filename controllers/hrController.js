const _ = require('lodash');
const Joi = require('@hapi/joi');
const newJobModel = require('../models/job')
const userModel = require('../models/user')
const jobQueries = require('../components/dbQueries/jobs');
const {checkCreateJob} = require('../components/validationSchema');
const responses = require('../components/responses');


//creating new Job
module.exports.createJob = async function(req, res){
    if(req.user.userRole!=3) {responses.forbidden(req, res)}  
    try{
        const { error } = await checkCreateJob.validateAsync(req.body); 
        let job = await jobQueries.isJob(req, res);    
        if(job !=null) {
            return res.status(400).json({status:{
                "code":400,
                "message":"This entity has already created"
            }});    
        }          
        let newJob = await jobQueries.createJob(req, res);        
        return res.status(200).json({
            "status":{
                "code": 200,
                "message": "Job Created"
            },
            "data": _.pick(newJob, ['id', 'jobDomain', 'jobPosition', 'reqExperience', 'jobD', 'jobId'])
        })           

    }catch(error){
        if(error.isJoi == true){responses.joiError(error, res)} 
        responses.internalError(req,res);
    }
}

