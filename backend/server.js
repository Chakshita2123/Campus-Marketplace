// ✅ Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
const orderRoutes = require("./routes/orders");
const pickupRoutes = require("./routes/pickups"); // ✅ Fixed import style

require("dotenv").config();

// Initialize app & server
const app = express();
const server = http.createServer(app);

// ⚡ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// 🧩 Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 🧠 Session Setup
app.use(
  session({
    secret: process.env.JWT_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
  })
);

// 🪪 Passport Config
app.use(passport.initialize());
app.use(passport.session());
require("./passport");

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ Import Models
const Chat = require("./models/Chat");

// ✅ Routes
app.use("/api/auth", require("./routes/auth")); // Email/password auth
app.use("/auth", require("./routes/authRoutes")); // Google OAuth
app.use("/api/products", require("./routes/products")); // Products
app.use("/api/chats", require("./routes/chatRoutes")); // Chats
app.use("/api/wishlist", require("./routes/wishlistRoutes")); // Wishlist
app.use("/api/orders", orderRoutes);
app.use("/api/pickups", pickupRoutes); // ✅ New Pickups API integrated

// ✅ REST Endpoint to Fetch Chat History Between Two Users
app.get("/api/chats/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const chat = await Chat.findOne({ participants: { $all: [user1, user2] } });
    res.json(chat || { messages: [] });
  } catch (err) {
    console.error("❌ Error fetching chat messages:", err);
    res.status(500).json({ error: "Failed to load chat history" });
  }
});

// ✅ SOCKET.IO: Real-Time Chat + Online/Offline + Unread Count System
const onlineUsers = new Map(); // email -> socket.id

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 🟩 User joins their personal notification room
  socket.on("joinUser", async (email) => {
    if (!email) return;
    onlineUsers.set(email, socket.id);
    socket.join(email);
    console.log(`✅ ${email} joined their personal room`);

    // Notify others this user is online
    io.emit("userStatusUpdate", { email, status: "online" });

    // Send initial unread count
    try {
      const chats = await Chat.find({ participants: email });
      let totalUnread = 0;
      chats.forEach((chat) => {
        totalUnread += chat.messages.filter(
          (m) => m.sender !== email && !m.read
        ).length;
      });
      io.to(email).emit("unreadCount", { total: totalUnread });
    } catch (err) {
      console.error("❌ Error computing initial unread count:", err);
    }
  });

  // 💬 Join specific chat room
  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log(`💬 ${socket.id} joined chat room: ${room}`);
  });

  // ✉️ Handle sending new messages
  socket.on("sendMessage", async (data) => {
    try {
      const { room, sender, receiver, text } = data;
      if (!sender || !receiver || !text) return;

      // Save message with read = false
      const chat = await Chat.findOneAndUpdate(
        { participants: { $all: [sender, receiver] } },
        {
          $push: { messages: { sender, text, read: false } },
          lastUpdated: Date.now(),
        },
        { new: true, upsert: true }
      );

      // Emit to chat room (both users)
      io.to(room).emit("receiveMessage", {
        sender,
        receiver,
        text,
        time: new Date(),
      });

      // Update chat list for both
      io.to(sender).emit("chatListUpdated");
      io.to(receiver).emit("chatListUpdated");

      // Calculate unread count for receiver
      const unreadForReceiver = chat.messages.filter(
        (m) => m.sender !== receiver && !m.read
      ).length;
      io.to(receiver).emit("unreadCount", { total: unreadForReceiver });
    } catch (err) {
      console.error("❌ Error saving or emitting message:", err);
    }
  });

  // 🟦 Mark messages as read
  socket.on("markAsRead", async ({ user1, user2 }) => {
    try {
      await Chat.updateMany(
        { participants: { $all: [user1, user2] } },
        { $set: { "messages.$[elem].read": true } },
        { arrayFilters: [{ "elem.sender": user2, "elem.read": false }] }
      );

      const chats = await Chat.find({ participants: user1 });
      let totalUnread = 0;
      chats.forEach((chat) => {
        totalUnread += chat.messages.filter(
          (m) => m.sender !== user1 && !m.read
        ).length;
      });

      io.to(user1).emit("unreadCount", { total: totalUnread });
    } catch (err) {
      console.error("❌ Error marking messages as read:", err);
    }
  });

  // 🔴 User disconnects → mark offline
  socket.on("disconnect", () => {
    for (const [email, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(email);
        console.log(`🔴 ${email} went offline`);
        io.emit("userStatusUpdate", { email, status: "offline" });
        break;
      }
    }
  });
});

// Default route
app.get("/", (req, res) => res.send("Campus Marketplace Backend Running ✅"));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
