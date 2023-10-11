import React from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const Header = ({ children }) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const navigateToHomePage = () => {
    navigate("/");
  };

  return (
    <nav className="header-nav d-flex align-items-center p-3 justify-content-around">
      <div
        className="logo"
        style={{ width: isDesktop ? 200 : 180, cursor: "pointer" }}
      >
        <img
          src={logo}
          className="d-block img-fluid"
          onClick={navigateToHomePage}
        />
      </div>
      {children}
    </nav>
  );
};

export default Header;
