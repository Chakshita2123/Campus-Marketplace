const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['new_message', 'pickup_request', 'pickup_accepted', 'listing_favorited'], required: true },
  payload: {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    message: { type: String }
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
