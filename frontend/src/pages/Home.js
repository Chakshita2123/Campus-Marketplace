import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const setCategory = (category) => {
    localStorage.setItem('selectedCategory', category);
    navigate('/listings');
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-text">
            <h1>Buy & Sell in Your Campus</h1>
            <p>
              Get books, electronics, hostel items, uniforms, and more right from your college peers.
            </p>
            <div className="hero-buttons">
              <Link to="/listings" className="btn btn-primary">
                Explore Listings
              </Link>
              <Link to="/sell" className="btn btn-secondary">
                Post an Item
              </Link>
            </div>
          </div>
          <img src="/marketplace.jpg" alt="Marketplace" className="hero-image" />
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="feature-highlights">
        <div className="container feature-highlights-container">
          <div className="feature">
            <i className="fas fa-bolt"></i>
            <h3>Quick Deals</h3>
            <p>Buy or sell items within hours inside your campus network.</p>
          </div>
          <div className="feature">
            <i className="fas fa-user-check"></i>
            <h3>Verified Students</h3>
            <p>Every listing is posted by a real student from your college.</p>
          </div>
          <div className="feature">
            <i className="fas fa-hand-holding-dollar"></i>
            <h3>Zero Commission</h3>
            <p>No platform fees — you keep the full sale price.</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <div className="container categories-container">
          <h2>Browse Categories</h2>
          <div className="category-grid">
            <div onClick={() => setCategory('Books')} className="category">
              <i className="fas fa-book"></i>
              <h3>Books</h3>
            </div>
            <div onClick={() => setCategory('Electronics')} className="category">
              <i className="fas fa-laptop"></i>
              <h3>Electronics</h3>
            </div>
            <div onClick={() => setCategory('Hostel Items')} className="category">
              <i className="fas fa-bed"></i>
              <h3>Hostel Items</h3>
            </div>
            <div onClick={() => setCategory('Fashion')} className="category">
              <i className="fas fa-tshirt"></i>
              <h3>Fashion</h3>
            </div>
            <div onClick={() => setCategory('Stationery')} className="category">
              <i className="fas fa-pencil-alt"></i>
              <h3>Stationery</h3>
            </div>
            <div onClick={() => setCategory('Miscellaneous')} className="category">
              <i className="fas fa-box-open"></i>
              <h3>Miscellaneous</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
