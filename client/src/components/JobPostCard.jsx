import React from "react";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
const JobPostCard = ({ title, universityName, location }) => {
  return (
    <div className="bg-light-gray border border-dark-subtle rounded shadow-sm px-5 mb-3">
      <h5 className="fw-bold mt-2" style={{ color: "#084C61" }}>
        {title}
      </h5>
      <div className="d-flex gap-5">
        <div className="d-flex align-items-center gap-2">
          <CorporateFareOutlinedIcon fontSize="small" className="mb-3" />
          <p className="fw-bold">{universityName}</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <LocationOnOutlinedIcon fontSize="small" className="mb-3" />
          <p className="fw-bold">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default JobPostCard;
