const taskModel = require('../../models/task');
const userModel = require('../../models/user');

async function isTaskExists (req, res) {
   let isTask = await taskModel.findOne({
    where: {taskDescription: req.body.taskDescription}
});    
return isTask;        
}

async function createTask (req, res) {
    let task = await taskModel.create({
        createdBy: req.user.id,
        taskDescription : req.body.taskDescription
    })
    return task;   
}
async function allTasks (req, res) {
    let allTask =  await taskModel.findAll({
        attributes: [
            'id', 'taskDescription'],
        'include' :[{'model' : userModel, attributes: [
            'id', 'name', 'email']}]
    })
    return allTask;
}
async function isTask(req, res){
    let task = await taskModel.findByPk(req.body.task);
    return task;  
}

module.exports.isTask = isTask;
module.exports.allTasks = allTasks;
module.exports.createTask = createTask;
module.exports.isTaskExists = isTaskExists;