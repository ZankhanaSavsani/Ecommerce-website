import { createContext, useEffect, useState } from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Header from './component/User/Header.jsx';
import axios from 'axios';

const MyContext = createContext();

function App() {

  const [countryList, setCountryList] = useState({});

  useEffect(()=>{
    var req = unirest("GET", "https://www.universal-tutorial.com/api/getaccesstoken");

  req.headers({
    "Accept": "application/json",
    "api-token": "AuXnFjES43NqbdODZoc1anLtpO9op_9HsA7hqU56HJoxlbbNrMsUAzmsp6cqoZ0HhWQ",
    "user-email": "abc@gmail.com"
  });
  },[]);

  const getCountry=async(url)=>{
    const responsive = await axios.get(url).then((res)=>{
      console.log(res.data.data)
    })
  }

  const values ={

  }

  return (
    <BrowserRouter>
    <MyContext.Provider value={values}/>
    <Header/>
    <Routes>
      <Route path="/" Component={<Home/>}/>
      <Route path="/home" element={<Home />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;

export {MyContext} 