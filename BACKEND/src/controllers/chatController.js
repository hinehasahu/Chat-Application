import { ChatModel } from "../models/chatModel.js";
import { MessageModel } from "../models/messageModel.js";
import { UserModel } from "../models/userModel.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { users, isGroupChat, name } = req.body;

    if (
      !Array.isArray(users) ||
      users.length !== 1 ||
      users[0].toString() === userId.toString()
    ) {
      return res.status(400).json({ message: "Invalid user to chat with." });
    }

    const otherUserId = users.find((id) => id.toString() !== userId.toString());

    if (!otherUserId) {
      return res
        .status(400)
        .json({ message: "You cannot chat with yourself." });
    }

    // console.log("Received in createChat:", {
    //   userId,
    //   users,
    //   isGroupChat,
    //   name,
    // });

    if (!isGroupChat) {
      if (users.length !== 1) {
        return res.status(400).json({
          message: "One-on-one chat must have exactly one other user.",
        });
      }

      let existingChat = await ChatModel.findOne({
        isGroupChat: false,
        users: { $all: [userId, otherUserId], $size: 2 },
      })
        .populate("users", "-password")
        .populate("latestMessage");

      if (existingChat) {
        return res.status(200).json({ Chat: existingChat });
      }
    }

    // Validate that all user IDs exist
    const allUserIds = [...users, userId];
    const usersExist = await UserModel.find({ _id: { $in: allUserIds } });
    if (usersExist.length !== allUserIds.length) {
      return res
        .status(400)
        .json({ message: "One or more user IDs are invalid." });
    }

    const chat = await ChatModel.create({
      users: [userId, otherUserId],
      isGroupChat: isGroupChat || false,
      name: name || null,
    });

    const fullChat = await ChatModel.findById(chat._id)
      .populate("users", "-password")
      .populate("latestMessage");

    res.json({ Chat: fullChat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", Error: error.message });
    console.log(error);
  }
};

export const myChats = async (req, res) => {
  try {
    const { userId } = req.user;
    const chats = await ChatModel.find({ users: userId })
      .populate("users", "_id name email")
      .populate("latestMessage")
      .sort({ updateAt: -1 });
    res.json({ Chats: chats });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", Error: error.message });
    console.log(error);
  }
};

export const getAllChats = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.user;

    const chat = await ChatModel.findById(chatId).populate(
      "users",
      "-password"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }
    
    const otherUser = chat.users.find(
      (user) => user._id.toString() !== userId.toString()
    );
    if (!otherUser) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this chat." });
    }

    const chats = await MessageModel.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email _id");

    const chatsDetails = await ChatModel.find({ users: userId })
      .populate("users", "_id name email")
      .populate("latestMessage")
      .sort({ updateAt: -1 });

    res
      .status(200)
      .json({ message: "All chats of chatId.", otherUser , chatsDetails, allChats: chats });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
    console.log(error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.user;
    const { content, chatId } = req.body;
    const message = await MessageModel.create({
      chatId,
      sender: userId,
      content,
    });
    await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });
    res.json({ Message: message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", Error: error.message });
    console.log(error);
  }
};

export const getUserMessages = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { chatId } = req.params;
    const currentUserId = req.user.userId;

    const chat = await ChatModel.findById(chatId).populate(
      "users",
      "-password"
    );
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const messages = await MessageModel.find({ chat: chatId }).populate(
      "sender",
      "name _id email"
    );

    // Find the other user to show in frontend
    const otherUser = chat.users.find(
      (u) => u._id.toString() !== currentUserId.toString()
    );

    return res.json({ messages, chatUser: otherUser });
  } catch (error) {
    console.error("Error fetching chat messages:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
