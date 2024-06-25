const express  =require("express");
const {
    getComments,
    addComment,
    deleteComment
} = require("../controllers/comment.js");

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);
router.delete("/:id", deleteComment);

module.exports = router