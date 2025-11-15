const Listing = require('../models/Listing');
const { validationResult } = require('express-validator');

// @desc    Get all listings with pagination, filtering, and sorting
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  const { page = 1, limit = 20, category, minPrice, maxPrice, sort, search } = req.query;

  try {
    const query = {};
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = minPrice;
      }
      if (maxPrice) {
        query.price.$lte = maxPrice;
      }
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    if (sort) {
      const [key, order] = sort.split('_');
      sortOptions[key] = order === 'desc' ? -1 : 1;
    } else {
        sortOptions.createdAt = -1;
    }

    const listings = await Listing.find(query)
      .populate('seller', 'name avatar')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Listing.countDocuments(query);

    res.json({
        listings,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('seller', 'name avatar');
        if(!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        listing.views += 1;
        await listing.save();
        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, category, condition, images, location, tags } = req.body;

    try {
        const newListing = new Listing({
            title,
            description,
            price,
            category,
            condition,
            images,
            location,
            tags,
            seller: req.user.id
        });

        const listing = await newListing.save();
        res.status(201).json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getListings, getListingById, createListing };
