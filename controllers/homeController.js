const responses = require('../components/responses');
const candidateQueries = require('../components/dbQueries/candidate')
module.exports.home = async function(req, res){
    try{
        let allJobs = await candidateQueries.allOpenings(req, res);
        return res.status(200).json({
            "status":{
                "code": 200,
                "message": "success"
            },
            data: allJobs
        });    
    }catch(error){responses.internalError(req,res)}
}
