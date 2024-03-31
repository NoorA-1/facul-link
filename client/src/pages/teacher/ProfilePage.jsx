import React, { useState, useEffect } from "react";
import { useDashboardContext } from "../DashboardLayout";
import { Avatar, Button, Chip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import IconButton from "@mui/material/IconButton";

import dayjs from "dayjs";
import { TeacherEditProfileForm } from "../../components";
import http from "../../utils/http";

const ProfilePage = () => {
  const { userData: initialUserData } = useDashboardContext();
  const [userData, setUserData] = useState(initialUserData);
  const [editMode, setEditMode] = useState(false);
  // console.log(userData);
  const serverURL = "http://localhost:3000/";
  const profileImage = Boolean(userData.user.profileImage)
    ? serverURL + userData.user.profileImage?.split("public\\")[1]
    : null;
  const resumeFile = serverURL + userData.user.resumeFile?.split("public\\")[1];
  const [resumeFileSrc, setResumeFileSrc] = useState(
    Boolean(userData.user.resumeFile) ? resumeFile : null
  );
  const [resume, setResume] = useState({
    file: "",
    URL: "",
    value: "",
    filename: resumeFileSrc ? resumeFileSrc.split("documents\\")[1] : "",
  });

  const updateUserData = async () => {
    const { data } = await http.get("/users/current-user");
    console.log(data);
    setUserData(() => data);
    console.log("updated");
  };

  useEffect(() => {
    console.log(userData);
    setResumeFileSrc(Boolean(userData.user.resumeFile) ? resumeFile : null);
  }, [userData]);

  if (editMode) {
    return (
      <TeacherEditProfileForm
        userData={userData.user}
        setEditMode={setEditMode}
        updateUserData={updateUserData}
      />
    );
  }

  return (
    <div className="col-lg-8 mt-3 mx-auto">
      <div className="bg-white p-3 px-5 rounded grey-border">
        <h3 className="fw-semibold text-center">Your Profile</h3>
        <hr />
        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          sx={{
            border: 2,
            ":hover": {
              border: 2,
            },
          }}
          onClick={() => setEditMode(true)}
        >
          Edit Profile
        </Button>
        <Avatar
          src={profileImage}
          sx={{ width: 120, height: 120, border: "2px solid #0a9396" }}
          className="mx-auto mt-3 mb-3"
        >
          {`${userData.user.userId.firstname[0]} ${userData.user.userId.lastname[0]}`}
        </Avatar>
        <h5 className="text-center fw-bold mb-3">
          {userData.user.userId.firstname + " " + userData.user.userId.lastname}
        </h5>
        {resumeFileSrc && (
          <div className="w-50 mx-auto bg-light-gray border border-dark-subtle rounded shadow-sm px-5 py-3 mb-1 d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-3">
              <DescriptionOutlinedIcon fontSize="large" color="secondary" />
              {/* <span>{resume.filename}</span> */}
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
          {userData.user.profileDescription}
        </div>

        {userData.user.experience.length > 0 && (
          <>
            <h4 className="mt-4 fw-semibold">Experience</h4>
            <div
              className="bg-subtle py-3 px-4 rounded shadow-sm"
              style={{ border: "1px solid #0a9396" }}
            >
              {userData.user.experience
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

        {userData.user.qualification.length > 0 && (
          <>
            <h4 className="mt-4 fw-semibold">Qualification</h4>
            <div
              className="bg-subtle py-3 px-4 rounded shadow-sm"
              style={{ border: "1px solid #0a9396" }}
            >
              {userData.user.qualification
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

        {userData.user.skills.length > 0 && (
          <>
            <h4 className="mt-4 fw-semibold">Skills</h4>
            <div
              className="bg-subtle py-3 px-4 rounded shadow-sm"
              style={{ border: "1px solid #0a9396" }}
            >
              <div className="d-flex gap-3 flex-wrap">
                {userData.user.skills.map((skill, index) => {
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

export default ProfilePage;
