import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
const employerLinks = [
  {
    text: "Home",
    path: "/dashboard",
    icon: <HomeOutlinedIcon className="mb-1" />,
  },
  {
    text: "Search Job",
    path: "search-job",
    icon: <SearchOutlinedIcon />,
  },
  {
    text: "All Jobs",
    path: "all-jobs",
    icon: <WorkOutlineOutlinedIcon />,
  },
  {
    text: "Post Job",
    path: "application-history",
    icon: <WorkHistoryOutlinedIcon />,
  },
  {
    text: "Hiring Tests",
    path: "bookmarks",
    icon: <BookmarkBorderOutlinedIcon className="mb-1" />,
  },
  {
    text: "Profile",
    path: "employer-profile",
    icon: <PersonOutlineOutlinedIcon className="mb-1" />,
  },
];

export default employerLinks;
