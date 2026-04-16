import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required:true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true },
  content: String,
  media:{type:String},
  mediaType:{type:String, enum:["image","video","audio","document"]},
  createdAt: { type: Date, default: Date.now() },
});

export const MessageModel = mongoose.model("Message", messageSchema);
