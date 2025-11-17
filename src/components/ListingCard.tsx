import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Listing } from '@/features/listings/listingsSlice';
import { MapPin, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${listing._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card p-3 hover:shadow-xl transition-shadow"
    >
      <Link to={`/product/${listing._id}`} className="block">
        <div className="w-full h-48 rounded-xl overflow-hidden bg-muted mb-3 relative group">
          <img 
            src={listing.images?.[0]?.secure_url} 
            alt={listing.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              size="sm"
              className="gap-2"
              onClick={handleBuyNow}
            >
              <ShoppingCart className="w-4 h-4" />
              Buy Now
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-foreground line-clamp-1">{listing.title}</h3>
            <div className="text-lg font-bold text-accent whitespace-nowrap">₹{listing.price}</div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{listing.condition} • {listing.category}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{listing.campus}</span>
            </div>
            {listing.reviews && listing.reviews.length > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {(listing.reviews.reduce((acc, review) => acc + review.rating, 0) / listing.reviews.length).toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
