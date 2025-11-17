# Campus Connect - Campus Marketplace

A modern marketplace platform for students to buy and sell items within their campus community.

## Features

- 🛍️ Browse and search listings
- 📝 Post new listings
- 💬 Chat with sellers
- ⭐ Review system
- 🔍 Advanced filtering
- 📱 Responsive design

## Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Backend Setup

See [campus-marketplace/backend/README.md](./campus-marketplace/backend/README.md) for detailed backend setup instructions.

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── features/       # Redux slices
│   ├── lib/           # Utilities and API client
│   ├── pages/         # Page components
│   └── store/         # Redux store configuration
└── campus-marketplace/
    └── backend/       # Express API server
```

## Technologies Used

### Frontend
- React + TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Shadcn UI
- Framer Motion

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication

## Getting Started

1. Set up the backend server (see backend README)
2. Configure MongoDB Atlas connection
3. Start the backend server
4. Start the frontend development server
5. Open http://localhost:8080 in your browser

## Recent Updates

- ✅ Fixed homepage button functionality
- ✅ Added search and category navigation
- ✅ Connected MongoDB Atlas database
- ✅ Expanded dummy data with 20+ listings
- ✅ Integrated API endpoints
- ✅ Updated all components to use real API calls
