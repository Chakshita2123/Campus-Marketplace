import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['Books', 'Electronics', 'Clothes', 'Furniture', 'Sports', 'Other'],
  },
  condition: {
    type: String,
    required: true,
    enum: ['Like New', 'Excellent', 'Good', 'Fair', 'Poor'],
  },
  images: [
    {
      secure_url: {
        type: String,
        required: false,
        default: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      },
      public_id: {
        type: String,
        default: '',
      },
    },
  ],
  seller: {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  campus: {
    type: String,
    required: true,
    default: 'IIT Delhi',
  },
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

listingSchema.index({ title: 'text', description: 'text' });
listingSchema.index({ category: 1 });
listingSchema.index({ campus: 1 });
listingSchema.index({ createdAt: -1 });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;

