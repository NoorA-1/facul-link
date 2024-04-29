import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Avatar, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../utils/formData";

const CandidateCard = ({
  candidate,
  //   profileImage,
  //   resumeFileSrc,
  //   resumeFileName,
  testScore,
  navigate,
  handleModalOpen,
}) => {
  const profileImage = (e) => {
    return serverURL + e.applicantId?.profileImage?.split("public\\")[1];
  };

  const resumeFileName = (e) => {
    const parts = e?.resumeFile.split("\\");
    const fileName = parts[parts.length - 1];
    return fileName;
  };

  const resumeFileSrc = (e) => {
    const source = serverURL + e?.resumeFile.split("public\\")[1];
    return source;
  };

  return (
    <div
      className="candidate-card p-3 rounded shadow col-12 col-md-5 col-lg-5 col-xl-3"
      style={{ border: "1px solid #0A9396", margin: "10px" }}
    >
      <div className="d-flex flex-column align-items-center justify-content-center">
        <Avatar
          src={profileImage(candidate)}
          sx={{ border: "1px solid #0A9396", width: 80, height: 80 }}
        >{`${candidate.applicantId.userId.firstname[0]}${candidate.applicantId.userId.lastname[0]}`}</Avatar>
        <h5 className="mt-3 mb-0 fw-semibold">{`${candidate.applicantId.userId.firstname} ${candidate.applicantId.userId.lastname}`}</h5>
      </div>
      <hr className="w-100" />
      <p className="fw-medium">
        Email:{" "}
        <span className="fw-normal">{candidate.applicantId.userId.email}</span>
      </p>
      <p className="fw-medium">
        Contact Number:{" "}
        <span className="fw-normal">{candidate.contactNumber}</span>
      </p>
      <p className="fw-medium">
        Application Status:{" "}
        <span className="fw-normal text-capitalize">{candidate.status}</span>
      </p>

      <p className="fw-medium">
        Test Score: <span className="fw-normal">{testScore(candidate)}%</span>
      </p>

      <hr className="w-100" />
      <div className="d-flex flex-column gap-3">
        <a
          href={resumeFileSrc(candidate)}
          download={resumeFileName(candidate)}
          target="_blank"
          rel="noreferrer"
        >
          <Button
            variant="outlined"
            color="primary"
            endIcon={<FileDownloadOutlinedIcon />}
            fullWidth
            sx={{ border: 1.5, ":hover": { border: 1.5 } }}
          >
            Resume
          </Button>
        </a>
        <Button
          variant="outlined"
          color="info"
          endIcon={<VisibilityOutlinedIcon />}
          fullWidth
          onClick={() =>
            navigate(
              `/dashboard/teacher-profile/${candidate.applicantId.userId._id}`
            )
          }
          sx={{ border: 1.5, ":hover": { border: 1.5 } }}
        >
          Profile
        </Button>
        <div className="d-flex align-items-center gap-2">
          {Boolean(candidate.test?.status === "completed") && (
            <Button
              variant="outlined"
              color="warning"
              endIcon={<ScoreboardOutlinedIcon />}
              fullWidth
              sx={{
                border: 1.5,
                ":hover": {
                  border: 1.5,
                },
              }}
              onClick={() => handleModalOpen("reportModal", candidate._id)}
            >
              Test Report
            </Button>
          )}
          {Boolean(
            candidate.status !== "pending" &&
              candidate.status !== "rejected" &&
              candidate.status !== "hired"
          ) && (
            <Button
              variant="contained"
              color="primary"
              endIcon={<MarkEmailReadOutlinedIcon />}
              fullWidth
              onClick={() => handleModalOpen("reviewModal", candidate._id)}
              disabled={candidate.jobId.totalPositions <= 0}
            >
              Update
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
