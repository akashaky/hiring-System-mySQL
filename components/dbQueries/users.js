const userModel = require('../../models/user');
const responses = require('../responses');

async function findEmail(inputEmail) {
    try{
        let user = await userModel.findOne({
            where: {email: inputEmail}
        })
        return user;  
    } catch(error){return responses.internalError(res)}                    
}

async function findEmailWithOtp(req,res,userEmail) {         
    try{
        let user = await userModel.findOne({
            where: {email: userEmail.email}
        })
        return user;  
    }catch(error){responses.internalError(res)}            
}

async function findUser(uniqueUser) {
    try{
        let user = await userModel.findOne({
            where : {email:uniqueUser}
        })
        return user;  
    }catch(error){responses.internalError(res)}                   
}

async function createUser(userData){
    try{
        let user = await userModel.create({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            userRole: userData.userRole
           })
           return user;
    }catch(error){responses.internalError(res)}
}

module.exports.findEmail = findEmail;
module.exports.createUser = createUser;
module.exports.findEmailWithOtp = findEmailWithOtp;
module.exports.findUser = findUser;
