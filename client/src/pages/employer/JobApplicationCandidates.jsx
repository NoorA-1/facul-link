import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import http from "../../utils/http";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import Avatar from "@mui/material/Avatar";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import { serverURL } from "../../utils/formData";

const JobApplicationCandidates = () => {
  const [loading, setIsLoading] = useState(true);
  const [data, setData] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const { data } = await http.get(`/employer/applications/${params.id}`);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getData();
      setIsLoading(false);
    }
  }, [params.id]);

  if (loading && !data) {
    return <div>Loading</div>;
  }

  const profileImage = (e) => {
    return serverURL + e.applicantId.profileImage.split("public\\")[1];
  };

  const resumeFileName = (e) => {
    const parts = e.resumeFile.split("\\");
    const fileName = parts[parts.length - 1];
    return fileName;
  };

  const resumeFileSrc = (e) => {
    const source = serverURL + e?.resumeFile.split("public\\")[1];
    return source;
  };

  const testScore = (e) => {
    const test = e.test;
    const totalQuestions = e.jobId.hiringTest.questions.length;
    const correctAnswers = test.correctAnswers.length;
    const scorePercentage =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    return scorePercentage;
  };

  return (
    <div className="mx-auto my-3">
      <div className="bg-white py-4 rounded grey-border px-5">
        <Button
          variant="outlined"
          sx={{
            border: 2,
            ":hover": {
              border: 2,
            },
          }}
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <h5 className="text-center fw-medium mt-3">
          Candidates for Job:{" "}
          <span className="fw-semibold">{data[0]?.jobId?.title}</span>
        </h5>
        <hr className="mb-" />

        <div
          className={`d-flex align-items-center flex-wrap my-3 ${
            data.length === 1
              ? "justify-content-start"
              : "justify-content-around"
          }`}
          style={{
            gap: "20px",
          }}
        >
          {data.length > 0 &&
            data.map((e, index) => (
              <>
                <div
                  className="candidate-card p-3 rounded shadow w-25"
                  style={{
                    border: "1px solid #0A9396",
                    margin: "10px",
                  }}
                  key={index}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <Avatar
                      src={profileImage(e)}
                      sx={{
                        border: "1px solid #0A9396",
                        width: 80,
                        height: 80,
                      }}
                    >{`${e.applicantId.userId.firstname}[0] ${e.applicantId.userId.lastname}[0]`}</Avatar>

                    <h5 className="mt-3 mb-0 fw-semibold">
                      {`${e.applicantId.userId.firstname} ${e.applicantId.userId.lastname}`}
                    </h5>
                  </div>
                  <hr className="w-100" />
                  <p className="fw-medium">
                    Email:{" "}
                    <span className="fw-normal">
                      {e.applicantId.userId.email}
                    </span>
                  </p>
                  <p className="fw-medium">
                    Contact Number:{" "}
                    <span className="fw-normal">{e.contactNumber}</span>
                  </p>
                  <p className="fw-medium">
                    Application Status:{" "}
                    <span className="fw-normal text-capitalize">
                      {e.status}
                    </span>
                  </p>

                  {Boolean(e.test?.status !== "no test") && (
                    <p className="fw-medium text-capitalize">
                      Test Score:{" "}
                      <span className="fw-normal">{testScore(e)}%</span>
                    </p>
                  )}
                  <hr className="w-100" />
                  <div className="d-flex flex-column gap-3">
                    <a
                      href={resumeFileSrc(e)}
                      download={resumeFileName(e)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        endIcon={<FileDownloadOutlinedIcon />}
                        fullWidth
                      >
                        Resume
                      </Button>
                    </a>

                    <Button
                      variant="outlined"
                      color="alternate"
                      endIcon={<VisibilityOutlinedIcon />}
                      fullWidth
                      onClick={() =>
                        navigate(
                          `/dashboard/teacher-profile/${e.applicantId.userId._id}`
                        )
                      }
                    >
                      Profile
                    </Button>

                    <div className="d-flex align-items-center gap-2">
                      {Boolean(e.test?.status !== "no test") && (
                        <Button
                          variant="outlined"
                          color="warning"
                          endIcon={<ScoreboardOutlinedIcon />}
                          fullWidth
                        >
                          Test Report
                        </Button>
                      )}
                      {Boolean(e.status !== "pending") && (
                        <Button
                          variant="outlined"
                          color="success"
                          endIcon={<MarkEmailReadOutlinedIcon />}
                          fullWidth
                        >
                          Shortlist
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationCandidates;
