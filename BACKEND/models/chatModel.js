import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  name: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
});

export const ChatModel = mongoose.model("Chat", chatSchema);
