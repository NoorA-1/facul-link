import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import UploadIcon from "@mui/icons-material/Upload";

import {
  Box,
  Button,
  MenuItem,
  Modal,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  IconButton,
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
import { CandidateCard } from "../../components";

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
  const [tab, setTab] = useState("applied");
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [files, setFiles] = useState([]);

  const handleFile = (event) => {
    const newFiles = Array.from(event.target.files);
    const totalFiles = [...files, ...newFiles].slice(0, 5);
    setFiles(totalFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((e, i) => i !== index));
  };

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
    setFiles([]);
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
        {application &&
          (application.status === "shortlisted" ||
            application.status === "interview") && (
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
    setFiles([]);
  }, [selectedOption]);

  useEffect(() => {
    if (params.id) {
      getData();
      setIsLoading(false);
    }
  }, [params.id]);

  const filteredData = data.filter((e) => {
    switch (tab) {
      case "applied":
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
    } else if (selectedOption === "hired") {
      return `Dear ${candidateName},
      
You have been hired for the ${jobTitle} position at ${universityName}.
      
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
          : selectedOption === "interview"
          ? `Interview for ${currentApplication.jobId.title} Position`
          : selectedOption === "hired" &&
            `Hired for ${currentApplication.jobId.title} Position`,
      emailBody: emailBody,
    });
  };

  const submitReviewForm = async (values) => {
    setIsSubmitting(() => true);
    try {
      const currentApplication = data.find(
        (application) => application._id === currentApplicationId
      );
      const formData = new FormData();
      formData.append("email", currentApplication.applicantId.userId.email);
      formData.append("subject", values.emailSubject);
      formData.append("text", values.emailBody);
      formData.append("status", selectedOption);
      if (values.mode === "in-person" || values.mode === "online") {
        formData.append("mode", values.mode);
        formData.append("meetingURL", values.meetingURL);
        formData.append("location", values.location);
        formData.append("date", values.date);
        formData.append("time", values.time);
      }

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await http.put(
        `/employer/review/${currentApplication._id}`,
        formData
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
        {data[0]?.jobId?.totalPositions <= 0 && (
          <p className="text-danger fw-semibold text-center">
            All positions for this job have been filled
          </p>
        )}
        <hr className="mt-3 m-0" />
        <Tabs value={tab} onChange={handleTab}>
          <Tab label="Applied" value="applied" />
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
              : "justify-content-between"
          }`}
          style={{
            gap: "10px",
          }}
        >
          {filteredData.length > 0 ? (
            filteredData.map((e, index) => (
              <CandidateCard
                key={index}
                candidate={e}
                navigate={navigate}
                testScore={testScore}
                // profileImage={profileImage}
                // resumeFileSrc={resumeFileSrc}
                // resumeFileName={resumeFileName}
                handleModalOpen={handleModalOpen}
              />
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
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
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

                    {files.length < 5 && (
                      <Button
                        className="mt-4 mb-1 w-50"
                        variant="outlined"
                        component="label"
                        sx={{ border: 2, ":hover": { border: 2 } }}
                        startIcon={<UploadIcon />}
                      >
                        Attachments
                        <input
                          type="file"
                          hidden
                          multiple
                          // accept=".jpg, .png, .pdf"
                          onChange={handleFile}
                        />
                      </Button>
                    )}

                    {files.length >= 5 && (
                      <p className="text-danger">
                        Maximum of 5 files can be attached.
                      </p>
                    )}

                    {files.length > 0 && (
                      <div>
                        <p className="mt-2 mb-1 fw-medium">Attachments: </p>

                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="bg-light-gray border border-dark-subtle rounded shadow-sm px-5 py-3 mb-2 d-flex align-items-center justify-content-between gap-2"
                          >
                            <div className="d-flex align-items-center gap-3">
                              <DescriptionOutlinedIcon
                                fontSize="large"
                                color="secondary"
                              />
                              <span>{file.name}</span>
                            </div>

                            <div>
                              <a
                                href={URL.createObjectURL(file)}
                                download={file.filename}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <IconButton size="large" color="secondary">
                                  <FileDownloadOutlinedIcon />
                                </IconButton>
                              </a>

                              <IconButton
                                color="danger"
                                onClick={() => removeFile(index)}
                              >
                                <CancelOutlinedIcon />
                              </IconButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
