# Database Seeding Guide

## Overview
Comprehensive seed scripts to populate the database with dummy data for testing and development.

## What Gets Seeded

### 1. Users (11 total)
- **1 Admin**: Full platform access
- **10 Regular Users**: Various students from different campuses

**Admin Credentials:**
- Email: `admin@chitkara.edu.in`
- Password: `admin123`
- Role: `admin`
- Campus: Chitkara Rajpura

**Regular Users:**
All have password: `password123`
- Rahul Sharma (rahul.sharma@chitkara.edu.in) - Rajpura
- Priya Patel (priya.patel@chitkara.edu.in) - Rajpura
- Amit Kumar (amit.kumar@chitkara.edu.in) - Baddi
- Sneha Reddy (sneha.reddy@chitkara.edu.in) - Rajpura
- Vivek Singh (vivek.singh@chitkara.edu.in) - Baddi
- Anjali Verma (anjali.verma@chitkara.edu.in) - Rajpura
- Raj Mehta (raj.mehta@chitkara.edu.in) - Baddi
- Kavya Nair (kavya.nair@chitkara.edu.in) - Rajpura
- Arjun Desai (arjun.desai@chitkara.edu.in) - Baddi
- Divya Joshi (divya.joshi@chitkara.edu.in) - Rajpura

### 2. Listings (20 items)

**Electronics (9 items):**
- MacBook Pro 13" - ₹65,000
- Wireless Bluetooth Headphones - ₹15,000
- iPhone 12 128GB - ₹35,000
- Gaming Mouse Logitech G502 - ₹2,800
- Mechanical Keyboard RGB - ₹3,200
- Portable Hard Drive 1TB - ₹2,200
- Wireless Mouse - ₹600
- And more...

**Books (6 items):**
- Data Structures Textbook - ₹450
- Engineering Mathematics Set - ₹800
- Calculus Textbook - ₹550
- Physics Lab Manual - ₹300
- Programming in C++ - ₹400

**Furniture (4 items):**
- Study Desk with Chair - ₹2,500
- Office Chair Ergonomic - ₹4,500
- Table Lamp LED - ₹800

**Clothes (3 items):**
- Winter Jacket North Face - ₹3,500
- Formal Shoes Size 9 - ₹1,500
- Graphic T-Shirts Pack - ₹900

**Other (2 items):**
- Backpack Laptop Compatible - ₹1,200
- Scientific Calculator - ₹500

## How to Seed

### Option 1: Seed Everything (Recommended)
```bash
cd campus-marketplace/backend
npm run seed:all
```

This will:
1. Clear existing data
2. Seed 11 users
3. Seed 20 listings
4. Show summary

### Option 2: Seed Individually

**Seed Users Only:**
```bash
npm run seed:users
```

**Seed Listings Only:**
```bash
npm run seed:listings
```
Note: Must seed users first before listings!

### Option 3: Manual Execution

**Seed Users:**
```bash
node scripts/seedUsers.js
```

**Seed Listings:**
```bash
node scripts/seedListings.js
```

## What Happens During Seeding

### Users Seeding
1. Connects to MongoDB
2. Deletes all existing users
3. Creates 11 new users
4. Passwords are automatically hashed
5. Shows success message

### Listings Seeding
1. Connects to MongoDB
2. Fetches all users
3. Deletes all existing listings
4. Creates 20 new listings
5. Randomly assigns sellers from users
6. Shows success message

## After Seeding

### Test the Application

**1. Login as Admin:**
```
Email: admin@chitkara.edu.in
Password: admin123
```
- Access admin dashboard
- Manage users and listings
- View all features

**2. Login as Regular User:**
```
Email: rahul.sharma@chitkara.edu.in
Password: password123
```
- Browse listings
- Create new listings
- Message sellers
- Buy products

**3. Browse Listings:**
- Go to `/browse`
- See 20 seeded listings
- Filter by category
- Search products

**4. Test Features:**
- View product details
- Message sellers
- Post new listings
- Rate and review
- Admin features

## Verify Seeding

### Check Users
```bash
# In MongoDB shell or Compass
db.users.count()
# Should return: 11

db.users.find({ role: 'admin' })
# Should return: 1 admin user

db.users.find({ role: 'user' })
# Should return: 10 regular users
```

### Check Listings
```bash
db.listings.count()
# Should return: 20

db.listings.find({ category: 'Electronics' })
# Should return: 9 electronics

db.listings.find({ campus: 'chitkara-rajpura' })
# Should return: ~10 listings
```

## Troubleshooting

### Error: "No users found"
**Problem:** Trying to seed listings before users

**Solution:**
```bash
npm run seed:users
npm run seed:listings
```

### Error: "MongoDB connection failed"
**Problem:** MongoDB not accessible

**Solution:**
1. Check `.env` file has correct connection string
2. Verify MongoDB Atlas is accessible
3. Check network connection

### Error: "Cannot find module"
**Problem:** Missing dependencies

**Solution:**
```bash
npm install
```

### Listings Not Showing
**Problem:** Frontend cache or backend not restarted

**Solution:**
1. Restart backend server
2. Clear browser cache
3. Refresh page

## Customization

### Add More Users
Edit `scripts/seedUsers.js`:
```javascript
const users = [
  // Add more user objects
  {
    name: 'New User',
    email: 'newuser@chitkara.edu.in',
    password: 'password123',
    campus: 'chitkara-rajpura',
    role: 'user',
  },
];
```

### Add More Listings
Edit `scripts/seedListings.js`:
```javascript
const listingsData = [
  // Add more listing objects
  {
    title: 'New Product',
    description: 'Description here',
    price: 1000,
    category: 'Electronics',
    condition: 'New',
    campus: 'chitkara-rajpura',
    images: [{ secure_url: 'url', public_id: '' }],
  },
];
```

## Reset Database

To completely reset and reseed:
```bash
# Stop backend server
# Run seed script
npm run seed:all
# Restart backend server
npm start
```

## Production Notes

⚠️ **Warning:** These seed scripts will DELETE all existing data!

**For Production:**
1. Do NOT run seed scripts
2. Use real user registration
3. Users create real listings
4. Implement proper data migration

**For Development:**
- Safe to run anytime
- Useful for testing
- Quick data reset
- Consistent test data

## Summary

**Quick Start:**
```bash
cd campus-marketplace/backend
npm run seed:all
npm start
```

**Then:**
1. Open `http://localhost:8081`
2. Login with any seeded user
3. Browse 20 listings
4. Test all features

**Credentials:**
- Admin: `admin@chitkara.edu.in` / `admin123`
- Users: `[name]@chitkara.edu.in` / `password123`

---

✅ Database seeded and ready to use!
