import React from "react";
import logo from "../assets/logo.svg";
import { useNavigate, Link } from "react-router-dom";
import { Button, useMediaQuery } from "@mui/material";

const Header = ({ children, homeDisabled }) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const navigateToHomePage = () => {
    navigate("/");
  };

  return (
    <nav className="header-nav d-flex align-items-center justify-content-around">
      <div className="d-flex align-items-center gap-5">
        <div
          className="logo"
          style={{ width: isDesktop ? 180 : 160, cursor: "pointer" }}
        >
          <img
            src={logo}
            className="d-block img-fluid"
            onClick={navigateToHomePage}
          />
        </div>
        {homeDisabled ? null : (
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
        )}
      </div>
      {children}
    </nav>
  );
};

export default Header;
