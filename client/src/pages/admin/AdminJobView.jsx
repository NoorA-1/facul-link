import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../utils/http";
import { Avatar, Button, Chip } from "@mui/material";
import { serverURL } from "../../utils/formData";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import dayjs from "dayjs";

const AdminJobView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await http.get(`/employer/jobs/${params.id}`);
      setJobData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch job data:", error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
  }, [params.id]);

  if (loading || !jobData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto my-3">
      <div className="bg-white py-4 rounded grey-border px-5">
        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <div className="d-flex flex-sm-row flex-column align-items-center justify-content-between">
          <h4 className="fw-bold mt-3">{jobData.title}</h4>
        </div>
        <div className="d-flex align-items-center mt-3 mb-4 flex-wrap">
          <div className="d-flex align-items-center gap-2 me-5">
            <Avatar
              src={`${serverURL}${
                jobData.createdBy.universityLogo?.split("public\\")[1]
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
        </div>
        <div className="descriptive-section">
          <h6 className="fw-semibold">Description</h6>
          <p>{jobData.description}</p>
        </div>

        <h6 className="fw-semibold mt-4">Required Skills:</h6>
        <div className="d-flex gap-2 flex-wrap">
          {jobData.skills &&
            jobData.skills.map((skill, index) => {
              return <Chip key={index} label={skill} />;
            })}
        </div>

        <div className="dateinfo-section my-5">
          <h6 className="fw-semibold">
            Posted Date:{" "}
            <span className="fw-normal">
              {dayjs(jobData.createdAt).format("DD MMMM YYYY")}
            </span>
          </h6>
          <h6 className="fw-semibold">
            Closing Date:{" "}
            <span className="fw-normal">
              {dayjs(jobData.endDate).format("DD MMMM YYYY")}
            </span>
          </h6>
        </div>
      </div>
    </div>
  );
};

export default AdminJobView;
