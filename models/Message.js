import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true }, // A unique identifier for the chat between two users
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "messages" }
);

export default mongoose.models.Message || mongoose.model("Message", messageSchema);
