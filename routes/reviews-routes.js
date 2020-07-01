const express = require('express');
const { check } = require('express-validator');

const reviewsController = require('../controllers/reviews-controllers');

const router = express.Router();

router.get('/:pid', reviewsController.getReviewsByPlaceId);

router.post('/newReview', [ check('reviewTxt').isLength({ min: 5 }) ], reviewsController.createReview);

router.delete('/:reviewid/:userId', reviewsController.deleteReview);

router.patch('/:reviewid', [ check('reviewTxt').isLength({ min: 5 }) ], reviewsController.updateReview);
module.exports = router;
