const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const bucketlistControllers = require('../controllers/bucketList-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router()

router.get('/', usersController.getUsers);

router.post(
	'/signup',
	fileUpload.single('image'),
	[
		check('name').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 6 })
	],
	usersController.signup
);

router.post('/login', usersController.login);

router.get('/profile/:pid', usersController.getUserProfile);
router.patch('/profile/:pid', fileUpload.single('image'), usersController.updateUserProfile);
router.delete('/:pid', usersController.deleteUser);

router.get('/bucketlist/:uid', bucketlistControllers.getBucketList);
router.use(checkAuth);
router.patch('/bucketlist/:pid', bucketlistControllers.createBucketList);
router.put('/bucketlist/:pid', bucketlistControllers.visitedPlace);
router.delete('/bucketlist/:pid', bucketlistControllers.deleteBucketList);

module.exports = router
