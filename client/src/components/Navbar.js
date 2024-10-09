import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UilBars, UilTimes } from '@iconscout/react-unicons';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavOpenClick = () => {
    setIsNavOpen(true);
  };

  const handleNavCloseClick = () => {
    setIsNavOpen(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
  };

  const handleLogin = () => {
    // Add your logout logic here
    navigate('/login'); 
  };

  return (
    <nav className={`nav ${isNavOpen ? 'openNav' : ''}`}>
      <UilBars className="uil navOpenBtn" onClick={handleNavOpenClick} />
      <a href="#" className="logo">Gokul Seed Tech Pvt Ltd</a>

      <ul className="nav-links">
        <UilTimes className="uil navCloseBtn" onClick={handleNavCloseClick} />
        <li><Link to='/home'>Home</Link></li>
        {/* <li><Link to='/services'>Services</Link></li> */}
        <li><Link to='/products'>Products</Link></li>
        <li><Link to='/contact'>Contact Us</Link></li>
        <li><Link to='/about'>About Us</Link></li>
        {/* <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li> */}
        <li><button className="login-btn" onClick={handleLogin}>Login</button></li>
      </ul>
    </nav>
  );
};

export default NavBar;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { UilBars, UilTimes, UilSearch } from '@iconscout/react-unicons';

// const NavBar = () => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isNavOpen, setIsNavOpen] = useState(false);

//   const handleSearchClick = () => {
//     setIsSearchOpen(!isSearchOpen);
//     if (isNavOpen) {
//       setIsNavOpen(false);
//     }
//   };

//   const handleNavOpenClick = () => {
//     setIsNavOpen(true);
//     if (isSearchOpen) {
//       setIsSearchOpen(false);
//     }
//   };

//   const handleNavCloseClick = () => {
//     setIsNavOpen(false);
//   };

//   return (
//     <nav className={`nav ${isSearchOpen ? 'openSearch' : ''} ${isNavOpen ? 'openNav' : ''}`}>
//       <UilBars className="uil navOpenBtn" onClick={handleNavOpenClick} />
//       <a href="#" className="logo">Gokul Seed Tech Pvt Ltd</a>

//       <ul className="nav-links">
//         <UilTimes className="uil navCloseBtn" onClick={handleNavCloseClick} />
//         <li><Link to='/home'>Home</Link></li>
//         <li><Link to='/'>Services</Link></li>
//         <li><Link to='/Products'>Products</Link></li>
//         <li><Link to='/contact'>Contact Us</Link></li>
//         <li><Link to='/about'>About Us</Link></li>
//       </ul>

//       <UilSearch className="uil search-icon" id="searchIcon" onClick={handleSearchClick} />
//       <div className="search-box">
//         <UilSearch className="uil search-icon" />
//         <input type="text" placeholder="Search here..." />
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
