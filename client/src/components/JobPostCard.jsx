import React from "react";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Avatar from "@mui/material/Avatar";
const JobPostCard = ({
  logo,
  title,
  universityName,
  location,
  postedDate,
  endDate,
}) => {
  return (
    <div className="bg-light-gray border border-dark-subtle rounded shadow-sm ps-2 px-5 mb-3 d-flex align-items-center ">
      <div className="">
        <Avatar
          src={logo}
          variant="rounded"
          sx={{ height: "80px", width: "auto" }}
          className="me-3"
        >
          {universityName[0]}
        </Avatar>
      </div>
      <div className="">
        <h5 className="fw-bold mt-2" style={{ color: "#084C61" }}>
          {title}
        </h5>
        <div className="d-flex gap-5">
          <div className="d-flex align-items-center gap-2">
            <CorporateFareOutlinedIcon fontSize="small" />
            <p className="fw-bold m-0">{universityName}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <LocationOnOutlinedIcon fontSize="small" />
            <p className="fw-bold m-0">{location}</p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 mt-1 mb-2">
          <CalendarMonthOutlinedIcon fontSize="small" />
          <p
            className="m-0 fw-semibold text-dark-emphasis"
            style={{ fontSize: "0.9em" }}
          >
            {" "}
            {postedDate}
          </p>
          {/* <p className="m-0">End Date: {endDate}</p> */}
        </div>
      </div>
    </div>
  );
};

export default JobPostCard;
