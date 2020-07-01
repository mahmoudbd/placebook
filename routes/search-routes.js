const express = require("express");

const searchController = require("../controllers/search-controllers");

const router = express.Router();

router.get("/search", searchController.searchUsersPlaces);

module.exports = router;
