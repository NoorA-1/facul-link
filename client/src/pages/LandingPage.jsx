import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import main from "../assets/main.svg";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import HomeCard from "./HomeCard";

const LandingPage = () => {
  return (
    <>
      <div className="vh-100">
        <nav className="vh-10 mb-md-5">
          <div className="float-end mt-4 me-4">
            <Link to="/sign-in">
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: "#001219",
                  border: 2,
                  borderColor: "secondary.main",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  boxShadow:
                    "0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
                  ":hover": {
                    border: 2,
                    borderColor: "secondary.main",
                  },
                }}
              >
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button
                size="large"
                variant="contained"
                sx={{
                  marginLeft: "1.25rem",
                  color: "#FFF",
                  backgroundColor: "secondary.main",
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
          <div className="row">
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
                  className="mb-5 d-block mx-auto mx-lg-0"
                  sx={{
                    color: "#FFF",
                    backgroundColor: "secondary.main",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="mt-5 col-12 col-lg-5 ps-5 py-5 py-lg-0">
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
        <footer className="p-3 d-flex align-items-center justify-content-center col-12 ">
          <h6>
            © 2023 <span className="fw-bold">Facul-Link</span>, All Rights
            Reserved
          </h6>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;