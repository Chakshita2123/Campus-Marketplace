import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Campus Marketplace
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/sell">Sell Item</Link>
        <Link to="/chat-list" id="chat-link">
          <i className="fa-regular fa-paper-plane"></i>
          <span id="chat-notif">3</span>
        </Link>

        {userData && (
          <div className="profile-menu">
            <img onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} src={userData.profilePic || 'https://i.pravatar.cc/150?img=47'} alt="Profile" />
            {isProfileMenuOpen && (
              <div className="profile-dropdown">
                <div>{userData.name}</div>
                <Link to="/profile">Profile</Link>
                <Link to="/settings">Settings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>

      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/">Home</Link>
          <Link to="/sell">Sell Item</Link>
          <Link to="/chat-list">
            <i className="fa-regular fa-paper-plane"></i> Messages
          </Link>
          <Link to="/profile">
            <img src={userData.profilePic || 'https://i.pravatar.cc/150?img=47'} alt="Profile" />
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
