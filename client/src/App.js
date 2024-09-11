import React from "react";
import "./App.css";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Products from "./components/Products";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route>
          <Route path="/" element={<Home/>} /> 
          <Route path="/home" element={<Home/>} />   
          <Route path="/about" element={<AboutUs/>} />         
          <Route path="/contact" element={<ContactUs/>} />  
          <Route path="/products" element={<Products/>} />              
        </Route>
      </Routes>
    </Router> 
    </>
  );
}

export default App;
