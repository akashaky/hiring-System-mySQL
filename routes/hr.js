const express = require('express');
const router = express.Router();

const hrController = require('../controllers/hrController');

// router.get('/all-app-details', hrController.getAppDetails);
// router.get('/skill-approved-apps', hrController.skillApprovedApp);
// router.get('/:appStatus?', hrController.filterApplicants);
 router.post('/create-job',hrController.createJob);
//  router.get('/all-live-jobs',hrController.allJobs);
// router.put('/update-app-status/:id', hrController.updateJobAppStatus);
// router.put('/update-job/:id', hrController.updateJob);
// router.put('/final-verdict/:id', hrController.finalVerdict);


module.exports =router;