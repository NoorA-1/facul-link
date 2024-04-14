import React, { useState, useEffect, useRef } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
  Button,
  Modal,
  Box,
  Tabs,
  Tab,
  MenuItem,
  IconButton,
  TextField,
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

const reportModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "80%",
  width: "75%",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const shortlistModalStyle = {
  ...reportModalStyle,
  width: "50%",
};

const JobApplicationCandidates = () => {
  const [loading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("1");
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const [open, setOpen] = useState({
    reportModal: false,
    shortlistModal: false,
  });
  const handleModalOpen = (name, id) => {
    setCurrentApplicationId(() => id);
    setOpen((prev) => ({ ...prev, [name]: true }));
  };
  const handleModalClose = (name) => {
    setCurrentApplicationId(null);
    setSelectedOption("");
    setOpen((prev) => ({ ...prev, [name]: false }));
  };

  const handleTab = (event, newValue) => {
    setTab(newValue);
  };

  const getData = async () => {
    try {
      const { data } = await http.get(`/employer/applications/${params.id}`);
      setData(data);
      console.log(data);
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

  const filteredData = data.filter((e) => {
    switch (tab) {
      case "1":
        return true;
      case "2":
        return e.status === "shortlisted";
      case "3":
        return e.status === "rejected";
      default:
        return true;
    }
  });

  if (loading && !data) {
    return (
      <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
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

  const defaultEmail = (
    candidateName,
    jobTitle,
    employerName,
    departmentName,
    universityName
  ) => `Dear ${candidateName},

We are pleased to inform you that you have been shortlisted for the ${jobTitle} position at ${universityName}. Further details regarding the next steps of the recruitment process will be communicated to you shortly.
  
Best regards,
${employerName}
${departmentName}
${universityName}
`;

  const handleEmailBody = () => {
    const currentApplication = data.find(
      (application) => application._id === currentApplicationId
    );
    console.log(currentApplication);
    return currentApplication
      ? defaultEmail(
          currentApplication.applicantId.userId?.firstname +
            " " +
            currentApplication.applicantId.userId?.lastname,
          currentApplication.jobId.title,
          currentApplication.jobId.createdBy.userId?.firstname +
            " " +
            currentApplication.jobId.createdBy.userId?.lastname,
          currentApplication.jobId.createdBy?.departmentName + " Department",
          currentApplication.jobId.createdBy?.universityName
        )
      : "Loading...";
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
        <h5 className="text-center fw-semibold mt-3">
          Candidates for Job:{" "}
          <span className="fw-medium">{data[0]?.jobId?.title}</span>
        </h5>
        <hr className="mt-3 m-0" />
        <Tabs value={tab} onChange={handleTab}>
          <Tab label="All" value="1" />
          <Tab label="Shortlisted" value="2" />
          <Tab label="Rejected" value="3" />
        </Tabs>

        <hr className="mt-0" />
        <div
          className={`d-flex align-items-center flex-wrap my-3 ${
            data.length <= 2
              ? "justify-content-start"
              : "justify-content-around"
          }`}
          style={{
            gap: "20px",
          }}
        >
          {filteredData.length > 0 &&
            filteredData.map((e, index) => (
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
                  <span className="fw-normal text-capitalize">{e.status}</span>
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
                      sx={{
                        border: 1.5,
                        ":hover": {
                          border: 1.5,
                        },
                      }}
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
                    sx={{
                      border: 1.5,
                      ":hover": {
                        border: 1.5,
                      },
                    }}
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
                        sx={{
                          border: 1.5,
                          ":hover": {
                            border: 1.5,
                          },
                        }}
                        onClick={() => handleModalOpen("reportModal", e._id)}
                      >
                        Test Report
                      </Button>
                    )}
                    {Boolean(e.status !== "pending") && (
                      <Button
                        variant="contained"
                        color="success"
                        endIcon={<MarkEmailReadOutlinedIcon />}
                        fullWidth
                        onClick={() => handleModalOpen("shortlistModal", e._id)}
                      >
                        Shortlist
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <Modal
          open={open.reportModal}
          onClose={() => handleModalClose("reportModal")}
        >
          <Box sx={reportModalStyle}>
            <h4 className="fw-semibold text-center">Test Results</h4>
            <hr />
            {data.length > 0 &&
              data.map((application, index) => {
                if (currentApplicationId === application._id) {
                  const testDetails = application.test;
                  const questions = application.jobId.hiringTest.questions;
                  return (
                    <div key={index}>
                      <p className="fw-semibold">
                        Total Questions:{" "}
                        <span className="fw-normal">{questions.length}</span>
                      </p>
                      <p className="fw-semibold">
                        Correct Answers:{" "}
                        <span className="fw-normal">
                          {testDetails.correctAnswers.length}
                        </span>
                      </p>
                      <p className="fw-semibold">
                        Scored:{" "}
                        <span className="fw-normal">
                          {testScore(application)}%
                        </span>
                      </p>
                      <hr />
                      <div>
                        {questions.map((question, qIndex) => {
                          const givenAnswer = [
                            ...testDetails.correctAnswers,
                            ...testDetails.wrongAnswers,
                          ].find((ans) => ans.questionId === question._id);
                          const isCorrect =
                            givenAnswer &&
                            question.correctOption === givenAnswer.answer;
                          return (
                            <div
                              key={qIndex}
                              className="mt-4 border border-1 rounded p-3 pt-4 px-5 shadow"
                            >
                              <p className="fw-semibold">
                                Q{qIndex + 1}: {question.question}
                              </p>
                              {/* <p>
                                Selected Answer:{" "}
                                {givenAnswer
                                  ? givenAnswer.answer
                                  : "No answer given"}
                              </p> */}
                              <div>
                                {question.options.map((option) => (
                                  <p
                                    key={option._id}
                                    className={`px-2 py-2 ${
                                      isCorrect &&
                                      question.correctOption ===
                                        option.optionLabel
                                        ? "border border-2 border-success rounded"
                                        : givenAnswer.answer ===
                                            option.optionLabel &&
                                          "border border-2 border-danger rounded"
                                    }`}
                                  >
                                    {option.optionLabel}) {option.optionValue}
                                  </p>
                                ))}
                              </div>
                              {!isCorrect && (
                                <p className="mt-4 p-3 rounded shadow-sm bg-success text-white fw-semibold">
                                  Correct Option: {question.correctOption}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
          </Box>
        </Modal>

        <Modal
          open={open.shortlistModal}
          onClose={() => handleModalClose("shortlistModal")}
        >
          <Box sx={shortlistModalStyle}>
            <h4 className="fw-semibold text-center">Shortlist Candidate</h4>
            <hr />

            <div className="d-flex flex-column align-items-center justify-content-center mt-4">
              <TextField
                select
                label="Select Option"
                value={selectedOption}
                onChange={(event) => setSelectedOption(event.target.value)}
                className="w-25"
              >
                <MenuItem value="shortlisted">Shortlist</MenuItem>
                <MenuItem value="rejected">Reject</MenuItem>
              </TextField>
              {selectedOption === "shortlisted" && (
                <>
                  <h6 className="mt-3 fw-semibold align-self-start">Email</h6>
                  <TextField
                    fullWidth
                    label="Subject"
                    className="mb-3"
                    defaultValue={`Shortlisted for ${data[0]?.jobId.title} Position`}
                  />
                  <TextField
                    multiline
                    fullWidth
                    rows={10}
                    label="Body"
                    defaultValue={handleEmailBody()}
                  />
                </>
              )}
              <Button
                variant="contained"
                className="w-50 mt-5"
                disabled={selectedOption === ""}
              >
                Submit
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default JobApplicationCandidates;
