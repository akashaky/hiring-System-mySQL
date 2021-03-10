const newJobModel = require('../../models/job');
const userModel = require('../../models/user');


async function allOpenings (req, res) {
    let allJob = await newJobModel.findAll({
        attributes: [
            'id', 'jobDomain', 'jobPosition', 'jobDomain', 'jobDescription', 'jobId', 'reqExperience','createdBy'
         ],
        'include' :[{ 'model' : userModel, attributes: [
            'id', 'name', 'email'
         ],
    }],     
    });
    return allJob;
}

module.exports.allOpenings = allOpenings;