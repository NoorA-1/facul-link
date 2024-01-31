import React from "react";
import { NavLink } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Button } from "@mui/material";

const HiringTests = () => {
  return (
    <div className="my-3">
      <div className="d-flex justify-content-between">
        <h1>Hiring Tests</h1>
        <NavLink
          to="add"
          style={{ color: "unset", textDecoration: "unset" }}
          end
        >
          <Button variant="contained" startIcon={<AddOutlinedIcon />}>
            Add Test
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default HiringTests;
