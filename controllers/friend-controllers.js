const HttpError = require('../models/http-error')
const User = require('../models/user')
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const { ObjectId } = mongoose.Types

const addFriendRequest = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid userId or friendId, please check your data.', 422)
    )
  }
  const { userId, friendId } = req.body
  let user
  let friend
  try {
    // Get the user
    user = await User.findOne({ _id: userId }, '-password')
      .populate({ path: 'friends.user', model: User })
      .populate({ path: 'sentRequests.user', model: User })
      .populate({ path: 'getRequest.user', model: User })
  } catch (error) {
    const err = new HttpError('smt went wrong , could not find a user', 500)
    return next(err)
  }
  if (!user) {
    const err = new HttpError('Could not find a user for given id', 404)
    return next(err)
  }

  try {
    // Find Friend
    friend = await User.findOne({ _id: friendId }, '-password')
    if (!friend) {
      const err = new HttpError('Could not find friend to sent request!', 404)
      return next(err)
    }
    // Check if the user is friend with the person
    if (
      user.friends &&
      user.friends.some((friend) => ObjectId(friend.user.id).equals(friendId))
    ) {
      const err = new HttpError(
        'You are already friends with ' + friend.name,
        402
      )
      return next(err)
    }
    // Check if there is an existing request
    if (
      user.sentRequests &&
      user.sentRequests.some((sentRequestItem) =>
        ObjectId(sentRequestItem.user.id).equals(friendId)
      )
    ) {
      const err = new HttpError(
        'You already send a request to ' + friend.name,
        402
      )
      return next(err)
    }

    // TODO add if friend send a request

    if (
      user.getRequests &&
      user.getRequests.some((getRequestItem) =>
        ObjectId(getRequestItem.user.id).equals(friendId)
      )
    ) {
      const err = new HttpError(
        'This person already send you a request ' + friend.name,
        402
      )
      return next(err)
    }
  } catch (error) {}
  try {
    const sentRequest = {
      user: ObjectId(friendId),
      date: Date(),
    }
    const getRequest = {
      user: ObjectId(userId),
      date: sentRequest.date,
    }
    // Update user data
    user.sentRequests.push(sentRequest)

    // Update friend data
    friend.getRequests.push(getRequest)

    // Transaction to save both friend and user information
    const session = await mongoose.startSession()
    session.startTransaction()
    await user.save({ session })
    await friend.save({ session })
    await session.commitTransaction()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not send request.',
      500
    )
    return next(error)
  }
  // TODO NOTIFICATION

  res.status(200).json({ message: 'Friend req created!' })
}

const getFriendRequests = async (req, res, next) => {
  const userId = req.params.uid
  if (!ObjectId.isValid(userId)) {
    return
  }
  try {
    user = await User.findOne({ _id: userId }, '-password').populate({
      path: 'getRequests.user',
      model: User,
    })
    if (!user) {
      const err = new HttpError('Could not find user!', 404)
      return next(err)
    }
  } catch (e) {
    const err = new HttpError('Something went wrong while fetching user!', 500)
    return next(err)
  }
  try {
    const friendRequests = user.getRequests.toObject().map((request) => {
      return {
        name: request.user.name,
        email: request.user.email,
        image: request.user.image,
        userId: request.user._id,
      }
    })
    res.status(200).json({
      friendRequests,
    })
  } catch (e) {
    const err = new HttpError('Could not get friend requests!', 404)
    return next(err)
  }
}
const deleteSentAndGetRequest = async (userId, friendId, next) => {
  let user
  let friend
  try {
    user = await User.findById(userId, '-password')
    friend = await User.findById(friendId, ' -password')

    if (!user || !friend) {
      const err = new HttpError(
        'Could not find user or friend for provided id!',
        500
      )
      return next(err)
    }

    let getReqDoc = user.getRequests.filter((request) => {
      return request.user == friendId
    })
    let sentReqDoc = friend.sentRequests.filter((request) => {
      return request.user == userId
    })
    if (getReqDoc.length === 0 || sentReqDoc.length === 0) {
      const err = new HttpError('There is no friend request!', 404)
      return next(err)
    }

    user.getRequests.pull(getReqDoc[0])
    friend.sentRequests.pull(sentReqDoc[0])
    return { user, friend }
  } catch (e) {
    const err = new HttpError(
      'Something went wrong while deleting requests!',
      500
    )
    return next(err)
  }
}
const cancelFriendRequest = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid userId or friendId, please check your data.', 422)
    )
  }
  const { userId, friendId } = req.body
  try {
    user = await User.findById(userId, '-password')
    friend = await User.findById(friendId, ' -password')

    if (!user || !friend) {
      const err = new HttpError(
        'Could not find user or friend for provided id!',
        500
      )
      return next(err)
    }

    let getReqDoc = friend.getRequests.filter((request) => {
      return request.user == userId
    })
    let sentReqDoc = user.sentRequests.filter((request) => {
      return request.user == friendId
    })
    if (getReqDoc.length === 0 || sentReqDoc.length === 0) {
      const err = new HttpError('There is no friend request!', 404)
      return next(err)
    }
    friend.getRequests.pull(getReqDoc[0])
    user.sentRequests.pull(sentReqDoc[0])
    const session = await mongoose.startSession()
    session.startTransaction()
    await user.save({ session })
    await friend.save({ session })
    await session.commitTransaction()
  } catch (e) {
    const err = new HttpError(
      'Something went wrong while cancelling request!',
      500
    )
    return next(err)
  }
  res.status(200).json({ message: 'Friend request cancelled!' })
}
const rejectFriendRequest = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid userId or friendId, please check your data.', 422)
    )
  }
  const { userId, friendId } = req.body
  try {
    const { user, friend } = await deleteSentAndGetRequest(
      userId,
      friendId,
      next
    )
    const session = await mongoose.startSession()
    session.startTransaction()
    await user.save({ session })
    await friend.save({ session })
    await session.commitTransaction()
  } catch (e) {
    const err = new HttpError(
      'Something went wrong while rejecting request!',
      500
    )
    return next(err)
  }

  res.status(200).json({ message: 'Friend request rejected!' })
}

