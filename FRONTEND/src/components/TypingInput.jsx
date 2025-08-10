import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useParams } from "react-router-dom";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

function TypingInput() {
  const { user } = useAuth();
  const { setNewMessage, newMessage, sendMessage, handleTyping } = useSocket();
  const { chatId } = useParams();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojidata) => {
    setNewMessage((prev) => prev + emojidata.emoji);
  };

  return (
    <div className="flex flex-col relative mb-2">
      <div className="flex mt-4 items-center ">
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
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-xl">
          😊
        </button>
        <button
          onClick={() => sendMessage(chatId, user)}
          className="bg-blue-500 text-white px-4 py-2 rounded-r">
          Send
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
