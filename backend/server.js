const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Initialize app & server
const app = express();
const server = http.createServer(app);

// 🧠 Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Session setup
app.use(
  session({
    secret: process.env.JWT_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
require('./passport');

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// ✅ Import Models
const Chat = require('./models/Chat');

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/products'));
app.use('/api/chats', require('./routes/chatRoutes')); // ✅ Your updated chat route file
app.use('/api/wishlist', require('./routes/wishlistRoutes'));


// ✅ REST Endpoint to fetch chat history between two users
app.get('/api/chats/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const chat = await Chat.findOne({ participants: { $all: [user1, user2] } });
    res.json(chat || { messages: [] });
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
});

// ✅ SOCKET.IO: Real-time Chat + Online/Offline + Unread Counts
const onlineUsers = new Map(); // email -> socket.id

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // 🟩 Join user's personal room (for notifications/unread updates)
  socket.on('joinUser', async (email) => {
    if (!email) return;
    onlineUsers.set(email, socket.id);
    socket.join(email);
    console.log(`✅ ${email} joined personal room`);

    // Notify others the user is online
    io.emit('userStatusUpdate', { email, status: 'online' });

    // Send initial unread count
    try {
      const chats = await Chat.find({ participants: email });
      let totalUnread = 0;
      chats.forEach(chat => {
        totalUnread += chat.messages.filter(m => m.sender !== email && !m.read).length;
      });
      io.to(email).emit('unreadCount', { total: totalUnread });
    } catch (err) {
      console.error('❌ Error sending initial unread count:', err);
    }
  });

  // 💬 Join specific chat room
  socket.on('joinChat', (room) => {
    socket.join(room);
    console.log(`💬 ${socket.id} joined chat room: ${room}`);
  });

  // ✉️ Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { room, sender, receiver, text } = data;

      // Save message in DB with read=false
      const chat = await Chat.findOneAndUpdate(
        { participants: { $all: [sender, receiver] } },
        { $push: { messages: { sender, text, read: false } }, lastUpdated: Date.now() },
        { new: true, upsert: true }
      );

      // Emit real-time message to chat room
      io.to(room).emit('receiveMessage', {
        sender,
        receiver,
        text,
        time: new Date(),
      });

      // Refresh chat list for both users
      io.to(sender).emit('chatListUpdated');
      io.to(receiver).emit('chatListUpdated');

      // Update unread count for receiver
      const unreadForReceiver = chat.messages.filter(m => m.sender !== receiver && !m.read).length;
      io.to(receiver).emit('unreadCount', { total: unreadForReceiver });

    } catch (err) {
      console.error('❌ Error saving message:', err);
    }
  });

  // 🔴 Handle disconnect (user goes offline)
  socket.on('disconnect', () => {
    for (const [email, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(email);
        console.log(`🔴 ${email} went offline`);
        io.emit('userStatusUpdate', { email, status: 'offline' });
        break;
      }
    }
  });
});

// Default route
app.get('/', (req, res) => res.send('Campus Marketplace Backend Running ✅'));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
