const Joi = require('@hapi/joi');

const checkSubmitTask = Joi.object({
    myTask: Joi.string().required()
})
module.exports = {
    checkSubmitTask,
}