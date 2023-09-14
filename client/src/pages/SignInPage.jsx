import React from "react";
import { FormWrapper, InitialForm } from "../components";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { signInValidationSchema } from "../schemas";

const initialValues = {
  email: "",
  password: "",
};

const SignIn = () => {
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: signInValidationSchema,
      onSubmit: (values) => {
        console.log(values);
      },
    });
  return (
    <FormWrapper>
      <InitialForm>
        <h3 className="text-center fw-bold text-uppercase mt-2">Sign In</h3>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="px-5">
            <TextField
              variant="outlined"
              type="email"
              label="Email"
              name="email"
              fullWidth
              className="my-4"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              helperText={
                Boolean(errors.email) && Boolean(touched.email) && errors.email
              }
              error={Boolean(touched.email) && Boolean(errors.email)}
            />
            <TextField
              variant="outlined"
              type="password"
              label="Password"
              name="password"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              helperText={
                Boolean(errors.password) &&
                Boolean(touched.password) &&
                errors.password
              }
              error={Boolean(touched.password) && Boolean(errors.password)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="my-5"
            >
              Sign In
            </Button>
            <p className="text-center">
              Don't have an Account?{" "}
              <Link to="/sign-up" className="project-name">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </InitialForm>
    </FormWrapper>
  );
};

export default SignIn;
