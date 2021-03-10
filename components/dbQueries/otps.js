const otpModel = require('../../models/otp');

async function sendOtp (req, res) {
    let userOtp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    let otp = await otpModel.create({otp:userOtp, email: req.body.email});
    return;            
}

async function validateOtp(req, res){
    let isValid = await otpModel.findOne({
        where: {otp: req.body.Otp}
    });
    return isValid;
}
async function findOtp(req, res){
    let isOtp = await otpModel.findOne({
        where: {otp:req.body.Otp}
    })
    return isOtp;
    
}
module.exports.sendOtp = sendOtp;
module.exports.validateOtp = validateOtp;
module.exports.findOtp = findOtp;