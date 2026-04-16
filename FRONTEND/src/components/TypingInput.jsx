import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useParams } from "react-router-dom";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { IoSend } from "react-icons/io5";

function TypingInput() {
  const { user } = useAuth();
  const { setNewMessage, newMessage, sendMessage, handleTyping } = useSocket();
  const { chatId } = useParams();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojidata) => {
    setNewMessage((prev) => prev + emojidata.emoji);
  };

  return (
    <div className="sticky bottom-0 bg-white p-2 border-t z-20">
      <div className="flex items-center ">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping(chatId);
          }}
          placeholder="Type your message..."
          className="input flex-1 border p-2 rounded-l"
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-xl">
          😊
        </button>
        <button
          onClick={() => sendMessage(chatId, user)}
          className="sendbtn text-white px-4 py-2 rounded-r">
          <IoSend />
        </button>
      </div>
      
      {showEmojiPicker && (
        <div className="absolute bottom-12 left-0 z-10 ">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}

export default TypingInput;
