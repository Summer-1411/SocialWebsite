import express from "express";
import { postStory, deleteStory, getStory } from "../controllers/story.js";

const router = express.Router()

router.get("/", getStory)
router.post("/", postStory)
router.delete("/:id", deleteStory)


export default router