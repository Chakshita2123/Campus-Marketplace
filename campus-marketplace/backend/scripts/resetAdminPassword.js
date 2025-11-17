import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const resetAdminPassword = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@chitkara.edu.in';
    
    // Find admin user
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Run createAdmin.js first to create the admin user.');
      process.exit(1);
    }

    console.log('✅ Admin user found:', admin.email);
    console.log('Current role:', admin.role);
    
    // Update password (will be hashed by pre-save hook)
    admin.password = 'admin123';
    await admin.save();

    console.log('✅ Admin password has been reset!');
    console.log('-----------------------------------');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    console.log('-----------------------------------');
    console.log('You can now login with these credentials');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin password:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();
