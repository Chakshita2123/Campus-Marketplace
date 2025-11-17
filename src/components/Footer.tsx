import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-background border-t mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">Campus Marketplace</h3>
            <p className="text-muted-foreground text-sm">Your on-campus trading hub.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="text-muted-foreground hover:text-primary">Browse</Link></li>
              <li><Link to="/post" className="text-muted-foreground hover:text-primary">Post Listing</Link></li>
              <li><Link to="/profile" className="text-muted-foreground hover:text-primary">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Campus Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
