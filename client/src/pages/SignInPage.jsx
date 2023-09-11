import React from "react";
import { FormWrapper, InitialForm } from "../components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SignIn = () => {
  return (
    <FormWrapper>
      <InitialForm>
        <h3 className="text-center fw-bold text-uppercase mt-2">Sign In</h3>
        <hr />
        <form>
          <div className="px-5">
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
            />
            <Button variant="contained" fullWidth className="my-5">
              Sign In
            </Button>
          </div>
        </form>
      </InitialForm>
    </FormWrapper>
  );
};

export default SignIn;
