const express = require('express');
const signupController = require('./signupController');

const router = express.Router();

router.get('/gerAllUsers',signupController.getAllUsers);            //Easy Way
router.route('/deleteUser').delete(signupController.deleteUser);

router.route('/signup').post(signupController.createUser);           //Sign Up
router.route('/login').post(signupController.login);

module.exports = router;
