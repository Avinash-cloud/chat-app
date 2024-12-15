import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

let socket;

export default function Chat({ userId, name }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const formatWhatsAppStyleTime = (isoDate) => {
     
    try{
      const date = new Date(isoDate); 
      return format(date, "h:mm a");
    }  
    catch(error){
      console.log('error');

    }
      
    
  };

  // Helper function to group messages by date
  const groupMessagesByDate = (messages) => {
    try {
      return messages.reduce((groups, message) => {
        try {
          // Safely parse and format the timestamp
          const messageDate = format(new Date(message.timestamp), "yyyy-MM-dd");
          
          // Initialize the date group if not present
          if (!groups[messageDate]) {
            groups[messageDate] = [];
          }
          
          // Add the message to the appropriate group
          groups[messageDate].push(message);
        } catch (innerError) {
          console.error("Error processing message:", message, innerError);
        }
        
        return groups;
      }, {});
    } catch (error) {
      console.error("Error grouping messages by date:", error);
      return {}; // Return an empty object in case of failure
    }
  };



  const groupedMessages = groupMessagesByDate(messages);


  useEffect(() => {
    // Connect to Socket.io server
    socket = io("/", { path: "/api/socket", query: { userId, name } });


    // console.log(socket);
    socket.on("onlineUsers", (users) => {
      console.log('user are', { users });
      setOnlineUsers(users.filter((id) => id.id !== userId));
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

  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      // Check if the new message is relevant to the selected user (either sender or recipient)
      if (newMessage.sender === selectedUser || newMessage.recipient === selectedUser) {
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the new message to the chat
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedUser]);


  // const handleSendMessage = () => {
  //   if (selectedUser && message.trim()) {
  //     const chatId = [userId, selectedUser].sort().join("_"); // Unique chat ID for users
  //     const newMessage = { sender: userId, content: message };

  //     setMessages((prev) => [...prev, newMessage]);

  //     socket.emit("sendMessage", {
  //       chatId,
  //       senderId: userId,
  //       recipientId: selectedUser,
  //       content: message,
  //     });

  //     setMessage("");
  //   }
  // };


  const handleSendMessage = () => {
    if (selectedUser && message.trim()) {
      const chatId = [userId, selectedUser].sort().join("_"); // Unique chat ID for users
      const newMessage = { sender: userId, content: message };

      // Optimistically update the UI for the sender
      setMessages((prev) => [...prev, newMessage]);

      // Emit the message to the server
      socket.emit("sendMessage", {
        chatId,
        senderId: userId,
        recipientId: selectedUser,
        content: message,
      });

      setMessage(""); // Clear the input field
    }
  };

  const handleTyping = (typing) => {
    socket.emit("typing", { recipientId: selectedUser, senderId: userId, isTyping: typing });
  };

  console.log('messages', messages)

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex">
      {/* Online Users List */}
      <div className="w-1/4 border-r p-4">
        <h2 className="text-lg font-bold">Online Users</h2>
        <ul>
          {onlineUsers.map((user, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 ${user === selectedUser ? "bg-blue-200" : ""}`}
              onClick={() => setSelectedUser(user.id)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="w-3/4 p-4">
        {selectedUser ? (
          <>
            <div className="h-96 border p-4 overflow-y-auto">
              <div className="w-full my-2 flex flex-col">
                <div className="chat-container">
                  {Object.keys(groupedMessages).map((date, index) => (
                    <div key={index}>
                      {/* Date separator */}
                      <div className="date-separator flex flex-col text-center text-gray-500 my-2">
                        {isToday(new Date(date))
                          ? "Today"
                          : isYesterday(new Date(date))
                            ? "Yesterday"
                            : format(new Date(date), "dd/MM/yy")}
                      </div>

                      {/* Messages for this date */}
                      <div className="w-full my-2 flex flex-col">
                        {groupedMessages[date].map((msg, idx) => (
                          <div
                            key={msg._id || idx}
                            className={`p-2 my-1 rounded max-w-xs ${msg.sender === userId
                              ? "bg-blue-500 text-white self-end mr-2"
                              : "bg-gray-200 text-black self-start ml-2"
                              }`}
                            style={{
                              display: "inline-block",
                              wordBreak: "break-word",
                            }}
                          >
                            {msg.content}
                            <span className="time block text-xs text-gray-400 mt-1">
                              {formatWhatsAppStyleTime(msg?.timestamp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add a line between messages */}
                {messages.length > 1 && (
                  <div className="border-b border-gray-300 w-full my-2"></div>
                )}
              </div>
              {isTyping && <div className="text-gray-500 italic">Typing...</div>}
              <div ref={messagesEndRef} />
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent a new line from being added
                    handleSendMessage(); // Call the send message function
                  }
                }}
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
