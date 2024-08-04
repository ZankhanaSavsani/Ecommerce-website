import React from "react";
import { Link } from "react-router-dom";
import CountryDropdown from "./CountryDropdown";
import { IoSearch } from "react-icons/io5";
import { Button } from "@mui/material";
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";

const Header = () => {
  return (
    <>
      <div className="headerWrapper">
        <div className="header">
          <div className="container">
            <div className="row">
              <div className="logoWrapper d-flex align-items-center col-sm-2">
                <Link to="/">
                <img src="/images/logo.jpg" alt="Logo" />
                </Link>
              </div>
              <div className="col-sm-10 d-flex align-items-center part2">
                <CountryDropdown />

                {/* Header Search Start Here */}
                <div className="headerSearch ml-3 mr-3">
                  <input type="text" placeholder="Search for products"/>
                  <Button><IoSearch/></Button>
                </div>
                {/* Header Search End Here */}

                <div className="part3 d-flex align-items-center">
                  <Button className="circle mr-3"><FiUser/></Button>
                  <div className="ml-auto cartTab">
                  <Button className="circle ml-2"><IoBagOutline/></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
