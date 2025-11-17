import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const listingsData = [
  {
    title: 'MacBook Pro 13" 2020 - Excellent Condition',
    description: 'Barely used MacBook Pro with M1 chip, 8GB RAM, 256GB SSD. Perfect for students. Includes original charger and box.',
    price: 65000,
    category: 'Electronics',
    condition: 'Excellent',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', public_id: '' }],
  },
  {
    title: 'Data Structures and Algorithms Textbook',
    description: 'Latest edition, no markings or highlights. Perfect condition. Great for CSE students.',
    price: 450,
    category: 'Books',
    condition: 'Like New',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', public_id: '' }],
  },
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Sony WH-1000XM4 with noise cancellation. Used for 6 months, excellent sound quality.',
    price: 15000,
    category: 'Electronics',
    condition: 'Good',
    campus: 'chitkara-baddi',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', public_id: '' }],
  },
  {
    title: 'Study Desk with Chair',
    description: 'Wooden study desk with comfortable chair. Perfect for dorm room. Slightly used but sturdy.',
    price: 2500,
    category: 'Furniture',
    condition: 'Good',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', public_id: '' }],
  },
  {
    title: 'iPhone 12 - 128GB Blue',
    description: 'Well maintained iPhone 12 with 85% battery health. No scratches, includes case and screen protector.',
    price: 35000,
    category: 'Electronics',
    condition: 'Excellent',
    campus: 'chitkara-baddi',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1592286927505-b0c2e0a13e0f?w=400', public_id: '' }],
  },
  {
    title: 'Engineering Mathematics Book Set',
    description: 'Complete set of 3 books for engineering mathematics. Minimal wear, great condition.',
    price: 800,
    category: 'Books',
    condition: 'Good',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400', public_id: '' }],
  },
  {
    title: 'Gaming Mouse - Logitech G502',
    description: 'High-performance gaming mouse with customizable buttons. Like new condition.',
    price: 2800,
    category: 'Electronics',
    condition: 'Like New',
    campus: 'chitkara-baddi',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', public_id: '' }],
  },
  {
    title: 'Winter Jacket - North Face',
    description: 'Warm winter jacket, size L. Perfect for cold weather. Barely worn.',
    price: 3500,
    category: 'Clothes',
    condition: 'Like New',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', public_id: '' }],
  },
  {
    title: 'Mechanical Keyboard - RGB',
    description: 'RGB mechanical keyboard with blue switches. Great for typing and gaming.',
    price: 3200,
    category: 'Electronics',
    condition: 'Excellent',
    campus: 'chitkara-baddi',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', public_id: '' }],
  },
  {
    title: 'Calculus Textbook - 10th Edition',
    description: 'Standard calculus textbook for engineering. Some notes in margins but readable.',
    price: 550,
    category: 'Books',
    condition: 'Good',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', public_id: '' }],
  },
  {
    title: 'Portable Hard Drive - 1TB',
    description: 'Seagate 1TB external hard drive. Fast USB 3.0. Perfect for backups.',
    price: 2200,
    category: 'Electronics',
    condition: 'Excellent',
    campus: 'chitkara-baddi',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400', public_id: '' }],
  },
  {
    title: 'Office Chair - Ergonomic',
    description: 'Comfortable ergonomic office chair with lumbar support. Adjustable height.',
    price: 4500,
    category: 'Furniture',
    condition: 'Good',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400', public_id: '' }],
  },
  {
    title: 'Backpack - Laptop Compatible',
    description: 'Durable backpack with laptop compartment. Water resistant. Multiple pockets.',
    price: 1200,
    category: 'Other',
    condition: 'Like New',
    campus: 'chitkara-baddi',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', public_id: '' }],
  },
  {
    title: 'Physics Lab Manual',
    description: 'Complete physics lab manual with all experiments. Clean pages.',
    price: 300,
    category: 'Books',
    condition: 'Like New',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1532619675605-1ede6c9ed2d7?w=400', public_id: '' }],
  },
  {
    title: 'Wireless Mouse - Logitech',
    description: 'Reliable wireless mouse with long battery life. Perfect for daily use.',
    price: 600,
    category: 'Electronics',
    condition: 'Good',
    campus: 'chitkara-baddi',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', public_id: '' }],
  },
  {
    title: 'Formal Shoes - Size 9',
    description: 'Black formal shoes, size 9. Worn only a few times. Great for interviews.',
    price: 1500,
    category: 'Clothes',
    condition: 'Excellent',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400', public_id: '' }],
  },
  {
    title: 'Programming in C++ Book',
    description: 'Comprehensive C++ programming guide. Perfect for beginners.',
    price: 400,
    category: 'Books',
    condition: 'Good',
    campus: 'chitkara-baddi',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', public_id: '' }],
  },
  {
    title: 'Table Lamp - LED',
    description: 'Adjustable LED table lamp with USB charging port. Energy efficient.',
    price: 800,
    category: 'Furniture',
    condition: 'Like New',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', public_id: '' }],
  },
  {
    title: 'Graphic T-Shirts - Pack of 3',
    description: 'Set of 3 graphic t-shirts, size M. Comfortable cotton material.',
    price: 900,
    category: 'Clothes',
    condition: 'Good',
    campus: 'chitkara-baddi',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', public_id: '' }],
  },
  {
    title: 'Scientific Calculator - Casio',
    description: 'Casio scientific calculator. Essential for engineering students.',
    price: 500,
    category: 'Other',
    condition: 'Excellent',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400', public_id: '' }],
  },
];

const seedListings = async () => {
  try {
    await connectDB();

    // Get all users
    const users = await User.find({ role: 'user' });
    
    if (users.length === 0) {
      console.log('❌ No users found. Please run seedUsers.js first.');
      process.exit(1);
    }

    // Clear existing listings
    await Listing.deleteMany({});
    console.log('Cleared existing listings');

    // Assign random users to listings
    const listingsWithSellers = listingsData.map((listing, index) => {
      const randomUser = users[index % users.length];
      return {
        ...listing,
        seller: {
          _id: randomUser._id,
          name: randomUser.name,
        },
      };
    });

    // Insert listings
    const createdListings = await Listing.insertMany(listingsWithSellers);
    console.log(`✅ Seeded ${createdListings.length} listings`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding listings:', error);
    process.exit(1);
  }
};

seedListings();
