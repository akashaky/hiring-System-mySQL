const Joi = require('@hapi/joi');


const checkCreateTask = Joi.object({
    taskDescription: Joi.string().required()
})
const checkVerdict = Joi.object({
    appStatus: Joi.number().min(0).max(5).required()
})
const checkAssignTask = Joi.object({
    task : Joi.string().required()    
})

module.exports = {
    checkCreateTask,
    checkVerdict,
    checkAssignTask
}