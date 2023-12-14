import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
const adminLinks = [
  {
    text: "Home",
    path: "/admin-dashboard",
    icon: <HomeOutlinedIcon className="mb-1" />,
  },
  {
    text: "Manage Jobs",
    path: "search-job",
    icon: <WorkOutlineOutlinedIcon />,
  },
  {
    text: "Manage Teachers",
    path: "all-jobs",
    icon: <PersonOutlineOutlinedIcon />,
  },
  {
    text: "Manage Employers",
    path: "application-history",
    icon: <BadgeOutlinedIcon />,
  },
  {
    text: "Manage Hiring Tests",
    path: "bookmarks",
    icon: <ArticleOutlinedIcon className="mb-1" />,
  },
];

export default adminLinks;
