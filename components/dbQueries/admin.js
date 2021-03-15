const newJobModel = require('../../models/job');
const userModel = require('../../models/user');
const commonResponses = require('../response/commonResponses')
const transactionModel = require('../../models/transaction')


async function allOpenings () {
    try{
        let allJob = await newJobModel.findAll({
            attributes: [
                'id', 'jobDomain', 'jobPosition', 'jobDomain', 'jobDescription', 'jobId', 'reqExperience','createdBy'
             ],
            'include' :[{ 'model' : userModel, attributes: [
                'id', 'name', 'email'
             ],
             order: [
                ['updatedAt', 'DESC']
            ],
        }],     
        });
        return allJob;
    }catch(error){return commonResponses.internalError(res)}
}

async function transactionDetails(){
    try{
        let details = await transactionModel.findAll({
            attributes:['id'],
            'include':[{'model':userModel,as:'applicant', attributes:['id','name', 'email']},
            {'model':newJobModel, attributes:['jobDomain', 'jobPosition', 'reqExperience']},
            {'model':userModel, as:'AppAcceptedBy',attributes:['id','name', 'email']},
            {'model':userModel, as:'AppRejectedBy',attributes:['id','name', 'email']},
            {'model':userModel, as:'SkillAcceptedBy',attributes:['id','name', 'email']},
            {'model':userModel, as:'SkillRejectedBy',attributes:['id','name', 'email']},
            {'model':userModel, as:'HiredBy',attributes:['id','name', 'email']},
            {'model':userModel, as:'RejectedBy',attributes:['id','name', 'email']},
    
            ]            
        })
        return details;
    }catch(error){return commonResponses.internalError(res)}
}

async function findUser(role){
    try{
        let users = await userModel.findAll({
            where: {userRole:role},
            attributes: ['id','name','email', 'userRole']
        });    
        return users;
    }catch(error){return commonResponses.internalError(res)}
}

module.exports.findUser = findUser;
module.exports.transactionDetails=transactionDetails;
module.exports.allOpenings = allOpenings;