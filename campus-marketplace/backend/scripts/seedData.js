import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Listing from '../models/Listing.js';
import connectDB from '../config/db.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the backend directory
dotenv.config({ path: join(__dirname, '../.env') });

const expandedListings = [
  {
    title: 'Physics Textbook - Fundamentals',
    description: 'Like new condition, latest edition. Perfect for first year students. No highlights or markings.',
    price: 450,
    category: 'Books',
    condition: 'Like New',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', public_id: '' }],
    seller: { _id: 'u1', name: 'Rahul Sharma' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Laptop Stand - Adjustable',
    description: 'Adjustable aluminum stand for laptops. Ergonomic design, helps with posture. Barely used.',
    price: 800,
    category: 'Electronics',
    condition: 'Good',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', public_id: '' }],
    seller: { _id: 'u2', name: 'Priya Patel' },
    campus: 'IIT Delhi',
  },
  {
    title: 'LED Desk Lamp with USB',
    description: 'LED desk lamp with USB charging port. Adjustable brightness and color temperature. Excellent condition.',
    price: 600,
    category: 'Furniture',
    condition: 'Excellent',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', public_id: '' }],
    seller: { _id: 'u3', name: 'Amit Kumar' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Graphic T-Shirt - Vintage Style',
    description: 'Comfortable cotton t-shirt with a cool vintage print. Size M, worn only a few times.',
    price: 300,
    category: 'Clothes',
    condition: 'Like New',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', public_id: '' }],
    seller: { _id: 'u4', name: 'Sneha Reddy' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Wireless Mouse - Ergonomic',
    description: 'Ergonomic wireless mouse with long battery life. Perfect for coding and design work.',
    price: 700,
    category: 'Electronics',
    condition: 'Excellent',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1527814223028-76295a083289?w=400', public_id: '' }],
    seller: { _id: 'u5', name: 'Vivek Singh' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Calculus Textbook - Advanced',
    description: 'Advanced calculus textbook for engineering students. Some notes in margins but overall good condition.',
    price: 550,
    category: 'Books',
    condition: 'Good',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', public_id: '' }],
    seller: { _id: 'u6', name: 'Anjali Verma' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Mechanical Keyboard - RGB',
    description: 'RGB mechanical keyboard with blue switches. Great for gaming and typing. Like new condition.',
    price: 2500,
    category: 'Electronics',
    condition: 'Like New',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', public_id: '' }],
    seller: { _id: 'u7', name: 'Raj Mehta' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Study Desk - Wooden',
    description: 'Compact wooden study desk perfect for dorm rooms. Some scratches but fully functional.',
    price: 1200,
    category: 'Furniture',
    condition: 'Good',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', public_id: '' }],
    seller: { _id: 'u8', name: 'Kavya Nair' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Hoodie - University Branded',
    description: 'Warm university branded hoodie. Size L, excellent condition. Perfect for winters.',
    price: 800,
    category: 'Clothes',
    condition: 'Excellent',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=400', public_id: '' }],
    seller: { _id: 'u9', name: 'Arjun Desai' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Chemistry Lab Manual',
    description: 'Chemistry lab manual with all experiments. Clean pages, no writing. Perfect for reference.',
    price: 350,
    category: 'Books',
    condition: 'Like New',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1532619675605-1ede6c9ed2d7?w=400', public_id: '' }],
    seller: { _id: 'u10', name: 'Divya Joshi' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Monitor Stand - Dual',
    description: 'Dual monitor stand with adjustable height. Supports up to 27 inch monitors. Excellent condition.',
    price: 1500,
    category: 'Furniture',
    condition: 'Excellent',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', public_id: '' }],
    seller: { _id: 'u11', name: 'Rohan Kapoor' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Jeans - Slim Fit',
    description: 'Slim fit jeans, size 32. Worn a few times, excellent condition. Perfect fit for college.',
    price: 600,
    category: 'Clothes',
    condition: 'Like New',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', public_id: '' }],
    seller: { _id: 'u12', name: 'Isha Gupta' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Data Structures Book',
    description: 'Comprehensive data structures and algorithms book. Well maintained, no highlights.',
    price: 650,
    category: 'Books',
    condition: 'Excellent',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', public_id: '' }],
    seller: { _id: 'u13', name: 'Manish Tiwari' },
    campus: 'IIT Delhi',
  },
  {
    title: 'USB-C Hub - 7 Ports',
    description: 'USB-C hub with 7 ports including HDMI, USB 3.0, and SD card reader. Perfect for MacBooks.',
    price: 1200,
    category: 'Electronics',
    condition: 'Good',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1587825147138-346c006f3dcd?w=400', public_id: '' }],
    seller: { _id: 'u14', name: 'Neha Agarwal' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Office Chair - Ergonomic',
    description: 'Comfortable ergonomic office chair with lumbar support. Adjustable height and armrests.',
    price: 3000,
    category: 'Furniture',
    condition: 'Good',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400', public_id: '' }],
    seller: { _id: 'u15', name: 'Siddharth Malhotra' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Backpack - Laptop Compatible',
    description: 'Durable backpack with laptop compartment. Water resistant, multiple pockets. Great condition.',
    price: 900,
    category: 'Other',
    condition: 'Excellent',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', public_id: '' }],
    seller: { _id: 'u16', name: 'Pooja Shah' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Linear Algebra Textbook',
    description: 'Linear algebra textbook for engineering. Clean copy, no markings. Latest edition.',
    price: 500,
    category: 'Books',
    condition: 'Like New',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', public_id: '' }],
    seller: { _id: 'u17', name: 'Aditya Rao' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Wireless Headphones',
    description: 'Noise cancelling wireless headphones. Great sound quality, long battery life.',
    price: 2000,
    category: 'Electronics',
    condition: 'Excellent',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', public_id: '' }],
    seller: { _id: 'u18', name: 'Tanvi Deshmukh' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Bookshelf - 5 Tier',
    description: 'Compact 5-tier bookshelf perfect for organizing books and study materials. Easy to assemble.',
    price: 1800,
    category: 'Furniture',
    condition: 'Good',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', public_id: '' }],
    seller: { _id: 'u19', name: 'Varun Iyer' },
    campus: 'IIT Delhi',
  },
  {
    title: 'Formal Shirt - White',
    description: 'Crisp white formal shirt, size M. Perfect for interviews and presentations. Never worn.',
    price: 500,
    category: 'Clothes',
    condition: 'Like New',
    images: [{ secure_url: 'https://images.unsplash.com/photo-1594938291221-94c1c8b9dbd0?w=400', public_id: '' }],
    seller: { _id: 'u20', name: 'Meera Krishnan' },
    campus: 'IIT Delhi',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing listings
    await Listing.deleteMany({});
    console.log('Cleared existing listings');
    
    // Insert new listings
    await Listing.insertMany(expandedListings);
    console.log(`Seeded ${expandedListings.length} listings`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

