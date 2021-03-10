const express = require('express');
const router = express.Router();

const candidateController = require('../controllers/candidateController');

router.post('/apply/:job', candidateController.apply);
// router.get('/my-apps', candidateController.myapplications);
// router.put('/submit-task/:id', candidateController.submitTask);
router.get('/all-live-jobs', candidateController.allLiveJobs);

module.exports = router;