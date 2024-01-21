import React, { useEffect, useState } from "react";
import { Wrapper, InitialForm, Header, Footer } from "../components";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Alert,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import { useFormik } from "formik";
import {
  changeEmailValidationSchema,
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

const ManageAccountPage = ({
  headerDisabled,
  footerDisabled,
  backBtnDisabled,
}) => {
  let data = useLoaderData();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(
    data.user?.role === "admin" ? data.user : data.user.userId
  );
  const [passwordData, setPasswordData] = useState({
    currentpassword: "",
    newpassword: "",
    connewpassword: "",
  });

  //error type 0 for no error, 1 for error and 2 for no changes error
  const [alertMessage, setAlertMessage] = useState({
    message: "",
    error: null,
  });

  const emailFormInitialValues = {
    email: userData.email,
  };

  const passwordFormInitialValues = {
    currentpassword: passwordData.currentpassword,
    newpassword: passwordData.newpassword,
    connewpassword: passwordData.connewpassword,
  };
  const handleBackButton = () => {
    navigate("/profile-setup");
  };

  const [listSelect, setListSelect] = useState("");

  const handleListSelect = (event) => {
    setListSelect(event.target.value);
    setAlertMessage({
      message: "",
      error: null,
    });
  };

  const ChangeEmailLayout = () => {
    const submitChangeEmailData = async (data) => {
      try {
        const response = await http.put("/users/change-email", data);
        console.log(response);
        if (response.status === 200) {
          setAlertMessage(() => {
            return {
              message: response.data.message,
              error: 0,
            };
          });
          setUserData((prev) => {
            return {
              email: data.email,
            };
          });
        }
      } catch (error) {
        setUserData((prev) => {
          return {
            email: data.email,
          };
        });
        if (error.response.status === 304) {
          setAlertMessage(() => {
            return {
              message: "New email provided is same as old email.",
              error: 2,
            };
          });
        } else if (error.response.status === 400) {
          setAlertMessage(() => {
            return {
              message: "User with this email already exists.",
              error: 1,
            };
          });
        }
        console.log(error);
      }
    };

    const {
      values,
      handleBlur,
      handleChange,
      handleSubmit,
      errors,
      touched,
      resetForm,
    } = useFormik({
      initialValues: emailFormInitialValues,
      validationSchema: changeEmailValidationSchema,
      onSubmit: (values) => {
        submitChangeEmailData(values);
      },
    });

    useEffect(() => {
      resetForm();
    }, [userData]);

    if (listSelect === 0) {
      return (
        <>
          <hr />
          <h5 className="text-center text-secondary">Change Your Email</h5>
          <div className="px-sm-4">
            <form onSubmit={handleSubmit}>
              <div className="d-flex gap-3 mb-5">
                <TextField
                  variant="outlined"
                  type="email"
                  label="Email"
                  fullWidth
                  className="mt-4"
                  name="email"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  helperText={
                    Boolean(errors.email) &&
                    Boolean(touched.email) &&
                    errors.email
                  }
                  error={Boolean(touched.email) && Boolean(errors.email)}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="mb-3"
              >
                Change Email
              </Button>
            </form>
          </div>
        </>
      );
    }
    return null;
  };

  const ChangePasswordLayout = () => {
    if (listSelect === 1) {
      const [showPassword, setShowPassword] = useState({
        currentpassword: false,
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

      const SubmitChangePasswordData = async (data) => {
        try {
          const response = await http.put("/users/change-password", data);
          if (response.status === 200) {
            setAlertMessage(() => {
              return {
                message: response.data.message,
                error: 0,
              };
            });

            setPasswordData(() => {
              return {
                currentpassword: "",
                newpassword: "",
                connewpassword: "",
              };
            });
          }
        } catch (error) {
          console.log(error);
          setPasswordData((prev) => {
            return {
              ...prev,
              currentpassword: data.currentpassword,
              newpassword: data.newpassword,
              connewpassword: data.connewpassword,
            };
          });
          setAlertMessage(() => {
            return {
              message: error.response.data.message,
              error: 1,
            };
          });
        }
      };

      const {
        values,
        handleBlur,
        handleChange,
        handleSubmit,
        errors,
        touched,
        resetForm,
      } = useFormik({
        initialValues: passwordFormInitialValues,
        validationSchema: changePasswordValidationSchema,
        onSubmit: (values) => {
          SubmitChangePasswordData(values);
        },
      });

      useEffect(() => {
        resetForm();
      }, [passwordData]);

      return (
        <>
          <hr />
          <h5 className="text-center text-secondary">Change Your Password</h5>
          <div className="px-sm-4">
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                type={showPassword.currentpassword ? "text" : "password"}
                label="Current Password"
                fullWidth
                name="currentpassword"
                className="mt-3"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          handleClickShowPassword("currentpassword")
                        }
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword.currentpassword ? (
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
                value={values.currentpassword}
                helperText={
                  Boolean(errors.currentpassword) &&
                  Boolean(touched.currentpassword) &&
                  errors.currentpassword
                }
                error={
                  Boolean(touched.currentpassword) &&
                  Boolean(errors.currentpassword)
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

  const MessageBox = () => {
    if (alertMessage.error === 0) {
      return (
        <Alert variant="filled" severity="success">
          {alertMessage.message}
        </Alert>
      );
    } else if (alertMessage.error === 1) {
      return (
        <Alert variant="filled" severity="error">
          {alertMessage.message}
        </Alert>
      );
    } else if (alertMessage.error === 2) {
      return (
        <Alert variant="filled" severity="info">
          {alertMessage.message}
        </Alert>
      );
    }
  };

  return (
    <Wrapper>
      {!headerDisabled && <Header></Header>}
      <div
        style={{ height: "90vh" }}
        className="d-flex align-items-center justify-content-center mb-4"
      >
        <InitialForm>
          {!backBtnDisabled && (
            <Button
              variant="outlined"
              sx={{ border: 2, ":hover": { border: 2 } }}
              className="my-3"
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={handleBackButton}
            >
              Back
            </Button>
          )}
          <h3 className="text-center fw-bold mb-4">Manage Account Details</h3>
          <TextField
            select
            fullWidth
            value={listSelect}
            label="Select Option"
            onChange={handleListSelect}
            className="mb-3"
          >
            <MenuItem value={0}>Change Email</MenuItem>
            <MenuItem value={1}>Change Password</MenuItem>
          </TextField>
          <MessageBox />
          <ChangeEmailLayout />
          <ChangePasswordLayout />
        </InitialForm>
      </div>
      {!footerDisabled && <Footer />}
    </Wrapper>
  );
};

export default ManageAccountPage;
