import React from "react";
import { FormWrapper, InitialForm } from "../components";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { Link } from "react-router-dom";

const TeacherSignUpPage = () => {
  return (
    <FormWrapper>
      <InitialForm>
        <h3 className="text-center fw-bold text-uppercase mt-2">
          Sign Up as Teacher
        </h3>
        <hr />
        <form>
          <div className="px-sm-5">
            <div className="d-flex gap-3">
              <TextField
                variant="outlined"
                type="text"
                label="First Name"
                className="mt-4"
              />
              <TextField
                variant="outlined"
                type="text"
                label="Last Name"
                className="mt-4 "
              />
            </div>
            <FormLabel className="mt-3" id="radio-buttons-group-label">
              Gender
            </FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              defaultValue="male"
              name="radio-buttons-group"
              row
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
            <TextField
              variant="outlined"
              type="email"
              label="Email"
              fullWidth
              className="mt-4 mb-3"
            />
            <TextField
              variant="outlined"
              type="password"
              label="Password"
              fullWidth
              className="mb-3"
            />
            <TextField
              variant="outlined"
              type="password"
              label="Confirm Password"
              fullWidth
            />
            <Button variant="contained" fullWidth className="mt-5 mb-4">
              Sign Up
            </Button>

            <p className="text-center">
              Already have an Account?{" "}
              <Link to="/sign-in" className="project-name">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </InitialForm>
    </FormWrapper>
  );
};

export default TeacherSignUpPage;
