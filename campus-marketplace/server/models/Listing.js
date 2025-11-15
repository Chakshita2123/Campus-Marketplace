const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  condition: { type: String, enum: ['new', 'like-new', 'good', 'fair', 'poor'], required: true },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: [String]
});

listingSchema.index({ seller: 1, category: 1, price: 1, createdAt: -1 });
listingSchema.index({ title: 'text', description: 'text' });

listingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
