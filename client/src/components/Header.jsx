import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const Header = ({ children }) => {
  return (
    <nav className="header-nav d-flex align-items-center p-3 justify-content-around">
      <Link to="/">
        <img src={logo} className="img-fluid" width="90%" />
      </Link>
      {children}
    </nav>
  );
};

export default Header;
