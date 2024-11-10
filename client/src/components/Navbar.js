import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UilBars, UilTimes, UilShoppingCart } from '@iconscout/react-unicons'; // Import cart icon
import { useNavigate } from 'react-router-dom';
import "../css/Navbar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);

  const handleNavOpenClick = () => {
    setIsNavOpen(true);
  };

  const handleNavCloseClick = () => {
    setIsNavOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };


  const goToCart = () => {
    navigate('/cart');
  };

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsNavOpen(false); // Close the nav if click is outside
    }
  };

  // Set up event listener when the component mounts
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav ref={navRef} className={`nav ${isNavOpen ? 'openNav' : ''}`}>
      <UilBars className="uil navOpenBtn" onClick={handleNavOpenClick} />
      <a href="#" className="logo">Gokul Seed Tech Pvt Ltd</a>

      <ul className="nav-links">
        <UilTimes className="uil navCloseBtn" onClick={handleNavCloseClick} />
        <li><Link to='/home'>Home</Link></li>
        <li><Link to='/categories'>Categories</Link></li>
        <li><Link to='/contact'>Contact Us</Link></li>
        <li><Link to='/about'>About Us</Link></li>
        <button className="cart-btn" onClick={goToCart}>
            <UilShoppingCart className="cart-icon" /> Cart
          </button>
        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default NavBar;

