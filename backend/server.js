const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

// Initialize app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Allow up to 10 MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Session setup (required for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./passport');

// MongoDB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth')); // Normal login/signup
app.use('/auth', require('./routes/authRoutes')); // Google OAuth

// ✅ Products route (for listings)
app.use('/api/products', require('./routes/products')); // <-- newly added line

// Default route
app.get('/', (req, res) => {
  res.send('Campus Marketplace Backend Running ✅');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
