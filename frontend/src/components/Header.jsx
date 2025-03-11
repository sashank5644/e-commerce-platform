import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import '../styling/Header.css'; 

function Header() {
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const items = cart?.items || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const deviceCategories = [
    { name: 'Electronics', path: '/category/electronics' },
    { name: 'Accessories', path: '/category/accessories' },
    { name: 'Wearables', path: '/category/wearables' },
    { name: 'Audio', path: '/category/audio' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Left section - Devices Dropdown */}
        <div className="header-left">
          <div className="devices-dropdown">
            <button 
              className={`dropdown-toggle-btn ${isDropdownOpen ? 'active' : ''}`} 
              onClick={toggleDropdown}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              Devices
              <span className="dropdown-arrow">▼</span>
            </button>
            <div 
              className={`devices-dropdown-menu ${isDropdownOpen ? 'open' : ''}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {deviceCategories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="devices-dropdown-item"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Center section - Logo */}
        <div className="header-center">
          <Link to="/" className="logo">
            E-Shop
          </Link>
        </div>

        {/* Right section - Main Navigation */}
        <div className="header-right">
          <nav className="nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <div className="cart-wrapper">
              <Link to="/cart" className="nav-link">
                Cart
              </Link>
              {items.length > 0 && (
                <span className="cart-badge">{items.length}</span>
              )}
            </div>
            {user ? (
              <>
                <Link to="/orders" className="nav-link">
                  My Orders
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" className="nav-link">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="register-btn">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;