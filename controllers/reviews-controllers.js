const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const User = require('../models/user')

const HttpError = require('../models/http-error')
const Review = require('../models/review')

const createReview = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('.', 422))
  }

  const { date, reviewTxt, userId, placeId } = req.body

  let user
  try {
    user = await User.findById(userId)
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500)
    return next(error)
  }

  const newReview = new Review({
    date,
    userId,
    reviewTxt,
    placeId,
    creator: user,
  })

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await newReview.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    const error = new HttpError(
      'Creating review failed, please try again.',
      500
    )
    return next(error)
  }

  res.status(201).json({ review: newReview })
}

const getReviewsByPlaceId = async (req, res, next) => {
  const placeId = req.params.pid

  let placeWithReviews
  try {
    placeWithReviews = await Review.find({ placeId: placeId })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find reviews.',
      500
    )
    return next(error)
  }
  if (!placeWithReviews) {
    const error = new HttpError(
      'Could not find reviews for the provided place.',
      404
    )
    return next(error)
  }

  res.json({
    reviews: placeWithReviews.map((review) =>
      review.toObject({ getters: true })
    ),
  })
}

const updateReview = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { reviewTxt } = req.body
  const reviewId = req.params.reviewid

  let reviewToEdit
  try {
    reviewToEdit = await Review.findById(reviewId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update review.',
      500
    )
    return next(error)
  }

  reviewToEdit.reviewTxt = reviewTxt

  try {
    await reviewToEdit.save()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update review.',
      500
    )
    return next(error)
  }

  res.status(200).json({ review: reviewToEdit.toObject({ getters: true }) })
}

const deleteReview = async (req, res, next) => {
  const reviewId = req.params.reviewid
  const userId = req.params.userId

  let reviewToDelete
  try {
    reviewToDelete = await Review.findById(reviewId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete review.',
      500
    )
    return next(error)
  }

  if (!reviewToDelete) {
    const error = new HttpError('Could not find review for this id.', 404)
    return next(error)
  }

  if (reviewToDelete.userId !== userId) {
    const error = new HttpError(
      'You are not allowed to delete this review.',
      401
    )
    return next(error)
  }

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await reviewToDelete.remove({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete review.',
      500
    )
    return next(error)
  }

  res.status(200).json({ message: 'Deleted review.' })
}

exports.createReview = createReview
exports.getReviewsByPlaceId = getReviewsByPlaceId
exports.updateReview = updateReview
exports.deleteReview = deleteReview
