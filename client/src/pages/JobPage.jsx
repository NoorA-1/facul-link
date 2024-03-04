import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../utils/http";
import { Avatar, Button, Chip } from "@mui/material";
import { serverURL } from "../utils/formData";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import dayjs from "dayjs";
import { useDashboardContext } from "./DashboardLayout";

const JobPage = () => {
  const params = useParams();
  const { userData } = useDashboardContext();
  console.log(userData);
  const [jobData, setJobData] = useState();
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await http.get(`/employer/jobs/${params.id}`);
      const data = response.data;
      setJobData(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
  }, [params]);

  if (loading) {
    return (
      <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-3 ">
      <div className="bg-white py-4 rounded grey-border px-5">
        <div className="row">
          <div className="col-8">
            <h4 className="fw-bold mt-3">{jobData.title}</h4>
            <div className="d-flex align-items-center mt-3 mb-4 flex-wrap">
              <div className="d-flex align-items-center gap-2 me-5">
                <Avatar
                  src={`${serverURL}${
                    jobData.createdBy.universityLogo.split("public\\")[1]
                  }`}
                  variant="rounded"
                  sx={{ width: 35, height: 35 }}
                  alt={jobData.createdBy.universityName[0]}
                />
                <p className="m-0 fw-semibold">
                  {jobData.createdBy.universityName}
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <LocationOnOutlinedIcon fontSize="small" />
                <p className="m-0 fw-semibold">{jobData.location}</p>
              </div>
              <hr className="w-100" />
            </div>

            <div className="descriptive-section">
              <h6 className="fw-semibold">Description</h6>
              <p>{jobData.description}</p>
              <h6 className="fw-semibold mt-4">Required Qualification:</h6>
              <ul>
                <li>{jobData.requiredQualification}</li>
              </ul>
              <h6 className="fw-semibold mt-4">Required Experience:</h6>
              <ul>
                <li>{jobData.requiredExperience}</li>
              </ul>
              <h6 className="fw-semibold mt-4">Required Skills:</h6>
              <div className="d-flex gap-2 flex-wrap">
                {jobData.skills &&
                  jobData.skills.map((skill, index) => {
                    return <Chip key={index} label={skill} />;
                  })}
              </div>
            </div>
            <div className="dateinfo-section my-5">
              <h6 className="fw-semibold">
                Number of Positions:{" "}
                <span className="fw-normal">{jobData.totalPositions}</span>
              </h6>
              <h6 className="fw-semibold">
                Posted Date:{" "}
                <span className="fw-normal">
                  {dayjs(jobData.createdAt).format("DD MMMM YYYY")}
                </span>
              </h6>
              <h6 className="fw-semibold">
                Last Date to Apply:{" "}
                <span className="fw-normal">
                  {dayjs(jobData.endDate).format("DD MMMM YYYY")}
                </span>
              </h6>
            </div>
          </div>
          <div className="offset-1 col-3">
            <div
              className="bg-white mt-5 p-3 w-100 rounded shadow d-flex flex-column align-items-center justify-content-center"
              style={{ border: "1px solid #0A9396" }}
            >
              <Avatar
                src={`${serverURL}${
                  jobData.createdBy.profileImage.split("public\\")[1]
                }`}
                sx={{ width: 80, height: 80 }}
              />
              <h4 className="fw-semibold">{`${jobData.createdBy.userId.firstname} ${jobData.createdBy.userId.lastname}`}</h4>
              <p>{jobData.createdBy.departmentName} Department</p>
              <hr className="w-100" />
              <div className="d-flex align-items-start gap-2">
                <Avatar
                  src={`${serverURL}${
                    jobData.createdBy.universityLogo.split("public\\")[1]
                  }`}
                  variant="rounded"
                  sx={{ width: 40, height: 40 }}
                  className="mt-1"
                  alt={jobData.createdBy.universityName[0]}
                />
                <p className="m-0 fw-semibold">
                  {jobData.createdBy.universityName}
                </p>
              </div>
              <Button
                variant="outlined"
                className="mt-4 mb-3"
                sx={{
                  border: 2,
                  ":hover": {
                    border: 2,
                  },
                }}
              >
                View Employer Profile
              </Button>
            </div>
          </div>
        </div>
        {userData.user.userId.role !== "employer" && (
          <div className="d-flex align-items-center justify-content-center">
            <Button variant="contained" className="w-25">
              Apply Now
            </Button>
          </div>
        )}
        {jobData.isTestEnabled && (
          <div className="d-flex align-items-center justify-content-center mt-2">
            <ListAltIcon sx={{ fontSize: 25 }} color="primary" />
            <span className="fw-medium">
              This job requires online hiring test
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPage;
