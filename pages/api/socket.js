import { Server } from "socket.io";
import connectMongo from "@/lib/mongo";
import Message from "@/models/Message";

const ioHandler = async (req, res) => {
  if (!res.socket.server.io) {
    console.log("Starting Socket.io server...");
    await connectMongo();

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    let onlineUsers = {}; // { userId: socketId }
    let userNames = {}; // { userId: userName }

    io.on("connection", (socket) => {
      
      const userId = socket.handshake.query.userId;
      const userName = socket.handshake.query.name;
      onlineUsers[userId] = socket.id;
      userNames[userId] = userName;

      // Notify all clients about the updated user list
      io.emit(
        "onlineUsers",
        Object.entries(onlineUsers).map(([id, _]) => ({
          id,
          name: userNames[id],
        }))
      );

      // Retrieve previous messages for the selected chat
      socket.on("getMessages", async ({ chatId }) => {
        const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
        socket.emit("loadMessages", messages);
      });

      // Handle messages
      socket.on("sendMessage", async (data) => {
        const { chatId, senderId, recipientId, content } = data;

        const newMessage = await Message.create({
          chatId,
          sender: senderId,
          recipient: recipientId,
          content,
        });

        const recipientSocket = onlineUsers[recipientId];
        if (recipientSocket) {
          io.to(recipientSocket).emit("newMessage", newMessage);
        }

        io.to(senderId).emit("newMessage", newMessage);
      });

      // Typing indicator
      socket.on("typing", ({ recipientId, senderId, isTyping }) => {
        const recipientSocket = onlineUsers[recipientId];
        if (recipientSocket) {
          io.to(recipientSocket).emit("typing", { senderId, isTyping });
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        delete onlineUsers[userId];
        delete userNames[userId];
        io.emit(
          "onlineUsers",
          Object.entries(onlineUsers).map(([id, _]) => ({
            id,
            name: userNames[id],
          }))
        );
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;