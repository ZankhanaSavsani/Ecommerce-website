import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UilBars, UilTimes, UilSearch } from '@iconscout/react-unicons';

const NavBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  };

  const handleNavOpenClick = () => {
    setIsNavOpen(true);
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  const handleNavCloseClick = () => {
    setIsNavOpen(false);
  };

  return (
    <nav className={`nav ${isSearchOpen ? 'openSearch' : ''} ${isNavOpen ? 'openNav' : ''}`}>
      <UilBars className="uil navOpenBtn" onClick={handleNavOpenClick} />
      <a href="#" className="logo">Gokul Seed Tech Pvt Ltd</a>

      <ul className="nav-links">
        <UilTimes className="uil navCloseBtn" onClick={handleNavCloseClick} />
        <li><Link to='/home'>Home</Link></li>
        <li><Link to='/'>Services</Link></li>
        <li><Link to='/Products'>Products</Link></li>
        <li><Link to='/contact'>Contact Us</Link></li>
        <li><Link to='/about'>About Us</Link></li>
      </ul>

      <UilSearch className="uil search-icon" id="searchIcon" onClick={handleSearchClick} />
      <div className="search-box">
        <UilSearch className="uil search-icon" />
        <input type="text" placeholder="Search here..." />
      </div>
    </nav>
  );
};

export default NavBar;
