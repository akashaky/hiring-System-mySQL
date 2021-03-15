const otpModel = require('../../models/otp');
const commonResponses = require('../response/commonResponses');

async function sendOtp (inputEmail) {
    try{
        let userOtp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
        let otp = await otpModel.create({otp:userOtp, email: inputEmail});
        return;  
    }catch(error){return commonResponses.internalError(res)}          
}

async function validateOtp(inputOtp){
    try{
        let isValid = await otpModel.findOne({
            where: {otp: inputOtp}
        });
        return isValid;
    }catch(error){return commonResponses.internalError(res)}
}
async function findOtp(req, res){
    try{
        let isOtp = await otpModel.findOne({
            where: {otp:req.body.Otp}
        })
        return isOtp;
    }catch(erro){return commonResponses.internalError(res)}    
}
module.exports.sendOtp = sendOtp;
module.exports.validateOtp = validateOtp;
module.exports.findOtp = findOtp;