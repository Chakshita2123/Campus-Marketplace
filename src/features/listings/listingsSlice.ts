import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api';

export interface Review {
  author: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: Array<{ secure_url: string; public_id: string }>;
  seller: {
    _id: string;
    name: string;
  };
  campus: string;
  createdAt: string;
  reviews?: Review[];
}

interface ListingsState {
  items: Listing[];
  featured: Listing[];
  current: Listing | null;
  loading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  items: [
    {
      _id: 'new-listing-1',
      title: 'Wireless Headphones',
      description: 'High-quality wireless headphones, perfect for studying or relaxing.',
      price: 85,
      category: 'Electronics',
      condition: 'New',
      images: [{ secure_url: '/images/listings/wireless-headphones.webp', public_id: '1' }],
      seller: { _id: 'seller1', name: 'John Doe' },
      campus: 'Main Campus',
      createdAt: new Date().toISOString(),
      reviews: [],
    },
    {
      _id: 'new-listing-2',
      title: 'Used Textbooks',
      description: 'A collection of used textbooks for various subjects. Well-highlighted.',
      price: 45,
      category: 'Books',
      condition: 'Used',
      images: [{ secure_url: '/images/listings/used-textbooks.jpg', public_id: '2' }],
      seller: { _id: 'seller2', name: 'Jane Smith' },
      campus: 'Main Campus',
      createdAt: new Date().toISOString(),
      reviews: [],
    },
    {
      _id: 'new-listing-3',
      title: 'University T-Shirt',
      description: 'Official university t-shirt, available in multiple sizes.',
      price: 20,
      category: 'Apparel',
      condition: 'New',
      images: [{ secure_url: '/images/listings/tshirt.jpeg', public_id: '3' }],
      seller: { _id: 'seller3', name: 'Mike Johnson' },
      campus: 'Main Campus',
      createdAt: new Date().toISOString(),
      reviews: [],
    },
    {
      _id: 'new-listing-4',
      title: 'Stackable Storage Bins',
      description: 'Organize your dorm room with these convenient stackable storage bins.',
      price: 30,
      category: 'Home Goods',
      condition: 'New',
      images: [{ secure_url: '/images/listings/storage-box.jpg', public_id: '4' }],
      seller: { _id: 'seller4', name: 'Emily Davis' },
      campus: 'Main Campus',
      createdAt: new Date().toISOString(),
      reviews: [],
    },
    {
      _id: 'new-listing-5',
      title: 'Organic Chemistry Textbook',
      description: 'Third edition of the Organic Chemistry textbook by Solomons.',
      price: 60,
      category: 'Books',
      condition: 'Used',
      images: [{ secure_url: '/images/listings/organic-chemistry.jpeg', public_id: '5' }],
      seller: { _id: 'seller5', name: 'Chris Brown' },
      campus: 'Main Campus',
      createdAt: new Date().toISOString(),
      reviews: [],
    },
    {
      _id: 'new-listing-6',
      title: 'Modern Laptop',
      description: 'A sleek and powerful laptop, perfect for all your student needs.',
      price: 750,
      category: 'Electronics',
      condition: 'Used',
      images: [{ secure_url: '/images/listings/laptop.jpeg', public_id: '6' }],
      seller: { _id: 'seller6', name: 'Jessica Wilson' },
      campus: 'Main Campus',
      createdAt: new Date().toISOString(),
      reviews: [],
    },
    {
      _id: 'new-listing-7',
      title: 'White Lab Coat',
      description: 'A standard white lab coat, essential for science courses.',
      price: 25,
      category: 'Apparel',
      condition: 'New',
      images: [{ secure_url: '/images/listings/lab-coat.webp', public_id: '7' }],
      seller: { _id: 'seller7', name: 'David Martinez' },
      campus: 'Main Campus',
      createdAt: new Date().toISOString(),
      reviews: [],
    },
    {
      _id: 'new-listing-8',
      title: 'DSA & Coding Interview Books',
      description: 'Data Structures and Algorithms book and Cracking the Coding Interview.',
      price: 55,
      category: 'Books',
      condition: 'Used',
      images: [{ secure_url: '/images/listings/dsa-book.jpeg', public_id: '8' }],
      seller: { _id: 'seller8', name: 'Sarah Garcia' },
      campus: 'Main Campus',
      createdAt: new Date().toISOString(),
      reviews: [],
    },
    {
      _id: 'new-listing-9',
      title: 'Stack of Books',
      description: 'A generic stack of books for your reading pleasure.',
      price: 15,
      category: 'Books',
      condition: 'Used',
      images: [{ secure_url: '/images/listings/books.jpeg', public_id: '9' }],
      seller: { _id: 'seller9', name: 'Robert Rodriguez' },
      campus: 'Main Campus',
      createdAt: new Date().toISOString(),
      reviews: [],
    },
  ],
  featured: [],
  current: null,
  loading: false,
  error: null,
};

