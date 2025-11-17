# Campus Marketplace Backend API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd campus-marketplace/backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secret key for JWT tokens
     - `PORT`: Server port (default: 3000)

3. **MongoDB Atlas Setup**
   - Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Get your connection string
   - Replace `<username>`, `<password>`, and `<cluster>` in the connection string
   - Add your IP address to the whitelist in MongoDB Atlas

4. **Seed Database (Optional)**
   ```bash
   node scripts/seedData.js
   ```
   This will populate the database with sample listings.

5. **Start the Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

## API Endpoints

### Listings
- `GET /api/listings` - Get all listings (supports query params: category, condition, minPrice, maxPrice, search, campus)
- `GET /api/listings/featured` - Get featured listings
- `GET /api/listings/:id` - Get single listing by ID
- `POST /api/listings` - Create new listing
- `POST /api/listings/:id/reviews` - Add review to listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile

### Health Check
- `GET /api/health` - Server health check

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-marketplace?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

