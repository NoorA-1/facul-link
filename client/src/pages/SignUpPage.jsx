import React from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { InitialForm, FormWrapper } from "../components";
import { FaPersonChalkboard, FaSchool } from "react-icons/fa6";

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <FormWrapper>
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
            startIcon={<FaPersonChalkboard className="fs-1 d-block mx-auto" />}
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
      </InitialForm>
    </FormWrapper>
  );
};

export default SignUpPage;
