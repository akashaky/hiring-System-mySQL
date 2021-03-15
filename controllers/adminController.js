const responses = require('../components/responses');
const adminQueries = require('../components/dbQueries/admin');
const userQueries = require('../components/dbQueries/users');
const adminResponses = require('../components/response/adminResponse')
const commonResponses = require('../components/response/commonResponses');

module.exports.allJobs = async function(req, res){
    if(req.user.userRole != 1){return commonResponses.forbidden(res)}
    try{
     let jobs = await adminQueries.allOpenings();
     return commonResponses.successWithData(res, jobs);     
    }catch(err){return commonResponses.internalError(res)} 
 }

 module.exports.allHiringDetails = async function (req, res){
    if(req.user.userRole != 1){return commonResponses.forbidden(res)}
    try{
        let allApplicationDetails = await adminQueries.transactionDetails();
        return commonResponses.successWithData(res, allApplicationDetails);
    }catch(error){return commonResponses.internalError(res)} 
}

module.exports.filterUser = async function(req, res){
    if(req.user.userRole !=1) {return commonResponses.forbidden(res)}
    let role = parseInt(req.query.userRole)
    if(role > 4 || role < 1) return adminResponses.invalidUserRole(res);
   try{
    let users = await adminQueries.findUser(role);
    return commonResponses.successWithData(res, users)
   }catch(error){return commonResponses.internalError(res)} 
}