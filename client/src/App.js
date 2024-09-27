import React from "react";
import "./App.css";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Products from "./components/Products";
import Product from "./components/Product";
import CategoryProducts from "./components/CategoryProducts";
import ProductPage from "./components/ProductPage";
import ProductPage2 from "./components/ProductPage2";
import CategoryProducts2 from "./components/CategoryProducts2";

function App() {
  return (
    <>
    <Router>
      <Routes>
          <Route path="/" element={<Home/>} /> 
          <Route path="/home" element={<Home/>} />   
          <Route path="/about" element={<AboutUs/>} />         
          <Route path="/contact" element={<ContactUs/>} />  
          <Route path="/products" element={<Products/>} />  

          <Route path="/product" element={<Product />} />
          <Route path="/ProductPage" element={<ProductPage />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />  
        {/* <Route path="/product/:productId" element={<ProductPage2 />} />   */}
        {/* <Route path="/category/:categoryId" element={<CategoryProducts2 />} />           */}
      </Routes>
    </Router> 
    </>
  );
}

export default App;
