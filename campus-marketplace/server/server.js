require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const Chat = require('./models/Chat');


// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5173'],
    credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5173'],
        methods: ["GET", "POST"]
    }
});

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if(!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = await User.findById(decoded.id).select('-passwordHash');
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
})

io.on('connection', (socket) => {
    console.log('a user connected', socket.user.name);

    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.user.name} joined chat ${chatId}`);
    });

    socket.on('send_message', async ({ chatId, text }) => {
        const message = new Message({
            chat: chatId,
            sender: socket.user._id,
            text,
        });

        await message.save();

        const chat = await Chat.findById(chatId);
        chat.lastMessage = message._id;
        await chat.save();

        io.to(chatId).emit('receive_message', message);
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
