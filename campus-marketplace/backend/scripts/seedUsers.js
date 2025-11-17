import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const users = [
  {
    name: 'Admin User',
    email: 'admin@chitkara.edu.in',
    password: 'admin123',
    campus: 'chitkara-rajpura',
    role: 'admin',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-rajpura',
    role: 'user',
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-rajpura',
    role: 'user',
  },
  {
    name: 'Amit Kumar',
    email: 'amit.kumar@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-baddi',
    role: 'user',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-rajpura',
    role: 'user',
  },
  {
    name: 'Vivek Singh',
    email: 'vivek.singh@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-baddi',
    role: 'user',
  },
  {
    name: 'Anjali Verma',
    email: 'anjali.verma@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-rajpura',
    role: 'user',
  },
  {
    name: 'Raj Mehta',
    email: 'raj.mehta@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-baddi',
    role: 'user',
  },
  {
    name: 'Kavya Nair',
    email: 'kavya.nair@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-rajpura',
    role: 'user',
  },
  {
    name: 'Arjun Desai',
    email: 'arjun.desai@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-baddi',
    role: 'user',
  },
  {
    name: 'Divya Joshi',
    email: 'divya.joshi@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-rajpura',
    role: 'user',
  },
];

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert new users
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Seeded ${createdUsers.length} users`);

    console.log('\n📋 User Credentials:');
    console.log('Admin: admin@chitkara.edu.in / admin123');
    console.log('Users: [name]@chitkara.edu.in / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
