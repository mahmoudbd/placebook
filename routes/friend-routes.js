const express = require("express");
const { check } = require("express-validator");

const friendsControllers = require("../controllers/friend-controllers");

const router = express.Router();

router.patch(
  "/requests/accept",
  [check("userId").not().isEmpty(), check("friendId").not().isEmpty()],
  friendsControllers.acceptFriendRequest
);

router.get("/requests/:uid", friendsControllers.getFriendRequests);
router.get("/:uid", friendsControllers.getFriends);

router.patch(
  "/",
  [check("userId").not().isEmpty(), check("friendId").not().isEmpty()],
  friendsControllers.addFriendRequest
);

router.delete(
  "/requests/reject",
  [check("userId").not().isEmpty(), check("friendId").not().isEmpty()],
  friendsControllers.rejectFriendRequest
);
router.delete(
  "/requests/cancel",
  [check("userId").not().isEmpty(), check("friendId").not().isEmpty()],
  friendsControllers.cancelFriendRequest
);
router.delete(
  "/delete",
  [check("userId").not().isEmpty(), check("friendId").not().isEmpty()],
  friendsControllers.deleteFriend
);

module.exports = router;
