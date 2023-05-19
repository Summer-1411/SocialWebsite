import express from "express";
import { getAllChats,findChat, createChat,updateStatusChat,checkChatNoMessage, getMemberChat, updateLastMessage } from "../controllers/chats.js";

const router = express.Router();

router.get("/", getAllChats);
router.get("/find", findChat);
router.get("/member/:id", getMemberChat);
router.get("/checkChat/:id", checkChatNoMessage);
router.put("/update/:id", updateStatusChat);
router.put("/updateLastMessage/:id", updateLastMessage);
router.post("/create", createChat);


export default router