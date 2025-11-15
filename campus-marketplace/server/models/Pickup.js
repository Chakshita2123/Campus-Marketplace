const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

pickupSchema.index({ buyer: 1, seller: 1, status: 1 });

module.exports = mongoose.model('Pickup', pickupSchema);
