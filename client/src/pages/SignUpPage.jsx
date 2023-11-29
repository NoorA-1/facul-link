import React from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { InitialForm, Wrapper, Header, Footer } from "../components";
import { FaPersonChalkboard, FaSchool } from "react-icons/fa6";

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Header>
        <div>
          <Link to="/sign-in">
            <Button
              variant="outlined"
              size="medium"
              sx={{
                border: 2,
                textTransform: "capitalize",
                fontWeight: "bold",
                ":hover": {
                  border: 2,
                },
              }}
            >
              Sign In
            </Button>
          </Link>
        </div>
      </Header>
      <div
        style={{ height: "90vh" }}
        className="d-flex align-items-center justify-content-center mb-4"
      >
        <InitialForm>
          <h3 className="text-center fw-bold text-uppercase mt-2">
            Create Account
          </h3>
          <h6 className="text-secondary text-center">Sign Up As:</h6>
          <hr />
          <div className="d-flex flex-md-row flex-column align-items-center justify-content-around mt-4">
            <Button
              variant="contained"
              className="w-100 d-block fs-6 me-0 me-md-3 mb-3 mb-md-0 text-capitalize"
              startIcon={
                <FaPersonChalkboard className="fs-1 d-block mx-auto" />
              }
              onClick={() => navigate("/sign-up-teacher")}
            >
              Teacher
            </Button>
            <Button
              variant="contained"
              className=" w-100 d-block fs-6 text-capitalize"
              startIcon={<FaSchool className="fs-1 d-block mx-auto ps-2" />}
              onClick={() => navigate("/sign-up-employer")}
            >
              Employer
            </Button>
          </div>
          <p className="text-center mt-4">
            Already have an Account?{" "}
            <Link to="/sign-in" className="project-name">
              Sign In
            </Link>
          </p>
        </InitialForm>
      </div>
      <Footer />
    </Wrapper>
  );
};

export default SignUpPage;
