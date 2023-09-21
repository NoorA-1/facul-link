import React, { useState } from "react";
import { FormWrapper, InitialForm } from "../components";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useFormik } from "formik";
import { signInValidationSchema } from "../schemas";
import http from "../utils/http";

const initialValues = {
  email: "",
  password: "",
};

const SignIn = () => {
  const navigate = useNavigate();
  const [alertError, setAlertError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const submitSignInData = async (data, actions) => {
    try {
      await http.post("/auth/sign-in", data);
      console.log(data);
      setAlertError("");
      setIsSuccess(true);
      actions.resetForm();
      setTimeout(() => {
        navigate("/profile-setup");
      }, 1000);
    } catch (error) {
      const { message } = error.response.data;
      setAlertError(message);
      console.log(error);
    }
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: signInValidationSchema,
      // validateOnChange: false,
      // validateOnBlur: false,
      onSubmit: (values, actions) => {
        console.log(values);
        submitSignInData(values, actions);
      },
    });

  const MessageBox = () => {
    if (alertError) {
      return (
        <Alert variant="filled" severity="error">
          {alertError}
        </Alert>
      );
    }
    if (isSuccess) {
      return (
        <Alert variant="filled" severity="success">
          Sign In Successful
        </Alert>
      );
    }
  };

  return (
    <FormWrapper>
      <InitialForm>
        <h3 className="text-center fw-bold text-uppercase mt-2">Sign In</h3>
        <hr />
        <MessageBox />
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
              disabled={isSuccess}
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
