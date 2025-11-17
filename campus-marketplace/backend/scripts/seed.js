import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config({ path: '../.env' });

connectDB();

const seedUsers = async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
      },
    ];

    await User.insertMany(users);

    console.log('Users seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
