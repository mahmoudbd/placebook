const express = require('express');
const { check } = require('express-validator');

const socialAuthControllers = require('../controllers/social-auth-controllers');


const router = express.Router();


router.post(
	'/signup',
	[
		check('name').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
	],
	socialAuthControllers.socialSignup
);

 router.post('/login', socialAuthControllers.socialLogin);

module.exports = router;
