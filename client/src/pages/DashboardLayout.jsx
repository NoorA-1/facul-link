import React, { createContext, useContext, useEffect, useState } from "react";
import { BigSidebar, SmallSidebar, Header } from "../components";
import {
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  Link,
} from "react-router-dom";
import {
  Button,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import http from "../utils/http";

const DashboardContext = createContext();

export const loader = async () => {
  try {
    const { data } = await http.get("/users/current-user");
    return data;
  } catch (error) {
    const { data } = await http.get("/auth/sign-out");

    return null;
  }
};

const DashboardLayout = () => {
  const userLoaderData = useLoaderData();
  const [userData, setUserData] = useState(userLoaderData);
  const [isTestMode, setIsTestMode] = useState(false);
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("xl"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // useEffect(() => {
  //   console.log(userData);
  // }, []);

  useEffect(() => {
    if (!userData.user.userId.isProfileSetup) {
      navigate("/profile-setup");
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const serverURL = "http://localhost:3000/";
  const profileImage = Boolean(userData.user.profileImage)
    ? serverURL + userData.user.profileImage?.split("public\\")[1]
    : null;

  if (
    userData.user.userId.role === "employer" &&
    userData.user.status === "pending"
  ) {
    return (
      <div className="min-vh-100 sign-up-bg">
        <Header homeDisabled={true}>
          <Button
            onClick={handleClick}
            variant="contained"
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
            endIcon={<KeyboardArrowDownOutlinedIcon />}
            size={buttonSize}
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
            <Link
              to="/manage-account"
              style={{ color: "unset", textDecoration: "unset" }}
            >
              <MenuItem>Manage Account Details</MenuItem>
            </Link>

            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Header>
        <div
          style={{ height: "90vh" }}
          className="d-flex flex-column align-items-center justify-content-center gap-2"
        >
          <PendingOutlinedIcon color="warning" sx={{ fontSize: "4em" }} />
          <h4>Your account is currently under verification.</h4>
        </div>
      </div>
    );
  } else if (
    userData.user.userId.role === "employer" &&
    userData.user.status === "rejected"
  ) {
    return (
      <div className="min-vh-100 sign-up-bg">
        <Header homeDisabled={true}>
          <Button
            onClick={handleClick}
            variant="contained"
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
            endIcon={<KeyboardArrowDownOutlinedIcon />}
            size={buttonSize}
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
            <Link
              to="/manage-account"
              style={{ color: "unset", textDecoration: "unset" }}
            >
              <MenuItem>Manage Account Details</MenuItem>
            </Link>

            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Header>
        <div
          style={{ height: "90vh" }}
          className="d-flex flex-column align-items-center justify-content-center gap-2"
        >
          <BlockOutlinedIcon color="danger" sx={{ fontSize: "4em" }} />
          <h4>Your account is suspended.</h4>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider
      value={{ userData, setUserData, isTestMode, setIsTestMode }}
    >
      <div className="sign-up-bg">
        <Header homeDisabled={true}>
          {isSmallScreen && (
            <IconButton
              color="inherit"
              // edge="start"
              onClick={toggleSidebar}
              className="order-first"
            >
              <MenuIcon />
            </IconButton>
          )}
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
          {isSmallScreen ? (
            <SmallSidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          ) : (
            <div className={`col-2 sidebar ${isTestMode ? "d-none" : ""}`}>
              <BigSidebar />
            </div>
          )}
          <div
            className={`col-12 col-xl-10 px-lg-5 ps-5 py-4 ${
              isTestMode ? "col-xl-12 dashboard-page" : "dashboard-page"
            }`}
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
