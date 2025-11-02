const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// ✅ SIGNUP route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // ✅ Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ LOGIN route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ TEST route
router.get('/test', (req, res) => {
  res.send('Auth route working ✅');
});

// =========================================================
// 📨 FORGOT PASSWORD route (Mailtrap version)
// =========================================================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });

    // ✅ Mailtrap SMTP transporter
    console.log("📨 Sending reset email using:", process.env.MAILTRAP_HOST, process.env.MAILTRAP_USER);


    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const resetLink = `http://127.0.0.1:5500/reset-password.html?token=${token}`;

    const mailOptions = {
      from: '"Campus Marketplace" <no-reply@campusmarketplace.com>',
      to: email,
      subject: 'Password Reset - Campus Marketplace',
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password (valid for 10 minutes):</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <br><br>
        <p>If you didn’t request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Password reset email sent to: ${email}`);
    res.json({ msg: '✅ Password reset link sent! Check your Mailtrap inbox.' });
  } catch (err) {
    console.error('❌ Email sending error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// =========================================================
// 🔑 RESET PASSWORD route
// =========================================================
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ msg: 'Password successfully reset!' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
});

module.exports = router;
