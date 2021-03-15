const Joi = require('@hapi/joi');

const checkEmail = Joi.object({
    email: Joi.string().email().lowercase().required(),
})

module.exports = checkEmail;