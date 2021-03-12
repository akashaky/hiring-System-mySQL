const newJobModel = require('../../models/job');
const userModel = require('../../models/user');
const transactionModel = require('../../models/transaction')


async function allOpenings (req, res) {
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
}

async function transactionDetails(req, res){
    
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
}

module.exports.transactionDetails=transactionDetails;
module.exports.allOpenings = allOpenings;