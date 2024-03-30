import React, { useState, useEffect } from "react";
import { useDashboardContext } from "../DashboardLayout";
import { HomePageCard, JobPostCard } from "../../components";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import http from "../../utils/http";
import { serverURL } from "../../utils/formData";
dayjs.extend(relativeTime);
const HomePage = () => {
  const [jobsData, setJobsData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const { userData: initialUserData } = useDashboardContext();
  const [userData, setUserData] = useState(initialUserData);
  console.log(userData);

  const getJobsData = async () => {
    try {
      const { data } = await http.get(`/employer/all-jobs/${3}`);
      setJobsData(data);
      const { data: newStatsData } = await http.get("/teacher/stats");
      setStatsData(newStatsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobsData();
  }, []);

  const updateUserData = async () => {
    const { data } = await http.get("/users/current-user");
    console.log(data);
    setUserData(() => data);
  };

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
        <HomePageCard
          cardText="Total Jobs"
          digit={Boolean(statsData) ? statsData : 0}
          color="#005F73"
        >
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
        {jobsData && jobsData.length > 0 ? (
          jobsData.map(
            (e, index) =>
              e.createdBy.status === "active" && (
                <JobPostCard
                  key={index}
                  logo={`${serverURL}${
                    e.createdBy.universityLogo &&
                    e.createdBy.universityLogo.split("public\\")[1]
                  }`}
                  title={e.title}
                  universityName={e.createdBy.universityName}
                  location={e.location}
                  postedDate={dayjs(e.createdAt).fromNow()}
                  endDate={dayjs(e.endDate).format("DD-MM-YYYY")}
                  role="teacher"
                  isBookmarked={
                    Boolean(userData?.user?.bookmarks.includes(e._id))
                      ? true
                      : false
                  }
                  updateUserData={updateUserData}
                  jobId={e._id}
                />
              )
          )
        ) : (
          <div className="d-flex align-items-center justify-content-center flex-column">
            <FolderOffOutlinedIcon color="disabled" />
            <p className="text-secondary">No jobs found</p>
          </div>
        )}
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
