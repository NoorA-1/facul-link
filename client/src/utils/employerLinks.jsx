import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
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
  // {
  //   text: "All Jobs",
  //   path: "all-jobs",
  //   icon: <WorkOutlineOutlinedIcon />,
  // },
  {
    text: "Post Job",
    path: "post-job",
    icon: <NoteAddOutlinedIcon />,
  },
  {
    text: "Hiring Tests",
    path: "hiring-tests",
    icon: <ChecklistRtlOutlinedIcon className="mb-1" />,
  },
  {
    text: "Applications",
    path: "job-applications",
    icon: <AssignmentOutlinedIcon className="mb-1" />,
  },
  {
    text: "Profile",
    path: "profile",
    icon: <PersonOutlineOutlinedIcon className="mb-1" />,
  },
];

export default employerLinks;
