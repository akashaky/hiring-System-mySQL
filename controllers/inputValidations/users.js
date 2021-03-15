const Joi = require('@hapi/joi');


const checkSignIn = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
})

const checkCreateUser = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    userRole: Joi.number().min(1).max(4).required(),
    Otp: Joi.number().min(6).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('password')
})
module.exports = {
    checkSignIn,
    checkCreateUser
}