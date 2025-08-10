import express from "express";
import multer from "multer";
import path from "path";
import MessageModel from "../models/messageModel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const MediaRouter = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "audio/mpeg", "audio/wav", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Upload media (image, video, audio, document)
MediaRouter.post("/upload", authMiddleware, upload.single("media"), async (req, res) => {
  try {
    const { chatId } = req.body;
    const mediaType = req.file.mimetype.split("/")[0];

    const message = await MessageModel.create({
      sender: req.user.userId,
      media: `/uploads/${req.file.filename}`,
      mediaType,
      chat: chatId,
    });

    // Emit event via Socket.IO (optional)
    req.app.get("io").to(chatId).emit("new-message", message);

    res.status(200).json({ message: "Media uploaded", data: message });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

export default router;
