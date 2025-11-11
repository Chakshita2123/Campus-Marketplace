const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

// 🔹 Get all chats for a specific user
router.get("/:email", async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.email }).sort({ lastUpdated: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching chats" });
  }
});

// 🔹 Create or get existing chat between two users
router.post("/start", async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    if (!user1 || !user2) return res.status(400).json({ error: "Missing participants" });

    let chat = await Chat.findOne({ participants: { $all: [user1, user2] } });
    if (!chat) {
      chat = new Chat({ participants: [user1, user2], messages: [] });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error starting chat" });
  }
});

// 🔹 Send message
router.post("/send", async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    if (!sender || !receiver || !text) return res.status(400).json({ error: "Missing fields" });

    let chat = await Chat.findOne({ participants: { $all: [sender, receiver] } });
    if (!chat) {
      chat = new Chat({ participants: [sender, receiver], messages: [] });
    }

    const message = { sender, text, read: false, time: new Date() };
    chat.messages.push(message);
    chat.lastUpdated = Date.now();
    await chat.save();

    res.json({ ok: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error sending message" });
  }
});

// 🔹 Get unread counts for a user
router.get("/unread/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const chats = await Chat.find({ participants: email });

    let totalUnread = 0;
    const perChat = [];

    chats.forEach(chat => {
      const other = chat.participants.find(p => p !== email);
      const unread = chat.messages.filter(m => m.sender !== email && !m.read).length;
      totalUnread += unread;
      perChat.push({ otherUser: other, unreadCount: unread });
    });

    res.json({ totalUnread, perChat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching unread counts" });
  }
});

// 🔹 Mark messages as read between two users
router.post("/mark-read", async (req, res) => {
  try {
    const { user, other } = req.body;
    if (!user || !other) return res.status(400).json({ error: "Missing fields" });

    const chat = await Chat.findOne({ participants: { $all: [user, other] } });
    if (!chat) return res.json({ ok: true, updated: 0 });

    let updated = 0;
    chat.messages.forEach(m => {
      if (m.sender !== user && !m.read) {
        m.read = true;
        updated++;
      }
    });

    chat.lastUpdated = Date.now();
    await chat.save();

    res.json({ ok: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error marking messages read" });
  }
});

module.exports = router;
