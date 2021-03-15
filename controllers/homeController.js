const candidateQueries = require('../components/dbQueries/candidate')
const commonResponses = require('../components/response/commonResponses')
module.exports.home = async function(req, res){
    try{
        let allJobs = await candidateQueries.allOpenings();
        return commonResponses.successWithData(res, allJobs) 
    }catch(error){return commonResponses.internalError(res)}
}
