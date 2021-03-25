const express = require('express');
const router = express.Router();

const hmController = require('../controllers/hmController');

router.get('/job-apps', hmController.jobApps)
router.get('/all-task', hmController.allTasks);
router.get('/completed-task-app', hmController.taskCompletedApp);
router.get('/refferedApplications', hmController.allReferedApplications);
router.post('/create-task', hmController.createTask);
router.put('/assign-task/:id',hmController.assignTask);
router.put('/skill-verdict/:id', hmController.skillVerdict)

module.exports =router;