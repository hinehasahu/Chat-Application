import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingChatId, setTypingChatId] = useState(null);
  const token = localStorage.getItem("token");
  let typingTimeout = useRef(null);
  const API = `https://chattr-app.onrender.com`;

  const getChatIdFromURL = () => {
    const pathParts = window.location.pathname.split("/");
    return pathParts.includes("chat") ? pathParts[pathParts.length - 1] : null;
  };
  console.log(getChatIdFromURL());

  useEffect(() => {
    const newSocket = io(API, {
      auth: { token },
    });

    setSocket(newSocket);

    const chatId = getChatIdFromURL();
    newSocket.emit("join-chat", chatId);

    // Online/offline handling
    newSocket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
    newSocket.on("user-online", ({ userId }) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId.toString()])]);
    });
    newSocket.on("user-offline", ({ userId }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    newSocket.on("typing", ({ chatId: incomingChatId }) => {
      const currentChatId = getChatIdFromURL();
      setTypingChatId(incomingChatId);
      
      if (incomingChatId === currentChatId) {
        setIsTyping(true);

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
          setIsTyping(false);
          setTypingChatId(null);
        }, 2000);
      }else{
        setIsTyping(true)
      }
    });

    newSocket.on("stop typing", ({chatId: incomingChatId}) =>{
      const currentChatId = getChatIdFromURL();

      if(incomingChatId !== currentChatId){
        setIsTyping(false);
        setTypingChatId(null)
      }
    })

    // Message handling
    newSocket.on("receive-message", ({ from, message }) => {
      setMessages((prev) => [
        ...prev,
        { sender: { _id: from }, content: message, createdAt: new Date() },
      ]);
    });

    return () => {
      newSocket.disconnect();
      newSocket.off("online-users");
      newSocket.off("user-online");
      newSocket.off("user-offline");
      newSocket.off("typing");
      newSocket.off("stop typing")
      newSocket.off("receive-message");
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [token]);

  const sendMessage = async (chatId, user) => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(
        `${API}/api/chats/send`,
        { chatId, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Emit to Socket.IO
      socket?.emit("send-message", {
        chatId,
        userId: chatUser._id,
        message: newMessage,
      });

      // Append to local UI
      setMessages((prev) => [
        ...prev,
        {
          sender: { _id: user._id },
          content: newMessage,
          createdAt: new Date(),
        },
      ]);

      setNewMessage("");
    } catch (err) {
      console.error("Message send failed:", err.message);
    }
  };

  const handleTyping = (chatId) => {
    if (socket && chatId) {
      socket.emit("typing", { chatId });

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(()=>{
        socket.emit("stop typing", {chatId} )
      }, 2000)
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket,
        onlineUsers,
        messages,
        setMessages,
        newMessage,
        setNewMessage,
        isTyping,
        setIsTyping,
        chatUser,
        setChatUser,
        sendMessage,
        handleTyping,
        typingChatId,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
