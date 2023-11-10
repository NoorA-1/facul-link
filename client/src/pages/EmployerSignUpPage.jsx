import React, { useState } from "react";
import { Wrapper, InitialForm, Header, Footer } from "../components";
import { Button, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { employerSignUpValidationSchema } from "../schemas";

import http from "../utils/http";

const initialValues = {
  firstname: "",
  lastname: "",
  gender: "male",
  universityname: "",
  departmentname: "",
  email: "",
  password: "",
  conpassword: "",
};

const EmployerSignUpPage = () => {
  const navigate = useNavigate();
  const [alertError, setAlertError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    conpassword: false,
  });
  const handleClickShowPassword = (name) => {
    setShowPassword((prev) => {
      return { ...prev, [name]: !prev[name] };
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitSignUpData = async (data, actions) => {
    try {
      await http.post("/auth/sign-up", data);
      console.log(data);
      setAlertError("");
      setIsSuccess(true);
      actions.resetForm();
      setTimeout(() => {
        navigate("/sign-in");
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
      validationSchema: employerSignUpValidationSchema,
      onSubmit: (values, actions) => {
        const trimmedValues = {
          ...values,
          firstname: values.firstname.trim(),
          lastname: values.lastname.trim(),
        };
        console.log(trimmedValues);

        const role = "employer";
        submitSignUpData({ ...trimmedValues, role }, actions);
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
          Sign Up Successful
        </Alert>
      );
    }
  };

  return (
    <Wrapper>
      <Header>
        <div>
          <Link to="/sign-up">
            <Button
              size="large"
              variant="contained"
              sx={{
                marginRight: "1.25rem",
                // color: "#FFF",
                // backgroundColor: "primary.main",
                textTransform: "capitalize",
                fontWeight: "bold",
                // border: 2,
                // ":hover": {
                //   border: 2,
                // },
              }}
              startIcon={<ArrowBackOutlinedIcon />}
            >
              Account Type
            </Button>
          </Link>
          <Link to="/sign-in">
            <Button
              variant="outlined"
              size="large"
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
        style={{ height: "90%" }}
        className="mt-5 d-flex align-items-center justify-content-center mb-5 py-3"
      >
        <InitialForm>
          <h3 className="text-center fw-bold text-uppercase mt-2">
            Sign Up as Employer
          </h3>
          <hr />
          <MessageBox />
          <form onSubmit={handleSubmit}>
            <div className="px-sm-3">
              <div className="d-flex gap-3">
                <TextField
                  variant="outlined"
                  type="text"
                  label="First Name"
                  className="mt-4 w-100"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="firstname"
                  value={values.firstname}
                  helperText={
                    Boolean(errors.firstname) &&
                    Boolean(touched.firstname) &&
                    errors.firstname
                  }
                  error={
                    Boolean(touched.firstname) && Boolean(errors.firstname)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  variant="outlined"
                  type="text"
                  label="Last Name"
                  className="mt-4 w-100"
                  name="lastname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastname}
                  helperText={
                    Boolean(errors.lastname) &&
                    Boolean(touched.lastname) &&
                    errors.lastname
                  }
                  error={Boolean(touched.lastname) && Boolean(errors.lastname)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <FormLabel className="mt-3" id="radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                aria-labelledby="radio-buttons-group-label"
                defaultValue="male"
                name="gender"
                row
                onChange={handleChange}
                value={values.gender}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
              <TextField
                variant="outlined"
                type="text"
                label="University Name"
                fullWidth
                className="mt-4 mb-3"
                name="universityname"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.universityname}
                helperText={
                  Boolean(errors.universityname) &&
                  Boolean(touched.universityname) &&
                  errors.universityname
                }
                error={
                  Boolean(touched.universityname) &&
                  Boolean(errors.universityname)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BusinessOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                variant="outlined"
                label="Department"
                fullWidth
                className="mb-3"
                name="departmentname"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.departmentname}
                helperText={
                  Boolean(errors.departmentname) &&
                  Boolean(touched.departmentname) &&
                  errors.departmentname
                }
                error={
                  Boolean(touched.departmentname) &&
                  Boolean(errors.departmentname)
                }
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment position="end">
                //       <BusinessOutlinedIcon />
                //     </InputAdornment>
                //   ),
                // }}
              >
                <MenuItem value={"Computer Science"}>Computer Science</MenuItem>
                <MenuItem value={"Media Science"}>Media Science</MenuItem>
                <MenuItem value={"Management Science"}>
                  Management Science
                </MenuItem>
                <MenuItem value={"Engineering"}>Engineering</MenuItem>
              </TextField>
              <TextField
                variant="outlined"
                type="email"
                label="Email"
                fullWidth
                className="mb-3"
                name="email"
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
                type={showPassword.password ? "text" : "password"}
                label="Password"
                fullWidth
                className="mb-3"
                name="password"
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
                        onClick={() => handleClickShowPassword("password")}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword.password ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant="outlined"
                type={showPassword.conpassword ? "text" : "password"}
                label="Confirm Password"
                fullWidth
                name="conpassword"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.conpassword}
                helperText={
                  Boolean(errors.conpassword) &&
                  Boolean(touched.conpassword) &&
                  errors.conpassword
                }
                error={
                  Boolean(touched.conpassword) && Boolean(errors.conpassword)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("conpassword")}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword.conpassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="mt-5 mb-4"
                disabled={isSuccess}
              >
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
      </div>
      <Footer />
    </Wrapper>
  );
};

export default EmployerSignUpPage;
