const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/sign-up', userController.generateOTP);
router.post('/register',userController.verifyOTP, userController.create);
router.post('/sign-in', userController.signIn);
router.get('/me', userController.auth, userController.profile);

router.use('/hr', userController.auth, require('./hr'));
router.use('/admin',userController.auth, require('./admin'));
router.use('/hm', userController.auth, require('./hm'));
router.use('/candidate', userController.auth, require('./candidate'))

module.exports = router;