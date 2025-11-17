/**
 * Script to fix the username index issue in the User collection
 * Run this once to remove the old username index
 * 
 * Usage: node scripts/fix-user-index.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const fixIndex = async () => {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    // Drop the username index if it exists
    try {
      await collection.dropIndex('username_1');
      console.log('✅ Successfully dropped username_1 index');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️  username_1 index does not exist (already fixed)');
      } else {
        throw error;
      }
    }
    
    // Verify email index exists
    try {
      await collection.createIndex({ email: 1 }, { unique: true });
      console.log('✅ Email index is properly set up');
    } catch (error) {
      if (error.codeName === 'IndexOptionsConflict') {
        console.log('ℹ️  Email index already exists');
      } else {
        throw error;
      }
    }
    
    console.log('\n✅ Database indexes fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
};

fixIndex();

