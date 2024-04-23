import React from "react";
import logo from "../assets/logo.svg";
import { useNavigate, Link } from "react-router-dom";
import { Button, useMediaQuery } from "@mui/material";

const Header = ({ children, homeDisabled, classes, isTestMode = false }) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const navigateToHomePage = () => {
    navigate("/");
  };

  return (
    <nav
      className="header-nav d-flex align-items-center justify-content-around"
      // style={{ padding: "0 20rem" }}
    >
      <div className="d-flex align-items-center gap-5">
        <div
          className="logo"
          style={{
            width: isDesktop ? 180 : 160,
            cursor: !isTestMode && "pointer",
          }}
        >
          <img
            src={logo}
            className="d-block img-fluid"
            onClick={() => {
              if (!isTestMode) {
                navigateToHomePage();
              }
            }}
          />
        </div>
        {homeDisabled ? null : (
          <Link to="/">
            <Button
              variant="outlined"
              size="medium"
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
