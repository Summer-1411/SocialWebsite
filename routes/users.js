import express from "express";
import { getUser,updateUser,getUserFollows, getUserFollowed, searchUser } from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.get("/follow", getUserFollows)
router.get("/followed", getUserFollowed)
router.get("/search", searchUser)



export default router