const acceptFriendRequest = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid userId or friendId, please check your data.', 422)
    )
  }
  const { userId, friendId } = req.body
  try {
    const { user, friend } = await deleteSentAndGetRequest(
      userId,
      friendId,
      next
    )
    // check if already friends or not ????

    // Check if the user is friend with the person
    if (
      user.friends &&
      user.friends.some((friend) => ObjectId(friend.user.id).equals(friendId))
    ) {
      const err = new HttpError(
        'You are already friends with ' + friend.name,
        402
      )
      return next(err)
    }
    const userFriendDoc = {
      user: ObjectId(friendId),
      date: Date(),
    }
    const friendFriendDoc = {
      user: ObjectId(userId),
      date: userFriendDoc.date,
    }

    user.friends.push(userFriendDoc)
    friend.friends.push(friendFriendDoc)
    const session = await mongoose.startSession()
    session.startTransaction()
    await user.save({ session })
    await friend.save({ session })
    await session.commitTransaction()
  } catch (e) {
    const err = new HttpError(
      'Something went wrong while accepting friend request!',
      500
    )
    return next(err)
  }

  res.status(201).json({
    message: 'Accepted friend request! You have a new friend now!',
  })
}
const deleteFriend = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid userId or friendId, please check your data.', 422)
    )
  }
  const { userId, friendId } = req.body
  let user
  let friend
  try {
    user = await User.findById(userId, '-password')
    friend = await User.findById(friendId, ' -password')
  } catch (e) {
    const err = new HttpError(
      'Something went wrong while fetching user or friend!',
      500
    )
    return next(err)
  }
  try {
    if (!user || !friend) {
      const err = new HttpError(
        'Could not find user or friend for provided id!',
        404
      )
      return next(err)
    }
    let userFriendList = user.friends.filter((item) => {
      return item.user == friendId
    })
    let friendFriendList = friend.friends.filter((item) => {
      return item.user == userId
    })
    user.friends.pull(userFriendList[0])
    friend.friends.pull(friendFriendList[0])
    // if something goes wrong with saving 'user changes' than friend changes will not be saved too.
    const session = await mongoose.startSession()
    session.startTransaction()
    await user.save({ session })
    await friend.save({ session })
    await session.commitTransaction()
  } catch (e) {
    const err = new HttpError(
      'Something went wrong, could not delete friend!',
      500
    )
    return next(err)
  }
  res.status(200).json({ message: 'friend deleted' })
}
const getFriends = async (req, res, next) => {
  const userId = req.params.uid
  try {
    user = await User.findOne({ _id: userId }, '-password').populate({
      path: 'friends.user',
      model: User,
    })
  } catch (e) {
    const err = new HttpError('Something went wrong while fetching user!', 500)
    return next(err)
  }
  if (!user) {
    const err = new HttpError('Could not find user!', 404)
    return next(err)
  }
  try {
    const friendsList = user.friends.toObject().map((friend) => {
      return {
        name: friend.user.name,
        email: friend.user.email,
        image: friend.user.image,
        userId: friend.user._id,
      }
    })
    res.status(200).json({
      friendsList,
    })
  } catch (e) {
    const err = new HttpError('Could not get friends!', 404)
    return next(err)
  }
}
exports.addFriendRequest = addFriendRequest
exports.rejectFriendRequest = rejectFriendRequest
exports.getFriendRequests = getFriendRequests
exports.acceptFriendRequest = acceptFriendRequest
exports.deleteFriend = deleteFriend
exports.getFriends = getFriends
exports.cancelFriendRequest = cancelFriendRequest
