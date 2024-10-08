import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
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
  Badge,
  Avatar,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import http from "../utils/http";
import { io } from "socket.io-client";
import { serverURL } from "../utils/formData";
import { useCookies } from "react-cookie";
const DashboardContext = createContext();

export const loader = async () => {
  try {
    const { data: userData } = await http.get("/users/current-user");
    const { data: notificationsData } = await http.get("/users/notifications");

    const data = {
      userData,
      notificationsData,
    };

    return data;
  } catch (error) {
    const { data } = await http.get("/auth/sign-out");
    // console.log(error);

    return null;
  }
};

const DashboardLayout = () => {
  const loaderData = useLoaderData();
  const [userData, setUserData] = useState(loaderData.userData);
  const [notifications, setNotifications] = useState(
    Boolean(loaderData.notificationsData) ? loaderData.notificationsData : []
  );
  const [isTestMode, setIsTestMode] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("xl"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const buttonSize = isSmallScreen ? "small" : "medium";
  const [anchorEl, setAnchorEl] = useState(null);
  const initialized = useRef(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // if (!initialized.current) {
    //   initialized.current = true;
    if (userData) {
      const socket = io(import.meta.env.VITE_BACKENDURL, {
        query: { userId: userData.user.userId._id },
      });

      socket.on("notifyUser", (data) => {
        setNotifications((prev) => [...prev, data.data]);
      });

      socket.on("updateNotification", (updatedNotification) => {
        const newNotification = updatedNotification.notification;
        setNotifications((prev) =>
          prev.map((e) => (e._id === newNotification._id ? newNotification : e))
        );
      });

      socket.on("error", (error) => {
        console.error("WebSocket Error:", error);
      });
    }
    // }
  }, [userData]);

  // socket.on("connection", () => {
  //   console.log("Connected to server");
  // });

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
      removeCookie("token", { path: "/" });
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
      value={{
        userData,
        setUserData,
        isTestMode,
        setIsTestMode,
        notifications,
        setNotifications,
      }}
    >
      <div className="sign-up-bg">
        <Header homeDisabled={true} isTestMode={isTestMode}>
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
            {userData.user.userId.role === "teacher" && !isTestMode && (
              <IconButton onClick={() => navigate("/dashboard/notifications")}>
                <Badge
                  badgeContent={
                    notifications.filter(
                      (notification) => !notification.isMarkedRead
                    ).length
                  }
                  color="error"
                >
                  <NotificationsOutlinedIcon />
                </Badge>
              </IconButton>
            )}
            <Avatar src={profileImage} sx={{ border: "2px solid #0a9396" }}>
              {`${userData.user.userId.firstname[0]} ${userData.user.userId.lastname[0]}`}
            </Avatar>
            <Button
              id="basic-button"
              onClick={handleClick}
              variant="contained"
              sx={{
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
              endIcon={<KeyboardArrowDownOutlinedIcon />}
              size={buttonSize}
              disabled={isTestMode}
            >
              {userData.user.userId.firstname}
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <NavLink
                to="manage-account"
                style={{ color: "unset", textDecoration: "unset" }}
                end
              >
                <MenuItem>Manage Account Details</MenuItem>
              </NavLink>

              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
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
