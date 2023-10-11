import React, { useState } from "react";
import { Wrapper, InitialForm, Header, Footer } from "../components";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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

  const handleBackButton = () => {
    navigate(-1);
  };
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
          <h3 className="text-center fw-bold">Manage Account Details</h3>
          <hr />
          <h5 className="text-center text-secondary">Change Your Name</h5>
          <div className="px-sm-4">
            <div className="d-flex gap-3 mb-5">
              <TextField
                variant="outlined"
                type="text"
                label="First Name"
                fullWidth
                className="mt-4"
                name="firstname"
                defaultValue={data.user.userId.firstname}
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
                fullWidth
                className="mt-4"
                name="lastname"
                defaultValue={data.user.userId.lastname}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Button fullWidth variant="contained">
              Change Name
            </Button>
          </div>
          <hr />
          <h5 className="text-center text-secondary">Change Your Password</h5>
          <div className="px-sm-4">
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
                      onClick={() => handleClickShowPassword("connewpassword")}
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
            />
            <Button fullWidth variant="contained">
              Change Password
            </Button>
          </div>
        </InitialForm>
      </div>
      <Footer />
    </Wrapper>
  );
};

export default ManageAccountPage;
