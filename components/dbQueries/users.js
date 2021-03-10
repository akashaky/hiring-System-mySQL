const userModel = require('../../models/user');

async function findEmail(req,res) {         
    let user = await userModel.findOne({
        where: {email: req.body.email}
    })
    return user;              
}
async function findEmailWithOtp(req,res,userEmail) {         
    let user = await userModel.findOne({
        where: {email: userEmail.email}
    })
    return user;              
}
async function findUser(req,res) {       
    let user = await userModel.findOne({
        where : {email:req.user.email}
    })
    return user;              
}
async function createUser(req, res, userEmail,ePassword){
   let user = await userModel.create({
    name: req.body.name,
    email: userEmail.email,
    password: ePassword,
    userRole: req.body.userRole
   })
   return user;
}
module.exports.findEmail = findEmail;
module.exports.createUser = createUser;
module.exports.findEmailWithOtp = findEmailWithOtp;
module.exports.findUser = findUser;