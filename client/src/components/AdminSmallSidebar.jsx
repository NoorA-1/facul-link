import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import adminLinks from "../utils/adminLinks";
import { Button, Drawer, IconButton } from "@mui/material";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import http from "../utils/http";
import { useDashboardContext } from "../pages/admin/AdminDashboardLayout";

const AdminSmallSidebar = ({ open, onClose }) => {
  const { userData } = useDashboardContext();
  const links = adminLinks;
  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: "transparent",
        },
      }}
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <div
        className="py-5 pe-3 admin-sidebar sidebar-100"
        style={{ position: "relative" }}
      >
        <div className="d-flex justify-content-end">
          <IconButton style={{ color: "white" }} onClick={onClose}>
            {<ChevronLeftIcon />}
          </IconButton>
        </div>
        {links.map((link) => {
          const { text, path, icon } = link;
          return (
            <NavLink to={path} key={text} className="d-block mb-5" end>
              <Button
                variant="text"
                startIcon={icon}
                size="large"
                fullWidth
                sx={{
                  textAlign: "left",
                  fontSize: "1.1em",
                  color: "#FFFF",
                  textTransform: "capitalize",
                  justifyContent: "flex-start",
                  paddingLeft: "30px",
                  ":hover": {
                    backgroundColor: "secondary.main",
                    borderBottomLeftRadius: 0,
                    borderTopLeftRadius: 0,
                  },
                }}
                disableRipple
                onClick={onClose}
              >
                {text}
              </Button>
            </NavLink>
          );
        })}
        {/* <Button
        variant="text"
        startIcon={<LogoutOutlinedIcon />}
        size="large"
        fullWidth
        sx={{
          marginTop: "10rem",
          textAlign: "left",
          fontSize: "1.1em",
          color: "#FFFF",
          textTransform: "capitalize",
          justifyContent: "flex-start",
          paddingLeft: "30px",
          ":hover": {
            backgroundColor: "secondary.main",
          },
        }}
        disableRipple
        onClick={handleSignOut}
      >
        Sign Out
      </Button> */}
      </div>
    </Drawer>
  );
};

export default AdminSmallSidebar;
