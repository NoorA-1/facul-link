import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import adminLinks from "../utils/adminLinks";
import { Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import http from "../utils/http";
import { useDashboardContext } from "../pages/AdminDashboardLayout";

const AdminBigSidebar = () => {
  const { userData } = useDashboardContext();
  const links = adminLinks;
  return (
    <div className="mt-5" style={{ position: "relative" }}>
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
  );
};

export default AdminBigSidebar;
