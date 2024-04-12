import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { Button, Menu, MenuItem, useMediaQuery } from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import http from "../utils/http";
import {
  Wrapper,
  Header,
  TeacherProfileSetupForm,
  EmployerProfileSetupForm,
} from "../components";

export const loader = async () => {
  try {
    const { data } = await http.get("/users/current-user");
    return data;
  } catch (error) {
    // console.log(error);
    // return redirect("/");

    return null;
  }
};

const ProfileSetup = () => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("xl"));
  const buttonSize = isSmallScreen ? "small" : "medium";
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log(data);
    if (data && data.user.userId.isProfileSetup) {
      // navigate route here
      navigate("/dashboard");
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      navigate("/");

      const { data } = await http.get("/auth/sign-out");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border m-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Wrapper>
      <Header>
        <h4
          className="mt-2 me-3 text-center fw-bold"
          style={{ marginLeft: -150 }}
        >
          {!isSmallScreen && "Complete Your Profile"}
        </h4>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="contained"
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
          }}
          endIcon={<KeyboardArrowDownOutlinedIcon />}
          size={buttonSize}
        >
          Hi, {data.user.userId.firstname}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <Link
            to="/manage-account"
            style={{ color: "unset", textDecoration: "unset" }}
          >
            <MenuItem>Manage Account Details</MenuItem>
          </Link>

          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </Header>
      <h4 className="mt-3 text-center fw-bold">
        {isSmallScreen && "Complete Your Profile"}
      </h4>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-12">
            {data.user.userId.role === "teacher" ? (
              <TeacherProfileSetupForm userData={data.user} />
            ) : (
              data.user.userId.role === "employer" && (
                <EmployerProfileSetupForm userData={data.user} />
              )
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProfileSetup;
