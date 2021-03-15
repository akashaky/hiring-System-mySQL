function invalidUserRole(res){
    return res.status(400).json({
        "status":{
            "code": 400,
            "message": "The value of userRole should lie between 1 to 4"
        }
    })        
}

module.exports.invalidUserRole = invalidUserRole;