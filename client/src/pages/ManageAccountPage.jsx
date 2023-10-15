import React, { useState } from "react";
import { Wrapper, InitialForm, Header, Footer } from "../components";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useFormik } from "formik";
import {
  changeNameValidationSchema,
  changePasswordValidationSchema,
} from "../schemas";
import http from "../utils/http";

export const loader = async () => {
  try {
    const { data } = await http.get("/users/current-user");
    return data;
  } catch (error) {
    return null;
  }
};

const ManageAccountPage = () => {
  const data = useLoaderData();
  const navigate = useNavigate();

  const nameFormInitialValues = {
    firstname: data.user.userId.firstname,
    lastname: data.user.userId.lastname,
  };

  const passwordFormInitialValues = {
    oldpassword: "",
    newpassword: "",
    connewpassword: "",
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  const [listSelect, setListSelect] = useState("");

  const handleListSelect = (event) => {
    setListSelect(event.target.value);
  };

  const ChangeNameLayout = () => {
    const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
      useFormik({
        initialValues: nameFormInitialValues,
        validationSchema: changeNameValidationSchema,
        onSubmit: (values) => {
          console.log(values);
        },
      });

    if (listSelect === 0) {
      return (
        <>
          <hr />
          <h5 className="text-center text-secondary">Change Your Name</h5>
          <div className="px-sm-4">
            <form onSubmit={handleSubmit}>
              <div className="d-flex gap-3 mb-5">
                <TextField
                  variant="outlined"
                  type="text"
                  label="First Name"
                  fullWidth
                  className="mt-4"
                  name="firstname"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstname}
                  helperText={
                    Boolean(errors.firstname) &&
                    Boolean(touched.firstname) &&
                    errors.firstname
                  }
                  error={
                    Boolean(touched.firstname) && Boolean(errors.firstname)
                  }
                />
                <TextField
                  variant="outlined"
                  type="text"
                  label="Last Name"
                  fullWidth
                  className="mt-4"
                  name="lastname"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastname}
                  helperText={
                    Boolean(errors.lastname) &&
                    Boolean(touched.lastname) &&
                    errors.lastname
                  }
                  error={Boolean(touched.lastname) && Boolean(errors.lastname)}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="mb-3"
              >
                Change Name
              </Button>
            </form>
          </div>
        </>
      );
    }
    return null;
  };

  const ChangePasswordLayout = () => {
    const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
      useFormik({
        initialValues: passwordFormInitialValues,
        validationSchema: changePasswordValidationSchema,
        onSubmit: (values) => {
          console.log(values);
        },
      });

    if (listSelect === 1) {
      const [showPassword, setShowPassword] = useState({
        oldpassword: false,
        newpassword: false,
        connewpassword: false,
      });
      const handleClickShowPassword = (name) => {
        setShowPassword((prev) => {
          return { ...prev, [name]: !prev[name] };
        });
      };
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
      return (
        <>
          <hr />
          <h5 className="text-center text-secondary">Change Your Password</h5>
          <div className="px-sm-4">
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                type={showPassword.oldpassword ? "text" : "password"}
                label="Old Password"
                fullWidth
                name="oldpassword"
                className="mt-3"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("oldpassword")}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword.oldpassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.oldpassword}
                helperText={
                  Boolean(errors.oldpassword) &&
                  Boolean(touched.oldpassword) &&
                  errors.oldpassword
                }
                error={
                  Boolean(touched.oldpassword) && Boolean(errors.oldpassword)
                }
              />
              <TextField
                variant="outlined"
                type={showPassword.newpassword ? "text" : "password"}
                label="New Password"
                fullWidth
                name="newpassword"
                className="mt-3"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("newpassword")}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword.newpassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.newpassword}
                helperText={
                  Boolean(errors.newpassword) &&
                  Boolean(touched.newpassword) &&
                  errors.newpassword
                }
                error={
                  Boolean(touched.newpassword) && Boolean(errors.newpassword)
                }
              />
              <TextField
                variant="outlined"
                type={showPassword.connewpassword ? "text" : "password"}
                label="Confirm New Password"
                fullWidth
                name="connewpassword"
                className="mt-3 mb-5"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          handleClickShowPassword("connewpassword")
                        }
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword.connewpassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.connewpassword}
                helperText={
                  Boolean(errors.connewpassword) &&
                  Boolean(touched.connewpassword) &&
                  errors.connewpassword
                }
                error={
                  Boolean(touched.connewpassword) &&
                  Boolean(errors.connewpassword)
                }
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                className="mb-3"
              >
                Change Password
              </Button>
            </form>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <Wrapper>
      <Header></Header>
      <div
        style={{ height: "90vh" }}
        className="d-flex align-items-center justify-content-center mb-4"
      >
        <InitialForm>
          <Button
            variant="outlined"
            sx={{ border: 2, ":hover": { border: 2 } }}
            className="my-3"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={handleBackButton}
          >
            Back
          </Button>
          <h3 className="text-center fw-bold mb-4">Manage Account Details</h3>
          <TextField
            select
            fullWidth
            value={listSelect}
            label="Select Option"
            onChange={handleListSelect}
            className="mb-3"
          >
            <MenuItem value={0}>Change Name</MenuItem>
            <MenuItem value={1}>Change Password</MenuItem>
          </TextField>
          <ChangeNameLayout />
          <ChangePasswordLayout />
        </InitialForm>
      </div>
      <Footer />
    </Wrapper>
  );
};

export default ManageAccountPage;
