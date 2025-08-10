import { useEffect, useState, useRef, useContext } from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import TypingInput from "../components/TypingInput";

const API = "https://chattr-app.onrender.com";

const ChatWindow = () => {
  const { chatId } = useParams();
  const { token, user } = useAuth();
  const {
    onlineUsers,
    chatUser,
    messages,
    isTyping,
    setMessages,
    setChatUser,
  } = useSocket();
  const messagesEndRef = useRef();
  const { typingChatId } = useSocket();
  console.log("Typing Chat Id", typingChatId);

  console.log("isTyping inside", isTyping);
  console.log("User inside window", user);
  console.log("ChatUser: ", chatUser);

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/api/chats/${chatId}/getAllChats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.allChats || []);
      console.log("Messages fetched:", res.data.allChats);
      console.log("ChatUserRes: ", res.data.otherUser);
      setChatUser(res.data.otherUser);
    } catch (err) {
      console.error("Error loading messages:", err.message);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log();
  return (
    <div className="min-h-screen sm:w-full md:w-1/3 lg:w-2/3 flex-1 flex flex-col bg-gray-100">
      <header className="fixed shadow-md top-0 w-full bg-fuchsia-700 h-12 text-lime-100 font-bold flex items-center">
        <div className="bg-fuchsia-800 w-1/2 flex">
          <div className="ml-2">
            <Link to="/dashboard" className=" text-blue-600 hover:text-blue-800">
              <IoArrowBack className="text-2xl" />
            </Link>
          </div>
          <h2 className="text-lg ml-2 font-semibold  text-white">
            {chatUser?.name || "User"}{" "}
            <span
              className={`text-xs ml-2 font-semibold ${
                onlineUsers.includes(user?._id)
                  ? "text-green-500"
                  : "text-gray-400"
              }`}>
              ● {onlineUsers.includes(user?._id) ? "Online" : "Offline"}
            </span>
          </h2>
        </div>
        <div className="bg-fuchsia-800 w-1/2 text-right">
          <button className=" mr-2 btn">Logout</button>
        </div>
      </header>

      <div className="flex-1 mt-12 overflow-y-auto bg-white p-2 rounded shadow">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded break-words max-w-md ${
              msg.sender._id === user?._id
                ? "bg-blue-100 self-end ml-auto"
                : "bg-gray-200 self-start mr-auto"
            }`}>
            <p className="text-sm">{msg.content}</p>
            <span className="text-xs block text-gray-500 mt-1 text-right">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
        {isTyping && (
          <div className="text-sm italic text-gray-500 mt-1">Typing...</div>
        )}
      </div>
      <TypingInput />
      {/* <div className="flex mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping(chatId);
          }}
          placeholder="Type your message..."
          className="flex-1 border p-2 rounded-l"
        />
        <button
          onClick={() => sendMessage(chatId, user)}
          className="bg-blue-500 text-white px-4 py-2 rounded-r">
          Send
        </button>
      </div> */}
    </div>
  );
};

export default ChatWindow;
