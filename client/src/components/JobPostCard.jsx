import React from "react";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import Avatar from "@mui/material/Avatar";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import http from "../utils/http";

const JobPostCard = ({
  logo,
  title,
  universityName,
  location,
  postedDate,
  role,
  jobId,
  isBookmarked,
  updateUserData,
  classes,
  endDate,
}) => {
  const navigate = useNavigate();

  const bookmarkJob = async (jobId) => {
    try {
      const response = await http.post(`/teacher/bookmark/${jobId}`);
      console.log(response);
      updateUserData();
    } catch (error) {
      console.log(error);
    }
  };

  const unBookmarkJob = async (jobId) => {
    try {
      const response = await http.delete(`/teacher/bookmark/${jobId}`);
      console.log(response);
      updateUserData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-light-gray border border-dark-subtle rounded shadow-sm p-3 mb-3 d-flex flex-column flex-sm-row align-items-center">
      <Avatar
        src={logo}
        variant="rounded"
        sx={{ width: 80, height: 80 }}
        alt={universityName[0]}
        className="mb-3 mb-sm-0 me-sm-3"
      />
      <div className="w-100">
        <div className="d-flex flex-column flex-lg-row justify-content-between">
          <div>
            <h6 className="fw-bold text-wrap" style={{ color: "#084C61" }}>
              {title}
            </h6>
            <div className="d-flex gap-2 flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <CorporateFareOutlinedIcon fontSize="small" />
                <p className="fw-bold m-0" style={{ fontSize: "0.9em" }}>
                  {universityName}
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <LocationOnOutlinedIcon fontSize="small" />
                <p className="fw-bold m-0" style={{ fontSize: "0.9em" }}>
                  {location}
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2">
              <CalendarMonthOutlinedIcon fontSize="small" />
              <p className="m-0 fw-semibold" style={{ fontSize: "0.9em" }}>
                Posted {postedDate}
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center">
            {role === "teacher" && !isBookmarked ? (
              <IconButton
                onClick={() => bookmarkJob(jobId)}
                className="mt-3 mt-lg-0"
              >
                <BookmarkBorderOutlinedIcon />
              </IconButton>
            ) : (
              role === "teacher" && (
                <IconButton
                  onClick={() => unBookmarkJob(jobId)}
                  className="mt-3 mt-lg-0"
                >
                  <BookmarkOutlinedIcon />
                </IconButton>
              )
            )}
            <Button
              fullWidth
              variant="contained"
              className="mt-3 mt-lg-0"
              onClick={() => navigate(`/dashboard/jobs/${jobId}`)}
            >
              {role === "employer"
                ? "View Details"
                : role === "teacher" && "Apply"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostCard;
