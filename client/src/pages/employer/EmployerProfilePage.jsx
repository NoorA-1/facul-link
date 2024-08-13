import React, { useState, useEffect } from "react";
import { useDashboardContext } from "../DashboardLayout";
import { Avatar, Button } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

import { EmployerEditProfileForm } from "../../components";
import http from "../../utils/http";

const ProfilePage = () => {
  const { userData, setUserData } = useDashboardContext();
  // const [userData, setUserData] = useState(initialUserData);
  const [editMode, setEditMode] = useState(false);
  // console.log(userData);
  const serverURL = import.meta.env.VITE_BACKENDURL;
  const profileImage = Boolean(userData.user.profileImage)
    ? serverURL + userData.user.profileImage?.split("public\\")[1]
    : null;
  const universityLogo =
    serverURL + userData.user.universityLogo?.split("public\\")[1];

  const websiteURL =
    userData.user.universityURL.startsWith("http://") ||
    userData.user.universityURL.startsWith("https://")
      ? userData.user.universityURL
      : `https://${userData.user.universityURL}`;

  const updateUserData = async () => {
    const { data } = await http.get("/users/current-user");
    console.log(data);
    setUserData(() => data);
    console.log("updated");
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  if (editMode) {
    return (
      <EmployerEditProfileForm
        userData={userData.user}
        setEditMode={setEditMode}
        updateUserData={updateUserData}
      />
    );
  }

  return (
    <div className="col-8 mt-3 mx-auto">
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
        <div className="d-flex align-items-center justify-content-center">
          <div className="position-relative my-3">
            <Avatar
              src={profileImage}
              sx={{ width: 160, height: 160, border: "2px solid #0a9396" }}
              className="mx-auto"
              variant="rounded"
            >
              {`${userData.user.userId.firstname[0]} ${userData.user.userId.lastname[0]}`}
            </Avatar>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: "teal",
                width: 60,
                height: 60,
                position: "absolute",
                bottom: 0,
                right: -30,
              }}
              src={universityLogo}
            />
          </div>
        </div>
        <h4 className="text-center fw-bold m-0">
          {userData.user.userId.firstname + " " + userData.user.userId.lastname}
        </h4>
        <div className="d-flex align-items-center justify-content-center">
          <div className="mb-2 col-6">
            <h6 className="text-center fw-semibold my-1">
              <span style={{ color: "#0a9396" }}>
                {userData.user.universityName}
              </span>
            </h6>
            <p style={{ color: "#404040" }} className="fw-semibold text-center">
              {userData.user.departmentName}
            </p>
            <div className="d-flex justify-content-center">
              <a href={websiteURL} target="_blank">
                <Button
                  size="large"
                  startIcon={<LinkOutlinedIcon />}
                  variant="text"
                  className="fw-bold text-lowercase"
                  color="alternate"
                >
                  {userData.user.universityURL}
                </Button>
              </a>
            </div>
          </div>
        </div>

        <h4 className="mt-4 fw-semibold">Description</h4>
        <div
          className="bg-subtle py-3 px-4 rounded shadow-sm"
          style={{ border: "1px solid #0a9396" }}
        >
          {userData.user.profileDescription}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
