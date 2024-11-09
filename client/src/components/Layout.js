import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CopyRight from './CopyRight';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
      <CopyRight />
    </div>
  );
};

export default Layout;
