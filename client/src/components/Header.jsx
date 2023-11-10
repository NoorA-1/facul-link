import React from "react";
import logo from "../assets/logo.svg";
import { useNavigate, Link } from "react-router-dom";
import { Button, useMediaQuery } from "@mui/material";

const Header = ({ children }) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const navigateToHomePage = () => {
    navigate("/");
  };

  return (
    <nav className="header-nav d-flex align-items-center p-3 justify-content-around">
      <div className="d-flex align-items-center gap-5">
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
        <Link to="/">
          <Button
            variant="outlined"
            size="large"
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
              border: 2,
              ":hover": {
                border: 2,
              },
            }}
          >
            Home
          </Button>
        </Link>
      </div>
      {children}
    </nav>
  );
};

export default Header;
