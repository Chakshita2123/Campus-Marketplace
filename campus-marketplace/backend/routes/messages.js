import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all conversations for a user
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [
        { 'sender._id': userId },
        { 'receiver._id': userId }
      ]
    }).sort({ createdAt: -1 });

    // Group by conversation and get latest message
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const conversationId = msg.conversationId;
      
      if (!conversationsMap.has(conversationId)) {
        const otherUser = msg.sender._id.toString() === userId 
          ? msg.receiver 
          : msg.sender;

        conversationsMap.set(conversationId, {
          conversationId,
          otherUser,
          listingId: msg.listingId,
          listingTitle: msg.listingTitle,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unread: 0,
        });
      }

      // Count unread messages
      if (msg.receiver._id.toString() === userId && !msg.read) {
        conversationsMap.get(conversationId).unread++;
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get messages for a specific conversation
router.get('/conversation/:conversationId', protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        'receiver._id': userId,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, receiverName, text, listingId, listingTitle } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver and message text are required' });
    }

    const senderId = req.user._id.toString();

    // Create conversation ID (sorted to ensure consistency)
    const conversationId = [senderId, receiverId].sort().join('_');

    const message = await Message.create({
      conversationId,
      sender: {
        _id: req.user._id,
        name: req.user.name,
      },
      receiver: {
        _id: receiverId,
        name: receiverName,
      },
      text,
      listingId,
      listingTitle,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.put('/read/:conversationId', protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    await Message.updateMany(
      {
        conversationId,
        'receiver._id': userId,
        read: false
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
