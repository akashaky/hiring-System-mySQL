const Joi = require('@hapi/joi');

const checkSubmitTask = Joi.object({
    myTask: Joi.string().required()
})

const applyCheck= Joi.object({   
    email: Joi.string().email().lowercase().required()
})


module.exports = {
    checkSubmitTask,
    applyCheck
}