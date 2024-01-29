import React from "react";
import { useDashboardContext } from "../DashboardLayout";
import { HomePageCard, JobPostCard } from "../../components";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
const HomePage = () => {
  const { userData } = useDashboardContext();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date().toLocaleDateString("en-US", options);
  return (
    <div className="mt-3">
      <h2 className="fw-bold mb-3">
        Welcome, {userData.user.userId.firstname}
      </h2>
      <h6 className="ps-1 mb-3">{date}</h6>
      <div className="d-flex flex-column flex-md-row gap-5">
        <HomePageCard cardText="Total Jobs" digit={0} color="#005F73">
          <CasesOutlinedIcon className="mt-2 mb-3" sx={{ color: "#005F73" }} />
        </HomePageCard>
        <HomePageCard
          cardText="Applications Submitted"
          digit={0}
          color="#00733D"
        >
          <AssignmentTurnedInOutlinedIcon
            className="mt-2 mb-3"
            sx={{ color: "#00733D" }}
          />
        </HomePageCard>
      </div>
      <div className="mt-5 bg-white p-3 px-5 rounded grey-border">
        <h5 className="fw-bold mb-3">Recently Posted Jobs</h5>
        {/* <JobPostCard
          title="Example"
          universityName="Example"
          location="Karachi"
        />
        <JobPostCard
          title="Example"
          universityName="Example"
          location="Karachi"
        />
        <JobPostCard
          title="Example"
          universityName="Example"
          location="Karachi"
        /> */}
        <div className="d-flex align-items-center justify-content-center flex-column">
          <FolderOffOutlinedIcon color="disabled" />
          <p className="text-secondary">No jobs found</p>
        </div>
      </div>

      <div className="mt-5 bg-white p-3 px-5 rounded grey-border">
        <h5 className="fw-bold mb-3">Jobs Matching Your Profile</h5>
        {/* <JobPostCard
          title="Example"
          universityName="Example"
          location="Karachi"
        />
        <JobPostCard
          title="Example"
          universityName="Example"
          location="Karachi"
        />
        <JobPostCard
          title="Example"
          universityName="Example"
          location="Karachi"
        /> */}
        <div className="d-flex align-items-center justify-content-center flex-column">
          <FolderOffOutlinedIcon color="disabled" />
          <p className="text-secondary">No jobs found</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
