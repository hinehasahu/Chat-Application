import express from "express";
import dotenv from "dotenv";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { ConnectMongo } from "./configs/MongoConfig.js";
import cors from "cors";
import { UserRouter } from "./routes/userRouter.js";
import { ChatRouter } from "./routes/chatRouter.js";

dotenv.config();
ConnectMongo();

const app = express();
export const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

// Middleware to verify JWT from socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    console.log("Socket authentication failed.");
    next(new Error("Authentication error"));
  }
});

// Socket.IO events
io.on("connection", (socket) => {
  const userId = socket.user.userId;
  onlineUsers.set(userId, socket.id);
  socket.broadcast.emit("user-online", { userId });
  socket.emit("online-users", Array.from(onlineUsers.keys()));
  console.log(`🔌 User connected: ${userId}`);

  socket.on("typing", ({ chatId }) => {
    socket.to(chatId).emit("typing", { chatId });
  });

  socket.on("stop typing", ({ chatId }) => {
    socket.to(chatId).emit("stop typing", { chatId });
  });

  // Private Message
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("send-message", ({ userId, message, chatId }) => {
    const toSocketId = onlineUsers.get(userId);
    if (toSocketId) {
      io.to(toSocketId).emit("receive-message", {
        from: socket.user._id,
        message,
      });
    }
  });

  // Group: Join room
  socket.on("join-group", (groupId) => {
    socket.join(groupId);
    console.log(`${userId} joined group ${groupId}`);
  });

  // Group: Send message
  socket.on("send-group-message", ({ groupId, message }) => {
    io.to(groupId).emit("receive-group-message", {
      from: userId,
      message,
    });
  });

  // On disconnect
  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    socket.broadcast.emit("user-offline", { userId });
    console.log(`❌ User disconnected: ${userId}`);
  });
});

app.use("/api/users", UserRouter);
app.use("/api/chats", ChatRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
