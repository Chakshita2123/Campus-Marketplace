import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/features/auth/authSlice';
import { Bell, MessageSquare, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="w-full bg-white border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-soft"
              whileHover={{ scale: 1.05 }}
            >
              CM
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-primary">Campus Marketplace</div>
              <div className="text-xs text-muted-foreground">Student-first marketplace</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/browse" className="text-foreground hover:text-accent transition-colors hidden sm:block">
              Browse
            </Link>
            <Link to="/pickup" className="text-foreground hover:text-accent transition-colors hidden sm:block">
              Pickup
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/post">
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Post</span>
                  </Button>
                </Link>
                
                <Link to="/chat" className="relative">
                  <MessageSquare className="w-5 h-5 text-foreground hover:text-accent transition-colors" />
                </Link>
                
                <button className="relative">
                  <Bell className="w-5 h-5 text-foreground hover:text-accent transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
                </button>
                
                <div className="hidden sm:flex items-center gap-3">
                  <Link to="/profile" className="text-sm text-foreground hover:text-accent">
                    {user?.name}
                  </Link>
                  <button 
                    onClick={() => dispatch(logout())} 
                    className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
