import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import http from "../utils/http";
import { useNavigate, useParams } from "react-router-dom";

const ViewEmployerProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const serverURL = import.meta.env.VITE_BACKENDURL;
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await http.get(`/admin/employer/${params.id}`);
        console.log(response);
        if (response.status === 200) {
          setUserData(response.data);
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 404) {
          navigate("/not-found");
        }
      }
    };
    fetchUserData();
  }, [params]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const profileImage = Boolean(userData.profileImage)
    ? serverURL + userData.profileImage?.split("public\\")[1]
    : null;
  const universityLogo =
    serverURL + userData.universityLogo?.split("public\\")[1];

  const websiteURL =
    userData.universityURL.startsWith("http://") ||
    userData.universityURL.startsWith("https://")
      ? userData.universityURL
      : `https://${userData.universityURL}`;

  return (
    <div className="col-8 mt-3 mx-auto">
      <div className="bg-white p-3 px-5 rounded grey-border">
        <Button
          variant="outlined"
          startIcon={<ArrowBackOutlinedIcon />}
          sx={{
            border: 2,
            ":hover": {
              border: 2,
            },
          }}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <h3 className="fw-semibold text-center">Employer Profile</h3>
        <hr />
        <div className="d-flex align-items-center justify-content-center">
          <div className="position-relative my-3">
            <Avatar
              src={profileImage}
              sx={{ width: 160, height: 160, border: "2px solid #0a9396" }}
              className="mx-auto"
              variant="rounded"
            >
              {`${userData.userId.firstname[0]} ${userData.userId.lastname[0]}`}
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
          {userData.userId.firstname + " " + userData.userId.lastname}
        </h4>
        <div className="d-flex align-items-center justify-content-center">
          <div className="mb-2 col-6">
            <h6 className="text-center fw-semibold my-1">
              <span style={{ color: "#0a9396" }}>
                {userData.universityName}
              </span>
            </h6>
            <p style={{ color: "#404040" }} className="fw-semibold text-center">
              {userData.departmentName}
            </p>
            <div className="d-flex justify-content-center">
              <a href={websiteURL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="large"
                  startIcon={<LinkOutlinedIcon />}
                  variant="text"
                  className="fw-bold text-lowercase"
                  color="alternate"
                >
                  {userData.universityURL}
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
          {userData.profileDescription}
        </div>
      </div>
    </div>
  );
};

export default ViewEmployerProfilePage;
