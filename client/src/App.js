// App.js
import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AboutUs from "./components/About";
import ContactUs from "./components/Contact";
import Categories from "./components/Category";
import CategoryProducts from "./components/CategoryProducts";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import CartPage from "./components/CartPage";
import ProductDetails from "./components/ProductDetails";
import Layout from "./components/Layout";
import CheckoutPage from "./components/CheckoutPage";


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
      <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} /> {/* Pass handleLogin to LoginPage */}
      </Routes>
      </Layout>
    </Router>
  );
};

export default App;
