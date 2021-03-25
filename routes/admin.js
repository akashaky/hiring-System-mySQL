const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/all-live-jobs', adminController.allJobs);
router.get('/transaction-details', adminController.allHiringDetails)
router.get('/refered-transaction-details', adminController.allReferedHiringDetails)
router.get('/:userRole?', adminController.filterUser);



module.exports =router;