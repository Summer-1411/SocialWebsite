import express from "express";
import { getMessage, sendMessage, deleteMessage, getMessageById } from "../controllers/message.js";

const router = express.Router();

router.get("/chat/:chatId", getMessage);
router.get("/:id", getMessageById);
router.post("/", sendMessage);
router.delete("/:id", deleteMessage);



export default router