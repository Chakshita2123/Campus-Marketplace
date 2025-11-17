import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store/store';
import { fetchListings, filterListings } from '@/features/listings/listingsSlice';
import ListingCard from '@/components/ListingCard';
import FiltersSidebar from '@/components/FiltersSidebar';
import { motion } from 'framer-motion';

export default function Browse() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { items, loading } = useSelector((state: RootState) => state.listings);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const params: any = {};
    if (category && category !== 'all') {
      params.category = category;
    }
    if (search) {
      params.search = search;
    }
    
    dispatch(fetchListings(params));
  }, [dispatch, searchParams]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Browse Listings</h1>
          <p className="text-muted-foreground">Discover great deals from your campus community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-20">
              <FiltersSidebar />
            </div>
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading listings...</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {items.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
