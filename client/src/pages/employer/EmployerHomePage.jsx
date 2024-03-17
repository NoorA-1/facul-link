import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import ChecklistRtlOutlinedIcon from "@mui/icons-material/ChecklistRtlOutlined";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { HomePageCard, JobPostCard } from "../../components";
import http from "../../utils/http";
import { serverURL } from "../../utils/formData";
import { useDashboardContext } from "../DashboardLayout";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const EmployerHomePage = () => {
  const [jobsData, setJobsData] = useState(null);
  const [statsData, setStatsData] = useState(null);

  const getJobsData = async () => {
    try {
      const { data } = await http.get(`/employer/all-jobs/${3}`);
      setJobsData(data);
      console.log(data);
      const { data: responseStatsData } = await http.get("/employer/stats");
      console.log(responseStatsData);
      setStatsData(responseStatsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(statsData);
  }, [statsData]);

  useEffect(() => {
    getJobsData();
  }, []);

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
        <HomePageCard
          cardText="Jobs Posted By You"
          digit={statsData?.totalJobsCount}
          color="#005F73"
        >
          <CasesOutlinedIcon className="mt-2 mb-3" sx={{ color: "#005F73" }} />
        </HomePageCard>
        <HomePageCard
          cardText="Total Applications Received"
          digit={0}
          color="#00733D"
        >
          <AssignmentTurnedInOutlinedIcon
            className="mt-2 mb-3"
            sx={{ color: "#00733D" }}
          />
        </HomePageCard>
        <HomePageCard
          cardText="Total Hiring Tests Made"
          digit={statsData?.totalTestsCount}
          color="#00733D"
        >
          <ChecklistRtlOutlinedIcon
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
                  role="employer"
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
    </div>
  );
};

export default EmployerHomePage;
