import { useState } from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Header from './component/User/Header.jsx';


function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" Component={<Home/>}/>
      <Route path="/home" element={<Home />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
