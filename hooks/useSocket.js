import { useEffect } from "react";
import io from "socket.io-client";

let socket;

const useSocket = (userId, onMessage, onTyping, onMessageRead) => {
  useEffect(() => {
    socket = io("/", { query: { userId } });

    socket.emit("setOnline", userId);

    socket.on("messageReceived", onMessage);
    socket.on("typing", onTyping);
    socket.on("messageRead", onMessageRead);

    return () => socket.disconnect();
  }, [userId, onMessage, onTyping, onMessageRead]);

  const sendMessage = (chatId, sender, content) => {
    socket.emit("sendMessage", { chatId, sender, content });
  };

  const sendTypingStatus = (chatId, isTyping) => {
    socket.emit("typing", { chatId, isTyping });
  };

  const markMessageAsRead = (chatId) => {
    socket.emit("markAsRead", chatId);
  };

  return { sendMessage, sendTypingStatus, markMessageAsRead };
};

export default useSocket;
