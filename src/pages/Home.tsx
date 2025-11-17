import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store/store';
import { fetchFeatured } from '@/features/listings/listingsSlice';
import ListingCard from '@/components/ListingCard';
import CategoryCard from '@/components/CategoryCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const featured = useSelector((state: RootState) => state.listings.featured);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchFeatured());
  }, [dispatch]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/browse?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Buy & Sell Within Your Campus
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                The trusted marketplace for students. Find great deals on books, electronics, furniture, and more.
              </p>
              
              <div className="flex gap-2 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search for items..." 
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                </div>
                <Button size="lg" className="h-12 px-8" onClick={handleSearch}>
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>Safe & Verified</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-accent" />
                  <span>Campus Only</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span>1000+ Listings</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-4">Popular Categories</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => handleCategoryClick('Books')}>
                    <CategoryCard title="Books" />
                  </div>
                  <div onClick={() => handleCategoryClick('Electronics')}>
                    <CategoryCard title="Electronics" />
                  </div>
                  <div onClick={() => handleCategoryClick('Clothes')}>
                    <CategoryCard title="Clothes" />
                  </div>
                  <div onClick={() => handleCategoryClick('Furniture')}>
                    <CategoryCard title="Furniture" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">Featured Listings</h2>
            <p className="text-muted-foreground">Check out the latest deals from your peers</p>
          </div>
          <Link to="/browse">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((listing, index) => (
            <motion.div
              key={listing._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Join hundreds of students buying and selling on Campus Marketplace
          </p>
          <Link to="/post">
            <Button size="lg" variant="secondary" className="text-primary font-semibold">
              Post Your First Listing
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
