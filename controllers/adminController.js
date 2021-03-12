const responses = require('../components/responses');
const adminQueries = require('../components/dbQueries/admin');
const userQueries = require('../components/dbQueries/users');

module.exports.allJobs = async function(req, res){
    if(req.user.userRole != 1){responses.forbidden(req, res)}
    try{
     let jobs = await adminQueries.allOpenings(req, res);
     return res.status(200).json({"status":{
         "code":200,
         "message":"success",
     },"data":jobs})
     
    }catch(err){res.send(err)}
 
 }
 module.exports.allHiringDetails = async function (req, res){
    if(req.user.userRole != 1)responses.forbidden(req,res);
    try{
        let allApplicationDetails = await adminQueries.transactionDetails(req, res);
        return res.status(200).json({status: {
            "code": 200,
            "message": "success"
        }, "data" : allApplicationDetails})
    }catch(error){internalError(res)}
}

module.exports.filterUser = async function(req, res){
    if(req.user.userRole !=1) responses.forbidden(res)
    let role = parseInt(req.query.userRole)
    if(role > 4 || role < 1) return res.status(400).json({
        "status":{
            "code": 400,
            "message": "The value of userRole should lie between 1 to 4"
        }
    })
    
   try{
    let users = await userQueries.findUser(req, res);
    return res.status(200).json({status: {
        "code": 200,
        "message": "success"
    }, "data" : users})
   }catch(error){responses.internalError(req,res)}
}