// models/Chat.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // email or user id
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
  read: { type: Boolean, default: false } // <-- added
});

const ChatSchema = new mongoose.Schema(
  {
    participants: [{ type: String, required: true }], // e.g. [buyerEmail, sellerEmail]
    messages: [MessageSchema],
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
  