import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Navbar from './Navbar';
import Footer from './Footer';
import CopyRight from './CopyRight';

const Layout = ({ children }) => {
  const location = useLocation();
  const excludePaths = ["/login", "/register"];
  const showLayout = !excludePaths.includes(location.pathname);

  useEffect(() => {
    console.log("Current path:", location.pathname);
    console.log("Show layout:", showLayout);
  }, [location]);

  return (
    <div className="layout-container">
      {showLayout && <Navbar />}
      <main className="main-content">{children}</main>
      {showLayout && <Footer />}
      {showLayout && <CopyRight />}
    </div>
  );
};

export default Layout;
