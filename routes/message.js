const express  =require("express");
const { getMessage, sendMessage, deleteMessage, getMessageById } = require("../controllers/message.js");

const router = express.Router();

router.get("/chat/:chatId", getMessage);
router.get("/:id", getMessageById);
router.post("/", sendMessage);
router.delete("/:id", deleteMessage);



module.exports = router