// API calls using the API client
export const fetchListings = createAsyncThunk(
  'listings/fetchAll',
  async (params?: { category?: string; condition?: string; minPrice?: number; maxPrice?: number; search?: string }) => {
    try {
      const listings = await apiClient.getListings(params);
      return listings;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  }
);

export const fetchFeatured = createAsyncThunk('listings/fetchFeatured', async () => {
  try {
    const listings = await apiClient.getFeaturedListings();
    return listings;
  } catch (error) {
    console.error('Error fetching featured listings:', error);
    throw error;
  }
});

export const fetchListingById = createAsyncThunk('listings/fetchById', async (id: string) => {
  try {
    const listing = await apiClient.getListingById(id);
    return listing;
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
});

export const createListing = createAsyncThunk('listings/create', async (listingData: Omit<Listing, '_id' | 'createdAt' | 'seller'>) => {
  try {
    const listing = await apiClient.createListing(listingData);
    return listing;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
});

export const addReviewToListing = createAsyncThunk(
  'listings/addReview',
  async ({ listingId, review }: { listingId: string; review: Omit<Review, 'createdAt'> }) => {
    try {
      const newReview = await apiClient.addReview(listingId, review);
      return { listingId, review: newReview };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
);

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
    filterListings: (state, action: PayloadAction<{ category: string; condition: string; priceRange: [number, number]; search?: string }>) => {
      // This reducer is kept for client-side filtering if needed
      // But we'll primarily use API filtering
      const { category, condition, priceRange } = action.payload;
      state.items = state.items.filter(item => {
        const categoryMatch = category === 'all' || item.category === category;
        const conditionMatch = condition === 'all' || item.condition === condition;
        const priceMatch = item.price >= priceRange[0] && item.price <= priceRange[1];
        return categoryMatch && conditionMatch && priceMatch;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        // Combine fetched listings with initial listings, ensuring no duplicates
        const combinedItems = [...action.payload, ...initialState.items];
        const uniqueItems = Array.from(new Map(combinedItems.map(item => [item._id, item])).values());
        state.items = uniqueItems;
        state.error = null;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch listings';
      })
      .addCase(fetchFeatured.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      .addCase(fetchFeatured.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch featured listings';
      })
      .addCase(fetchListingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.error = null;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch listing';
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addReviewToListing.fulfilled, (state, action) => {
        const { listingId, review } = action.payload;
        const listing = state.items.find(item => item._id === listingId);
        if (listing) {
          if (!listing.reviews) {
            listing.reviews = [];
          }
          listing.reviews.push(review);
        }
        if (state.current?._id === listingId) {
          if (!state.current.reviews) {
            state.current.reviews = [];
          }
          state.current.reviews.push(review);
        }
      });
  },
});

export const { filterListings, clearCurrent } = listingsSlice.actions;
export default listingsSlice.reducer;
