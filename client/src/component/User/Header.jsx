import React from "react";
import { Link } from "react-router-dom";
import CountryDropdown from "./CountryDropdown";
import { Button } from "@mui/material";
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import SearchBox from "./SearchBox";
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";


const Header = () => {
  return (
    <>
      <div className="headerWrapper">
        <header className="header">
          <div className="container">
            <div className="row">
              <div className="logoWrapper d-flex align-items-center col-sm-2">
                <Link to="/">
                <img src="/images/logo.jpg" alt="Logo" />
                </Link>
              </div>
              <div className="col-sm-10 d-flex align-items-center part2">
                <CountryDropdown />
                <SearchBox />
                <div className="part3 d-flex align-items-center">
                  <Button className="circle mr-3"><FiUser/></Button>
                  <div className="ml-auto cartTab">
                  <Button className="circle ml-2"><IoBagOutline/></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <nav>
          <div className="container">
            <div className="row">
              <div className="col-sm-3 navPart1">
                <Button className="allCatTab">
                  <span className="icon1 mr-2"><IoIosMenu/></span>
                  <span className="text">All CATEGORIES</span>
                  <span className="icon2 ml-2"><FaAngleDown/></span>
                </Button>
              </div>
              <div className="col-sm-9 navPart2">
                
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
