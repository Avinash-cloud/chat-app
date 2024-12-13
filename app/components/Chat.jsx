import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Chat({ userId ,name}) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Connect to Socket.io server
    socket = io("/", { path: "/api/socket", query: { userId,name } });

    
    // console.log(socket);
    socket.on("onlineUsers", (users) => {
      // console.log('user are',{users});
      setOnlineUsers(users.filter((id) => id !== userId));
    });

    socket.on("newMessage", (data) => {
      if (data.senderId === selectedUser) {
        setMessages((prev) => [...prev, { sender: data.senderId, content: data.content }]);
      }
    });

    socket.on("typing", ({ senderId, isTyping }) => {
      if (senderId === selectedUser) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const chatId = [userId, selectedUser].sort().join("_"); // Unique chat ID for users
      socket.emit("getMessages", { chatId });
  
      socket.on("loadMessages", (messages) => {
        setMessages(messages);
      });
  
      return () => {
        socket.off("loadMessages");
      };
    }
  }, [selectedUser]);
  

  const handleSendMessage = () => {
    if (selectedUser && message.trim()) {
      const chatId = [userId, selectedUser].sort().join("_"); // Unique chat ID for users
      const newMessage = { sender: userId, content: message };
  
      setMessages((prev) => [...prev, newMessage]);
  
      socket.emit("sendMessage", {
        chatId,
        senderId: userId,
        recipientId: selectedUser,
        content: message,
      });
  
      setMessage("");
    }
  };
  
  const handleTyping = (typing) => {
    socket.emit("typing", { recipientId: selectedUser, senderId: userId, isTyping: typing });
  };

  console.log(onlineUsers)

  return (
    <div className="flex">
      {/* Online Users List */}
      <div className="w-1/4 border-r p-4">
        <h2 className="text-lg font-bold">Online Users</h2>
        <ul>
          {onlineUsers.map((user) => (
            <li
              key={user}
              className={`cursor-pointer p-2 ${user === selectedUser ? "bg-blue-200" : ""}`}
              onClick={() => setSelectedUser(user)}
            >
              {user}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="w-3/4 p-4">
        {selectedUser ? (
          <>
            <div className="h-96 border p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-2 rounded ${msg.sender === userId ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {msg.content}
                </div>
              ))}
              {isTyping && <div className="text-gray-500 italic">Typing...</div>}
            </div>

            <div className="mt-4 flex">
              <input
                type="text"
                className="flex-1 border p-2"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => handleTyping(true)}
                onBlur={() => handleTyping(false)}
              />
              <button className="bg-blue-500 text-white px-4 py-2" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Select a user to chat with.</p>
        )}
      </div>
    </div>
  );
}
