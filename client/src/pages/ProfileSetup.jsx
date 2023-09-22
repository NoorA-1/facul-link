import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import http from "../utils/http";

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
  useEffect(() => {
    console.log(data);
    if (data && data.user.userId.isProfileSetup) {
      // navigate route here
    }
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

  return (
    <div className="vh-100">
      <nav className="mb-md-5">
        <div className="p-4 d-flex justify-content-end">
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            variant="contained"
            sx={{
              textTransform: "capitalize",
            }}
            endIcon={<KeyboardArrowDownOutlinedIcon />}
          >
            My Account
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
            <MenuItem onClick={handleClose}>Manage Account Details</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </div>
      </nav>
      <h1 className="text-center">Setup Profile</h1>
    </div>
  );
};

export default ProfileSetup;
