const express =  require("express");
const { postStory, deleteStory, getStory } = require("../controllers/story.js");

const router = express.Router()

router.get("/", getStory)
router.post("/", postStory)
router.delete("/:id", deleteStory)


module.exports = router