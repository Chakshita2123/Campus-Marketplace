import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the backend directory
dotenv.config({ path: join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI is not defined in .env file');
      console.error('Please create a .env file in the backend directory with:');
      console.error('MONGODB_URI=your-mongodb-connection-string');
      process.exit(1);
    }

    // Clean up the connection string
    let mongoUri = process.env.MONGODB_URI.trim();
    
    // Remove appname parameter if present (it can cause connection issues)
    mongoUri = mongoUri.replace(/[?&]appname=[^&]*/g, '');
    
    // Ensure proper format - should start with mongodb:// or mongodb+srv://
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
    }
    
    // Remove any trailing problematic characters
    mongoUri = mongoUri.replace(/[?&]$/, '');
    
    // Ensure we have retryWrites and w parameters
    if (!mongoUri.includes('retryWrites=true')) {
      mongoUri += (mongoUri.includes('?') ? '&' : '?') + 'retryWrites=true';
    }
    if (!mongoUri.includes('w=majority')) {
      mongoUri += '&w=majority';
    }
    
    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Debug: Show sanitized connection string (hide password)
    const debugUri = mongoUri.replace(/:[^:@]+@/, ':****@');
    console.log(`📝 Connection string: ${debugUri}`);
    
    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check that your connection string format is correct:');
    console.error('   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
    console.error('2. Make sure your password is URL encoded if it contains special characters');
    console.error('3. Verify your MongoDB Atlas IP whitelist includes your current IP');
    console.error('4. Check that your database user has the correct permissions');
    console.error('\n📖 See CONNECTION_STRING_GUIDE.md for detailed instructions');
    process.exit(1);
  }
};

export default connectDB;

