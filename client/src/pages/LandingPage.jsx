import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import main from "../assets/main-animated.svg";
import logo from "../assets/logo.svg";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import HomeCard from "./HomeCard";
import { Footer } from "../components";

const LandingPage = () => {
  return (
    <>
      <div className="vh-100">
        <nav className="container landing-nav mb-md-5 pt-4 d-flex align-items-start gap-5 gap-sm-0 justify-content-sm-between justify-content-center flex-wrap">
          <img src={logo} className="img-fluid" width={200} />
          <div>
            <Link to="/sign-in">
              <Button
                variant="text"
                size="medium"
                sx={{
                  // color: "#001219",
                  // border: 1,
                  // borderColor: "secondary.main",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  // boxShadow:
                  //   "0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                  // ":hover": {
                  //   border: 2,
                  //   borderColor: "secondary.main",
                  // },
                }}
              >
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button
                size="medium"
                variant="contained"
                sx={{
                  marginLeft: "1.25rem",
                  color: "#FFF",
                  backgroundColor: "primary.main",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
        <div className="container mb-5 p-sm-0 p-5">
          <div className="row flex-column-reverse flex-lg-row">
            <div className="slogan-container col-12 col-lg-7">
              <h1 className="fw-bold display-md-2  display-4">
                Elevate <br /> Your Faculty Career
              </h1>
              <p className="h5 fw-medium mb-4">
                Discover opportunities to advance your career with
                <span className="project-name fw-bolder"> Facul-Link</span>,
                your dedicated academic job search and hiring hub.
              </p>
              <Link to="/sign-up">
                <Button
                  size="large"
                  variant="contained"
                  className="mb-5"
                  endIcon={<ChevronRightOutlinedIcon />}
                  sx={{
                    color: "#FFF",
                    backgroundColor: "primary.main",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="d-flex justify-content-center mt-5 col-12 col-lg-5 ps-lg-5 ps-0 py-5 py-lg-0">
              <img
                className="img-fluid"
                style={{ marginTop: "-6rem" }}
                src={main}
              />
            </div>
          </div>
        </div>

        <section
          className="col-12 card-section px-5 px-md-0 mt-5 d-flex align-items-center py-5 "
          style={{ backgroundColor: "#AFBBBB" }}
        >
          <div className="d-flex align-items-center justify-content-around container flex-lg-row gap-5 flex-column">
            <HomeCard heading="Profile" text="Build a comprehensive profile">
              <AccountBoxOutlinedIcon sx={{ fontSize: 65 }} />
            </HomeCard>

            <HomeCard
              heading="Browse Jobs"
              text="Explore a wide range of jobs in universities across Pakistan"
            >
              <WorkHistoryOutlinedIcon sx={{ fontSize: 65 }} />
            </HomeCard>

            <HomeCard heading="Easily Apply" text="Apply for jobs">
              <InventoryOutlinedIcon sx={{ fontSize: 65 }} />
            </HomeCard>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
