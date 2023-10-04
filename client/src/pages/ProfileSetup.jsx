import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import http from "../utils/http";
import { Wrapper, Header } from "../components";

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
    <Wrapper>
      <Header>
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
          <MenuItem onClick={handleClose}>Manage Account Details</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </Header>
      <h1 className="mt-5 text-center fw-bold">Complete Your Profile</h1>
    </Wrapper>
  );
};

export default ProfileSetup;
