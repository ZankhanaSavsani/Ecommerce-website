// App.js
import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Products from "./components/Products";
import Product from "./components/Product";
import CategoryProducts from "./components/CategoryProducts";
import ProductPage from "./components/ProductPage";
import ProductPage2 from "./components/ProductPage2";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default state

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Any additional logout logic here
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Any additional login logic here
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product" element={<Product />} />
        <Route path="/ProductPage" element={<ProductPage />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/product/:productId" element={<ProductPage2 />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} /> {/* Pass handleLogin to LoginPage */}
      </Routes>
    </Router>
  );
};

export default App;
