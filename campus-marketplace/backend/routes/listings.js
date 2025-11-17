import express from 'express';
import Listing from '../models/Listing.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all listings with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, search, campus } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (condition && condition !== 'all') {
      query.condition = condition;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (campus) {
      query.campus = campus;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured listings
router.get('/featured', async (req, res) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new listing
router.post('/', protect, async (req, res) => {
  try {
    // Validate required fields
    const { title, description, price, category, condition, campus } = req.body;
    
    if (!title || !description || !price || !category || !condition) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, description, price, category, and condition are required'
      });
    }

    // Ensure images array is not empty
    const images = req.body.images && req.body.images.length > 0 
      ? req.body.images 
      : [{ secure_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', public_id: '' }];

    const listingData = {
      ...req.body,
      images,
      seller: {
        _id: req.user._id,
        name: req.user.name,
      },
    };

    const listing = new Listing(listingData);
    const savedListing = await listing.save();
    res.status(201).json(savedListing);
  } catch (error) {
    console.error('Error creating listing:', error);
    // Provide more detailed error message
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ message: `Validation error: ${errors}` });
    }
    res.status(400).json({ message: error.message || 'Failed to create listing' });
  }
});

// Add review to listing
router.post('/:id/reviews', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    const review = {
      author: req.body.author,
      comment: req.body.comment,
      rating: req.body.rating,
      createdAt: new Date(),
    };
    
    listing.reviews.push(review);
    await listing.save();
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update listing
router.put('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete listing
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

