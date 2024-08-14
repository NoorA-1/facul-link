import React, { createContext, useContext, useState } from "react";
import { AdminBigSidebar, AdminSmallSidebar, Header } from "../../components";
import { NavLink, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import {
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  Avatar,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import http from "../../utils/http";
import { useCookies } from "react-cookie";

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

const AdminDashboardLayout = () => {
  const navigate = useNavigate();

  const userData = useLoaderData();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("xl"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const buttonSize = isSmallScreen ? "small" : "medium";
  const [anchorEl, setAnchorEl] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignOut = async () => {
    try {
      navigate("/");

      const { data } = await http.get("/auth/sign-out");
      console.log(data);
      removeCookie("token", { path: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardContext.Provider value={{ userData }}>
      <div className="sign-up-bg">
        <Header homeDisabled={true}>
          {isSmallScreen && (
            <IconButton
              color="inherit"
              onClick={toggleSidebar}
              className="order-first"
            >
              <MenuIcon />
            </IconButton>
          )}
          <div className="d-flex align-items-center gap-3">
            <Avatar sx={{ border: "2px solid #0a9396" }}>{`A`}</Avatar>
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
              {userData.user.firstname}
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
            <AdminSmallSidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          ) : (
            <div className="col-2 admin-sidebar sidebar">
              <AdminBigSidebar />
            </div>
          )}
          <div
            className="col-12 col-xl-10 px-lg-5 ps-5 py-4 dashboard-page"
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

export default AdminDashboardLayout;
