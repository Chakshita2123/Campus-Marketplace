import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

console.log('🌱 Starting database seeding...\n');

try {
  console.log('1️⃣ Seeding users...');
  execSync('node campus-marketplace/backend/scripts/seedUsers.js', { stdio: 'inherit' });
  
  console.log('\n2️⃣ Seeding listings...');
  execSync('node campus-marketplace/backend/scripts/seedListings.js', { stdio: 'inherit' });
  
  console.log('\n✅ All data seeded successfully!');
  console.log('\n📊 Summary:');
  console.log('- Users: 11 (1 admin + 10 regular users)');
  console.log('- Listings: 20 items across all categories');
  console.log('\n🔐 Login Credentials:');
  console.log('Admin: admin@chitkara.edu.in / admin123');
  console.log('Users: [name]@chitkara.edu.in / password123');
  console.log('\n🚀 You can now start using the application!');
  
} catch (error) {
  console.error('\n❌ Error during seeding:', error.message);
  process.exit(1);
}
