import {
  Avatar,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { serverURL } from "../utils/formData";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

const CandidateList = ({ data, testScore, handleModalOpen, navigate }) => {
  const profileImage = (candidate) => {
    return (
      serverURL + candidate.applicantId?.profileImage?.split("public\\")[1]
    );
  };

  const resumeFileName = (candidate) => {
    const parts = candidate?.resumeFile.split("\\");
    const fileName = parts[parts.length - 1];
    return fileName;
  };

  const resumeFileSrc = (candidate) => {
    const source = serverURL + candidate?.resumeFile.split("public\\")[1];
    return source;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Contact Number</TableCell>
            <TableCell>Application Status</TableCell>
            <TableCell>Test Score</TableCell>
            <TableCell>Resume</TableCell>
            <TableCell>Profile</TableCell>
            <TableCell>Report</TableCell>
            <TableCell>Update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 &&
            data.map((candidate, index) => (
              <TableRow key={index}>
                <TableCell className="d-flex align-items-center gap-2">
                  <Avatar
                    src={profileImage(candidate)}
                    sx={{ border: "1px solid #0A9396", width: 40, height: 40 }}
                  >
                    {`${candidate.applicantId.userId.firstname[0]}${candidate.applicantId.userId.lastname[0]}`}
                  </Avatar>{" "}
                  {`${candidate.applicantId.userId.firstname} ${candidate.applicantId.userId.lastname}`}
                </TableCell>
                <TableCell>{candidate.applicantId.userId.email}</TableCell>
                <TableCell>{candidate.contactNumber}</TableCell>
                <TableCell className="text-capitalize">
                  {candidate.status}{" "}
                  {candidate.status === "interview" && (
                    <span
                      className="fw-normal text-capitalize text-primary fw-medium"
                      role="button"
                      onClick={() =>
                        handleModalOpen("interviewDetailsModal", candidate._id)
                      }
                    >
                      (Details)
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {candidate.test.status === "completed" && (
                    <span className="fw-normal">{testScore(candidate)}%</span>
                  )}
                </TableCell>
                <TableCell align="center">
                  <a
                    href={resumeFileSrc(candidate)}
                    download={resumeFileName(candidate)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileDownloadOutlinedIcon color="primary" />
                  </a>
                </TableCell>
                <TableCell>
                  <IconButton
                    variant="outlined"
                    color="info"
                    onClick={() =>
                      navigate(
                        `/dashboard/teacher-profile/${candidate.applicantId.userId._id}`
                      )
                    }
                  >
                    <VisibilityOutlinedIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  {Boolean(candidate.test?.status === "completed") && (
                    <IconButton
                      variant="outlined"
                      color="warning"
                      onClick={() =>
                        handleModalOpen("reportModal", candidate._id)
                      }
                    >
                      <ScoreboardOutlinedIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  {Boolean(
                    candidate.status !== "pending" &&
                      candidate.status !== "rejected" &&
                      candidate.status !== "hired"
                  ) && (
                    <IconButton
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleModalOpen("reviewModal", candidate._id)
                      }
                      disabled={candidate.jobId.totalPositions <= 0}
                    >
                      <MarkEmailReadOutlinedIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CandidateList;
