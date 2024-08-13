import React, { useState } from "react";
import { Wrapper, InitialForm, Header, Footer } from "../components";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useFormik } from "formik";
import { signInValidationSchema } from "../schemas";
import http from "../utils/http";

const initialValues = {
  email: "",
  password: "",
};

const SignInPage = () => {
  const navigate = useNavigate();
  const [alertError, setAlertError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode(token);
    setToken({
      token: token,
      role: decodedToken.role,
    });
  };

  const submitSignInData = async (data, actions) => {
    try {
      const { data: responseData } = await http.post("/auth/sign-in", data);
      // console.log(responseData);
      setAlertError("");
      setIsSuccess(true);
      actions.resetForm();
      handleToken(responseData.token);
      setTimeout(() => {
        if (responseData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          if (responseData.isProfileSetup === true) {
            navigate("/dashboard");
          } else {
            navigate("/profile-setup");
          }
        }
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
    <Wrapper>
      <Header>
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
      </Header>
      <div
        style={{ height: "90vh" }}
        className="d-flex align-items-center justify-content-center mb-4"
      >
        <InitialForm>
          <h3 className="text-center fw-bold text-uppercase mt-2">Sign In</h3>
          <hr />
          <MessageBox />
          <form onSubmit={handleSubmit}>
            <div className="px-sm-4">
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
                  Boolean(errors.email) &&
                  Boolean(touched.email) &&
                  errors.email
                }
                error={Boolean(touched.email) && Boolean(errors.email)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant="outlined"
                type={showPassword ? "text" : "password"}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="my-5"
                disabled={isSuccess}
              >
                {isSuccess ? (
                  <div className="spinner-border" role="status"></div>
                ) : (
                  "Sign In"
                )}
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
      </div>
      <Footer />
    </Wrapper>
  );
};

export default SignInPage;
