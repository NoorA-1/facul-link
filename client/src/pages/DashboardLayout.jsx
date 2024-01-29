import React, { createContext, useContext, useEffect, useState } from "react";
import { BigSidebar, Header } from "../components";
import { NavLink, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { Button, Menu, MenuItem, useMediaQuery, Avatar } from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import http from "../utils/http";

const DashboardContext = createContext();

export const loader = async () => {
  try {
    const { data } = await http.get("/users/current-user");
    return data;
  } catch (error) {
    return null;
  }
};

const DashboardLayout = () => {
  const userData = useLoaderData();
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("xl"));
  const buttonSize = isSmallScreen ? "small" : "medium";
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
  useEffect(() => {
    console.log(userData);
  }, []);

  const serverURL = "http://localhost:3000/";
  const profileImage = Boolean(userData.user.profileImage)
    ? serverURL + userData.user.profileImage?.split("public\\")[1]
    : null;

  return (
    <DashboardContext.Provider value={{ userData }}>
      <div className="sign-up-bg">
        <Header homeDisabled={true}>
          <div className="d-flex align-items-center gap-3">
            <Avatar src={profileImage} sx={{ border: "2px solid #0a9396" }}>
              {`${userData.user.userId.firstname[0]} ${userData.user.userId.lastname[0]}`}
            </Avatar>
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
              {userData.user.userId.firstname}
            </Button>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <NavLink
              to="manage-account"
              style={{ color: "unset", textDecoration: "unset" }}
              end
            >
              <MenuItem>Manage Account Details</MenuItem>
            </NavLink>

            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Header>
        <div className="row w-100">
          <div className="col-2 sidebar">
            <BigSidebar />
          </div>
          <div
            className="col-10 px-5 py-4 dashboard-page"
            // style={{ overflowY: "auto" }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
