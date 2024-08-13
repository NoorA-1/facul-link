import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Chip, Button } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import IconButton from "@mui/material/IconButton";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import dayjs from "dayjs";

import http from "../utils/http";

const ViewTeacherProfile = () => {
  const params = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const serverURL = import.meta.env.VITE_BACKENDURL;

  useEffect(() => {
    const fetchUserData = async () => {
      const { data } = await http.get(`/users/teacher/${params.id}`);
      setUserData(data);
      console.log(data);
    };
    fetchUserData();
  }, [params.id]);

  const resumeFileSrc = userData?.resumeFile
    ? `${serverURL}${userData.resumeFile.split("public\\")[1]}`
    : null;

  const [resume, setResume] = useState({
    file: "",
    URL: "",
    value: "",
    filename: resumeFileSrc ? resumeFileSrc.split("documents\\")[1] : "",
  });

  if (!userData) {
    return (
      <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  const profileImage = userData?.profileImage
    ? `${serverURL}${userData.profileImage.split("public\\")[1]}`
    : null;

  return (
    <div className="col-lg-8 mt-3 mx-auto">
      <div className="bg-white p-3 px-5 rounded grey-border">
        <h3 className="fw-semibold text-center">Teacher Profile</h3>
        <hr />
        <Button
          variant="outlined"
          sx={{
            border: 2,
            ":hover": {
              border: 2,
            },
          }}
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackOutlinedIcon />}
        >
          Go Back
        </Button>
        <Avatar
          src={profileImage}
          sx={{ width: 120, height: 120, border: "2px solid #0a9396" }}
          className="mx-auto mt-3 mb-3"
        >
          {`${userData.userId.firstname[0]} ${userData.userId.lastname[0]}`}
        </Avatar>
        <h5 className="text-center fw-bold mb-3">
          {userData.userId.firstname + " " + userData.userId.lastname}
        </h5>
        {resumeFileSrc && (
          <div className="w-50 mx-auto bg-light-gray border border-dark-subtle rounded shadow-sm px-5 py-3 mb-1 d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-3">
              <DescriptionOutlinedIcon fontSize="large" color="secondary" />
              <span>Resume</span>
            </div>
            <div>
              <a
                href={resumeFileSrc}
                download={resume.filename}
                target="_blank"
                rel="noreferrer"
              >
                <IconButton size="large" color="secondary">
                  <FileDownloadOutlinedIcon />
                </IconButton>
              </a>
            </div>
          </div>
        )}

        <h4 className="mt-4 fw-semibold">Description</h4>
        <div
          className="bg-subtle py-3 px-4 rounded shadow-sm"
          style={{ border: "1px solid #0a9396" }}
        >
          {userData.profileDescription}
        </div>

        {userData.experience.length > 0 && (
          <>
            <h4 className="mt-4 fw-semibold">Experience</h4>
            <div
              className="bg-subtle py-3 px-4 rounded shadow-sm"
              style={{ border: "1px solid #0a9396" }}
            >
              {userData.experience
                .sort(
                  (a, b) => dayjs(b.date.startDate) - dayjs(a.date.startDate)
                )
                .map((e, index) => {
                  return (
                    <div
                      className="bg-light-gray border border-dark-subtle rounded shadow-sm px-5 py-3 mb-2"
                      key={index}
                    >
                      <div className="mb-2">
                        <p className="fw-bold d-inline">Job Title:</p>{" "}
                        <p className="d-inline">{e.title}</p>
                      </div>
                      <div className="mb-2">
                        <p className="fw-bold d-inline">Company:</p>{" "}
                        <p className="d-inline">{e.company}</p>
                      </div>
                      <div className="mb-2">
                        <p className="fw-bold d-inline">Start Date:</p>{" "}
                        <p className="d-inline">
                          {dayjs(e.date.startDate).format("MMM - YYYY")}
                        </p>
                        {", "}
                        <p className="fw-bold d-inline">End Date:</p>{" "}
                        <p className="d-inline">
                          {!e.isCurrentlyWorking
                            ? dayjs(e.date.endDate).format("MMM - YYYY")
                            : "Present"}
                        </p>
                      </div>
                      <div className="mb-2">
                        <p className="fw-bold d-inline">Location:</p>{" "}
                        <p className="d-inline">
                          {e.location.country + ", " + e.location.city}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {userData.qualification.length > 0 && (
          <>
            <h4 className="mt-4 fw-semibold">Qualification</h4>
            <div
              className="bg-subtle py-3 px-4 rounded shadow-sm"
              style={{ border: "1px solid #0a9396" }}
            >
              {userData.qualification
                .sort(
                  (a, b) => dayjs(b.date.startDate) - dayjs(a.date.startDate)
                )
                .map((e, index) => {
                  return (
                    <div
                      className="bg-light-gray border border-dark-subtle rounded shadow-sm px-5 py-3 mb-3"
                      key={index}
                    >
                      <div className="mb-2">
                        <p className="fw-bold d-inline">Institute:</p>{" "}
                        <p className="d-inline">{e.instituteName}</p>
                      </div>
                      <div className="mb-2">
                        <p className="fw-bold d-inline">Field of Study:</p>{" "}
                        <p className="d-inline">{e.field}</p>
                      </div>
                      <div className="mb-2">
                        <p className="fw-bold d-inline">Level of Study:</p>{" "}
                        <p className="d-inline">{e.level}</p>
                      </div>
                      <div className="mb-2">
                        <p className="fw-bold d-inline">Grade:</p>{" "}
                        <p className="d-inline">{e.grade}</p>
                      </div>
                      <div className="mb-2">
                        <p className="fw-bold d-inline">Start Date:</p>{" "}
                        <p className="d-inline">
                          {dayjs(e.date.startDate).format("MMM - YYYY")}
                          {", "}
                        </p>
                        <p className="fw-bold d-inline">End Date:</p>{" "}
                        <p className="d-inline">
                          {dayjs(e.date.endDate).format("MMM - YYYY")}
                        </p>
                      </div>

                      <div className="mb-2">
                        <p className="fw-bold d-inline">Location:</p>{" "}
                        <p className="d-inline">
                          {e.location.country + ", " + e.location.city}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {userData.skills.length > 0 && (
          <>
            <h4 className="mt-4 fw-semibold">Skills</h4>
            <div
              className="bg-subtle py-3 px-4 rounded shadow-sm"
              style={{ border: "1px solid #0a9396" }}
            >
              <div className="d-flex gap-3 flex-wrap">
                {userData.skills.map((skill, index) => {
                  return (
                    <Chip
                      key={index}
                      label={skill}
                      size="large"
                      color="primary"
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewTeacherProfile;
