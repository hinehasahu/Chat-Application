import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createChat,
  getUserMessages,
  myChats,
  sendMessage,
  getAllChats
} from "../controllers/chatController.js";

export const ChatRouter = express.Router();

ChatRouter.post("/create", authMiddleware, createChat);

ChatRouter.get("/mychats", authMiddleware, myChats);

ChatRouter.post("/send", authMiddleware, sendMessage);

ChatRouter.get("/:chatId/messages", authMiddleware, getUserMessages);

ChatRouter.get("/:chatId/getAllChats", authMiddleware, getAllChats)