import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import {
  Box,
  Button,
  MenuItem,
  Modal,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  emailFormValidationSchema,
  interviewFormValidationSchema,
} from "../../schemas";
import { serverURL } from "../../utils/formData";
import http from "../../utils/http";

dayjs.extend(duration);

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

const emailFormInitialValues = {
  emailSubject: "",
  emailBody: "",
};

const interviewFormInitialValues = {
  ...emailFormInitialValues,
  mode: "",
  location: "",
  meetingURL: "",
  date: "",
  time: "",
};

const JobApplicationCandidates = () => {
  const [loading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("active");
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [open, setOpen] = useState({
    reportModal: false,
    reviewModal: false,
  });
  const handleModalOpen = (name, id) => {
    setCurrentApplicationId(() => id);
    setOpen((prev) => ({ ...prev, [name]: true }));
  };
  const handleModalClose = (name) => {
    setCurrentApplicationId(null);
    setSelectedOption("");
    formik.resetForm();
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

  const Options = ({ applicationId }) => {
    const application = data.find((app) => app._id === applicationId);

    return (
      <TextField
        select
        label="Select Option"
        value={selectedOption}
        onChange={(event) => {
          setSelectedOption(event.target.value);
        }}
        className="w-25"
      >
        {application && application.status === "applied" && (
          <MenuItem value="shortlisted">Shortlist</MenuItem>
        )}
        {application && application.status === "shortlisted" && (
          <MenuItem value="interview">Schedule Interview</MenuItem>
        )}
        {application && application.status === "interview" && (
          <MenuItem value="hired">Hire</MenuItem>
        )}
        {application && application.status !== "rejected" && (
          <MenuItem value="rejected">Reject</MenuItem>
        )}
      </TextField>
    );
  };

  const formik = useFormik({
    initialValues: Boolean(selectedOption === "interview")
      ? interviewFormInitialValues
      : emailFormInitialValues,
    validationSchema: Boolean(selectedOption === "interview")
      ? interviewFormValidationSchema
      : emailFormValidationSchema,
    onSubmit: (values) => {
      submitReviewForm(values);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (selectedOption === "interview") {
      formik.setValues({
        ...formik.values,
        ...interviewFormInitialValues,
      });
    } else {
      formik.setValues({
        ...formik.values,
        ...emailFormInitialValues,
      });
    }
    handleEmailText();
  }, [selectedOption]);

  useEffect(() => {
    if (params.id) {
      getData();
      setIsLoading(false);
    }
  }, [params.id]);

  const filteredData = data.filter((e) => {
    switch (tab) {
      case "active":
        return e.status === "applied";

      case "interview":
        return e.status === "interview";

      case "shortlisted":
        return e.status === "shortlisted";

      case "hired":
        return e.status === "hired";

      case "rejected":
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
    universityName,
    selectedOption
  ) => {
    if (selectedOption === "shortlisted") {
      return `Dear ${candidateName},
    
We are pleased to inform you that you have been shortlisted for the ${jobTitle} position at ${universityName}. Further details regarding the next steps of the recruitment process will be communicated to you shortly.
    
Best regards,
${employerName}
${departmentName}
${universityName}`;
    } else if (selectedOption === "interview") {
      return `Dear ${candidateName},
      
You have been invited to an interview for the ${jobTitle} position at ${universityName}. You can find further information on your job application page.
      
Best regards,
${employerName}
${departmentName}
${universityName}`;
    } else if (selectedOption === "rejected") {
      return `Dear ${candidateName},
    
Thank you for your interest in the ${jobTitle} position at ${universityName}. After careful consideration, we regret to inform you that we will not be moving forward with your application. We appreciate the time you invested in your application and encourage you to apply for future opportunities that match your qualifications.
    
Best regards,
${employerName}
${departmentName}
${universityName}`;
    }
  };

  const handleEmailText = () => {
    const currentApplication = data.find(
      (application) => application._id === currentApplicationId
    );
    const emailBody = currentApplication
      ? defaultEmail(
          currentApplication.applicantId.userId?.firstname +
            " " +
            currentApplication.applicantId.userId?.lastname,
          currentApplication.jobId.title,
          currentApplication.jobId.createdBy.userId?.firstname +
            " " +
            currentApplication.jobId.createdBy.userId?.lastname,
          currentApplication.jobId.createdBy?.departmentName + " Department",
          currentApplication.jobId.createdBy?.universityName,
          selectedOption
        )
      : "Loading...";
    formik.setValues({
      emailSubject:
        selectedOption === "shortlisted"
          ? `Shortlisted for ${currentApplication.jobId.title} Position`
          : selectedOption === "rejected"
          ? `Rejected for ${currentApplication.jobId.title} Position`
          : selectedOption === "interview" &&
            `Interview for ${currentApplication.jobId.title} Position`,
      emailBody: emailBody,
    });
  };

  const submitReviewForm = async (values) => {
    setIsSubmitting(() => true);
    try {
      const currentApplication = data.find(
        (application) => application._id === currentApplicationId
      );
      let sendData = {
        email: currentApplication.applicantId.userId.email,
        subject: values.emailSubject,
        text: values.emailBody,
        status: selectedOption,
      };
      if (values.mode === "in-person" || values.mode === "online") {
        sendData.mode = values.mode;
        sendData.meetingURL = values.meetingURL;
        sendData.location = values.location;
        sendData.date = values.date;
        sendData.time = values.time;
      }

      const response = await http.put(
        `/employer/review/${currentApplication._id}`,
        sendData
      );
      console.log(response);

      if (response.status === 200) {
        getData();
        handleModalClose("reviewModal");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
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
          onClick={() => navigate("/dashboard/job-applications")}
        >
          Go Back
        </Button>
        <h5 className="text-center fw-semibold mt-3">
          Candidates for Job:{" "}
          <span className="fw-medium">{data[0]?.jobId?.title}</span>
        </h5>
        <hr className="mt-3 m-0" />
        <Tabs value={tab} onChange={handleTab}>
          <Tab label="Active" value="active" />
          <Tab label="Shortlisted" value="shortlisted" />
          <Tab label="Interview" value="interview" />
          <Tab label="Hired" value="hired" />
          <Tab label="Rejected" value="rejected" />
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
          {filteredData.length > 0 ? (
            filteredData.map((e, index) => (
              <div
                className="candidate-card p-3 rounded shadow col-12 col-md-5 col-lg-5 col-xl-3"
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
                  >{`${e.applicantId.userId.firstname[0]} ${e.applicantId.userId.lastname[0]}`}</Avatar>

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
                      color="primary"
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
                    color="info"
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
                    {Boolean(e.test?.status === "completed") && (
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
                        color="primary"
                        endIcon={<MarkEmailReadOutlinedIcon />}
                        fullWidth
                        onClick={() => handleModalOpen("reviewModal", e._id)}
                      >
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="d-flex align-items-center justify-content-center p-5 w-100 bg-body-secondary rounded">
              <div className="d-flex flex-column align-items-center ">
                <PersonOffOutlinedIcon color="disabled" fontSize="large" />
                <p className="text-secondary m-0">No candidates</p>
              </div>
            </div>
          )}
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
          open={open.reviewModal}
          onClose={() => handleModalClose("reviewModal")}
        >
          <Box sx={shortlistModalStyle}>
            <h4 className="fw-semibold text-center">Update Candidate</h4>
            <hr />
            <form onSubmit={formik.handleSubmit}>
              <div className="d-flex flex-column align-items-center justify-content-center mt-4">
                <Options applicationId={currentApplicationId} />
                {selectedOption === "interview" && (
                  <>
                    <TextField
                      select
                      label="Interview Mode"
                      onChange={(event) => {
                        formik.handleChange({
                          target: {
                            name: "mode",
                            value: event.target.value,
                          },
                        });
                        formik.setFieldValue("location", "");
                        formik.setFieldValue("meetingURL", "");
                        formik.setFieldValue("date", dayjs().add(1, "day"));
                        formik.setFieldValue("time", dayjs());
                      }}
                      onBlur={formik.handleBlur}
                      fullWidth
                      className="my-3"
                      value={formik.values.mode || ""}
                      name="mode"
                      error={
                        Boolean(formik.touched.mode) &&
                        Boolean(formik.errors.mode)
                      }
                      helperText={
                        Boolean(formik.errors.mode) &&
                        Boolean(formik.touched.mode) &&
                        formik.errors.mode
                      }
                    >
                      <MenuItem value="in-person">In-Person</MenuItem>
                      <MenuItem value="online">Online</MenuItem>
                    </TextField>
                    {formik.values.mode === "in-person" && (
                      <TextField
                        label="Location"
                        fullWidth
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mb-3"
                        value={formik.values?.location}
                        name="location"
                        error={
                          Boolean(formik.touched.location) &&
                          Boolean(formik.errors.location)
                        }
                        helperText={
                          Boolean(formik.errors.location) &&
                          Boolean(formik.touched.location) &&
                          formik.errors.location
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <LocationOnOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    {formik.values.mode === "online" && (
                      <TextField
                        label="Meeting Link"
                        fullWidth
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mb-3"
                        value={formik.values?.meetingURL}
                        name="meetingURL"
                        error={
                          Boolean(formik.touched.meetingURL) &&
                          Boolean(formik.errors.meetingURL)
                        }
                        helperText={
                          Boolean(formik.errors.meetingURL) &&
                          Boolean(formik.touched.meetingURL) &&
                          formik.errors.meetingURL
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <InsertLinkOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
                        className="my-2 w-100"
                        minDate={dayjs().add(1, "day")}
                        name="date"
                        value={formik.values?.date || dayjs().add(1, "day")}
                        onBlur={formik.handleBlur}
                        onChange={(newValue) => {
                          formik.handleChange({
                            target: {
                              name: "date",
                              value: newValue,
                            },
                          });
                        }}
                        slotProps={{
                          textField: {
                            helperText:
                              Boolean(formik.touched.date) &&
                              formik.errors.date,
                          },
                        }}
                        disabled={!Boolean(formik.values.mode)}
                      />

                      <TimePicker
                        label="Time"
                        className="my-2 w-100"
                        name="time"
                        value={formik.values?.time || dayjs()}
                        onBlur={formik.handleBlur}
                        onChange={(newValue) => {
                          formik.handleChange({
                            target: {
                              name: "time",
                              value: newValue,
                            },
                          });
                        }}
                        slotProps={{
                          textField: {
                            helperText:
                              Boolean(formik.touched.date) &&
                              formik.errors.time,
                          },
                        }}
                        disabled={!Boolean(formik.values.mode)}
                      />
                    </LocalizationProvider>
                  </>
                )}
                {Boolean(selectedOption) && (
                  <>
                    <h6 className="mt-3 fw-semibold align-self-start">Email</h6>
                    <TextField
                      fullWidth
                      label="Subject"
                      className="mb-3"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="emailSubject"
                      value={formik.values.emailSubject}
                      error={
                        Boolean(formik.touched.emailSubject) &&
                        Boolean(formik.errors.emailSubject)
                      }
                      helperText={
                        Boolean(formik.errors.emailSubject) &&
                        Boolean(formik.touched.emailSubject) &&
                        formik.errors.emailSubject
                      }
                    />
                    <TextField
                      multiline
                      fullWidth
                      rows={10}
                      label="Body"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="emailBody"
                      value={formik.values.emailBody}
                      error={
                        Boolean(formik.touched.emailBody) &&
                        Boolean(formik.errors.emailBody)
                      }
                      helperText={
                        Boolean(formik.errors.emailBody) &&
                        Boolean(formik.touched.emailBody) &&
                        formik.errors.emailBody
                      }
                    />
                  </>
                )}
                <Button
                  variant="contained"
                  className="w-50 mt-5"
                  disabled={
                    selectedOption === "" || !formik.isValid || isSubmitting
                  }
                  type="submit"
                >
                  {isSubmitting ? (
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border"></div>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default JobApplicationCandidates;
