const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const Place = require('../models/place')

const HttpError = require('../models/http-error')
const User = require('../models/user')

const getUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, '-password')
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    )
    return next(error)
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) })
}

const signup = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { name, email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    )
    return next(error)
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    )
    return next(error)
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    const error = new HttpError('Could not create user, please try again.', 500)
    return next(error)
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  })

  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    )
    return next(error)
  }

  let token
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      }
    )
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    )
    return next(error)
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
  })
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  let existingUser

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    )
    return next(error)
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    )
    return next(error)
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    )
    return next(error)
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    )
    return next(error)
  }

  let token
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      }
    )
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    )
    return next(error)
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  })
}

const getUserProfile = async (req, res, next) => {
  const userId = req.params.pid
  let user
  try {
    user = await User.findById(userId)
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    )
    return next(error)
  }
  res.json({ user: user })
}

const updateUserProfile = async (req, res, next) => {
  const userId = req.params.pid
  const { name, email, password } = req.body
  let image
  if (req.file) image = req.file.path

  let user
  try {
    user = await User.findById(userId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user profile.',
      500
    )
    return next(error)
  }
  let hashedPassword
  if (password) {
    try {
      hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
      const error = new HttpError(
        'Could not create user, please try again.',
        500
      )
      return next(error)
    }
  }
  if (name) user.name = name
  if (email) user.email = email
  if (password) user.password = hashedPassword
  if (image) user.image = image

  try {
    await user.save()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user profile.',
      500
    )
    return next(error)
  }
  res.status(200).json({ user: user.toObject({ getters: true }) })
}

const deleteUser = async (req, res, next) => {
  const userId = req.params.pid

  let user
  try {
    user = await User.findById(userId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.1',
      500
    )
    return next(error)
  }

  if (!user) {
    const error = new HttpError('Could not find user for this id.2', 404)
    return next(error)
  }

  //   const imagePath = user.image

  try {
    await user.remove()
    await user.places.map(async (placeId) => {
      const place = await Place.findById(placeId)
      //   const imagePath = place.image
      await place.remove()
      //   fs.unlink(imagePath, (err) => {
      //     console.log(err)
      //   })
    })
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.3',
      500
    )
    return next(error)
  }

  //   fs.unlink(imagePath, (err) => {
  //     console.log(err)
  //   })

  res.status(200).json({ message: 'Deleted user.' })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
exports.getUserProfile = getUserProfile
exports.updateUserProfile = updateUserProfile
exports.deleteUser = deleteUser
