const responses = require('../components/responses');
const adminQueries = require('../components/dbQueries/admin');

module.exports.allJobs = async function(req, res){
    if(req.user.userRole != 1){responses.forbidden(req, res)}
    try{
     let jobs = await adminQueries.allOpenings(req, res);
     return res.status(200).json({"status":{
         "code":200,
         "message":"success",
     },"data":jobs})
     
    }catch(err){responses.internalError(req, res)}
 
 }