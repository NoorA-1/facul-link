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
          Job Title:{" "}
          <span className="fw-semibold">{data[0]?.jobId?.title}</span>
        </h5>
        <hr className="mb-5" />
        <TableContainer
          sx={{ border: "1px solid #0A9396" }}
          className="mb-4"
          component={Paper}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell className="fw-bold">Candidate Name</TableCell>
                {/* <TableCell align="right" className="fw-bold">
            Location
          </TableCell> */}
                <TableCell align="left" className="fw-bold">
                  Email
                </TableCell>
                <TableCell align="right" className="fw-bold">
                  Contact Number
                </TableCell>
                <TableCell align="right" className="fw-bold">
                  Resume
                </TableCell>
                <TableCell align="right" className="fw-bold">
                  Application Status
                </TableCell>
                {Boolean(data[0]?.jobId?.hiringTest) && (
                  <TableCell align="right" className="fw-bold">
                    Test Score
                  </TableCell>
                )}
                <TableCell align="right" className="fw-bold">
                  Profile
                </TableCell>
                <TableCell align="center" className="fw-bold">
                  Actions
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 &&
                data.map((e, index) => (
                  <TableRow
                    key={e.applicantId._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <div className="d-flex align-items-center gap-2">
                        <Avatar
                          src={profileImage(e)}
                          sx={{ border: "1px solid #0A9396" }}
                        >{`${e.applicantId.userId.firstname}[0] ${e.applicantId.userId.lastname}[0]`}</Avatar>
                        {`${e.applicantId.userId.firstname} ${e.applicantId.userId.lastname}`}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      {e.applicantId.userId.email}
                    </TableCell>
                    <TableCell align="right">{e.contactNumber}</TableCell>

                    <TableCell align="right">
                      <a
                        href={resumeFileSrc(e)}
                        download={resumeFileName(e)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <IconButton size="large" color="secondary">
                          <FileDownloadOutlinedIcon />
                        </IconButton>
                      </a>
                    </TableCell>
                    <TableCell align="right" className="text-capitalize">
                      {e.status}
                    </TableCell>
                    {Boolean(e.test?.status !== "no test") && (
                      <TableCell align="right" className="text-capitalize">
                        {testScore(e)}%
                      </TableCell>
                    )}
                    <TableCell align="right" className="text-capitalize">
                      <IconButton
                        onClick={() =>
                          navigate(
                            `/dashboard/teacher-profile/${e.applicantId.userId._id}`
                          )
                        }
                      >
                        <VisibilityOutlinedIcon color="alternate" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <div className="d-flex justify-content-center gap-2">
                        {Boolean(e.test?.status !== "no test") && (
                          <IconButton>
                            <ScoreboardOutlinedIcon color="warning" />
                          </IconButton>
                        )}
                        {e.status !== "pending" && (
                          <IconButton>
                            <MarkEmailReadOutlinedIcon color="primary" />
                          </IconButton>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default JobApplicationCandidates;
