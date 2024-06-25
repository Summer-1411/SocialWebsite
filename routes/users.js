const express = require("express");
const { getUser,updateUser,getUserFollows, getUserFollowed, searchUser } = require("../controllers/user.js");

const router = express.Router()

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.get("/follow", getUserFollows)
router.get("/followed", getUserFollowed)
router.get("/search", searchUser)



module.exports =  router