import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const API = "https://chat-application-mvvh.onrender.com";

const ChatPage = () => {
  const { onlineUsers, typingChatId } = useSocket();
  const { token, user, setUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState("chats");
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  console.log("User chatPage: ", user);
  console.log("AllUsers: ", allUsers);
  console.log("Chats: ", chats);
  console.log("ActiveTab: ", activeTab);
  console.log("Notifications: ", notifications);
  console.log("TypingChatId", typingChatId);

  // Decode JWT to get user
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);
      setUser({ _id: decoded?.userId });
    }
  }, [token, setUser]);

  // Fetch chats
  const fetchMyChats = async () => {
    try {
      const res = await axios.get(`${API}/api/chats/mychats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("ResDataChats: ", res.data);
      setChats(res.data.Chats || []);
    } catch (err) {
      console.error("Error fetching chats:", err.message);
    }
  };

  // Fetch all users (except me)
  const fetchAllUsers = async () => {
    if (!token || !user) return;
    try {
      const res = await axios.get(
        `${API}/api/users/search?name=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("Response: ", res.data);
      const filtered = res.data.Users.filter((u) => u._id !== user?._id);
      setAllUsers(filtered);
    } catch (err) {
      console.error("Error searching users:", err.message);
    }
  };

  // Debounced search input
  const debouncedSearch = useCallback(
    debounce((query) => setSearchTerm(query), 500),
    [],
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchAllUsers();
    }
  }, [searchTerm, activeTab]);

  useEffect(() => {
    if (activeTab === "chats") {
      fetchMyChats();
    }
  }, [activeTab]);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const startChat = async (otherUserId) => {
    if (!user) return;
    console.log("OtherUserId: ", otherUserId);

    if (otherUserId === user._id) {
      alert("You cannot chat with yourself.");
      return;
    }

    // Check if chat already exists
    const existingChat = chats.find(
      (chat) =>
        !chat.isGroupChat && chat.users.some((u) => u._id === otherUserId),
    );
    if (existingChat) {
      console.log("Existing chat found:", existingChat);
      navigate(`/chat/${existingChat._id}`);
      return;
    }

    // If not found, create a new chat
    try {
      const res = await axios.post(
        `${API}/api/chats/create`,
        { users: [otherUserId], isGroupChat: false },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const newChat = res.data.Chat;
      console.log("NewChat: ", newChat);

      // Add the new chat to the state
      setChats((prev) => [...prev, newChat]);

      // Navigate to the new chat
      navigate(`/chat/${newChat._id}`);
    } catch (err) {
      console.error("Error starting chat:", err.message);
    }
  };

  console.log("Online Users inside chatPage: ", onlineUsers);
  return (
    <div className="min-h-screen w-full md:w-1/2 lg:w-1/3 items-start  p-2 bg-gray-100 text-gray-900">
      <input
        type="text"
        placeholder="Search users..."
        onChange={handleSearchChange}
        className="input flex border p-2 rounded w-full"
      />
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-4">
          {notifications.map((msg, i) => (
            <div
              key={i}
              className="bg-yellow-100 text-yellow-700 p-2 rounded mb-1">
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* Tabs + Search */}
      <div className="flex items-center h-12 mb-4 border-b border-b-fuchsia-800 mt-2">
        <button
          className={`px-4 py-2 rounded w-1/2 transition duration-300 ease-in-out ${
            activeTab === "chats" ? "active text-white" : "nonactive text-black"
          }`}
          onClick={() => setActiveTab("chats")}>
          Chats
        </button>
        <button
          className={`px-4 py-2 rounded w-1/2 transition duration-300 ease-in-out ${
            activeTab === "users" ? "active text-white" : "nonactive text-black"
          }`}
          onClick={() => setActiveTab("users")}>
          Users
        </button>
      </div>

      {/* Render My Chats or All Users */}
      <div className="grid gap-4">
        {activeTab === "chats" &&
          chats.map((chat) => {
            console.log("Chat: ", chat);
            const chatPartner = chat.users.find((u) => u._id !== user?._id);
            console.log("ChatPartner: ", chatPartner);
            return (
              <button
                key={chat._id}
                onClick={() => navigate(`/chat/${chat._id}`)}
                className="p-4 cursor-pointer  w-full text-left bg-white  rounded shadow hover:bg-gray-50">
                <p className="font-medium">
                  {chatPartner?.name}{" "}
                  <span
                    className={`text-xs ${
                      onlineUsers.includes(chatPartner._id)
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}>
                    ●
                    {onlineUsers.includes(chatPartner._id)
                      ? "Online"
                      : "Offline"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  {/* {typingChatId === chat._id? ( <span className="italic text-purple-500" >Typing...</span> ) : chat.latestMessage?.content || "No messages yet"} */}
                  {typingChatId[chat._id] ? (
                    <apna className="text-sm text-grey-500">Typing...</apna>
                  ) : (
                    chat.latestMessage?.content || "No messages yet"
                  )}
                </p>
              </button>
            );
          })}

        {activeTab === "users" &&
          allUsers.map((u) => (
            // console.log("u: ", u._id)
            <div
              key={u._id}
              className="bg-white p-3 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {u.name}{" "}
                  <span
                    className={`text-xs ${
                      onlineUsers.includes(u?._id)
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}>
                    ● {onlineUsers.includes(u?._id) ? "Online" : "Offline"}
                  </span>
                </p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <button
                onClick={() => startChat(u._id)}
                className="bg-green-500 text-white px-4 py-1 rounded">
                Chat
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatPage;
