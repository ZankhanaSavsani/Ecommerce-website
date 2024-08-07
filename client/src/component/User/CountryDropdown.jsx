import React from "react";
import { FaAngleDown } from "react-icons/fa";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { IoSearch } from "react-icons/io5";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Slide from '@mui/material/Slide';

// export default function AlertDialog() {
//   const [open, setOpen] = React.useState(false);
// }

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropdown = () => {

  const [isOpenModel, setisOpenModel] = useState(false);

  return (
    <>
      <Button className="countryDrop" onClick={()=>setisOpenModel(true)}>
        <div className="info d-flex flex-column">
          <span className="lable">Your Location</span>
          <span className="name">India</span>
        </div>
        <span className="ml-auto">
          <FaAngleDown />
        </span>
      </Button>

      <Dialog open={isOpenModel} onClick={()=>setisOpenModel(false)} className="locationModel" TransitionComponent={Transition}>
      <span><Button className="close_" onClick={()=>setisOpenModel(false)}><IoIosClose/></Button></span>
        <h4 className="mb-0">Choose your Delivery Location</h4>
        <p>Enter your address and we will specify the offer for your area.</p>
        <div className="headerSearch w-100">
          <input type="text" placeholder="Search your area..." />
          <Button>
            <IoSearch />
          </Button>
        </div>
        <ul className="countryList mt-3">
          <li>
            <Button onClick={()=>setisOpenModel(false)} >India</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >Sri Lanka</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >Pakistan</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >India</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >Sri Lanka</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >Pakistan</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >India</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >Sri Lanka</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >Pakistan</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >India</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >Sri Lanka</Button>
          </li>
          <li>
            <Button onClick={()=>setisOpenModel(false)} >Pakistan</Button>
          </li>
        </ul>
      </Dialog>
    </>
  );
};

export default CountryDropdown;
