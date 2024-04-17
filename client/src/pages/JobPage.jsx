import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import http from "../utils/http";
import {
  Avatar,
  Button,
  Chip,
  IconButton,
  Modal,
  Box,
  Radio,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { serverURL } from "../utils/formData";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import UploadIcon from "@mui/icons-material/Upload";

import ListAltIcon from "@mui/icons-material/ListAlt";
import dayjs from "dayjs";
import { useDashboardContext } from "./DashboardLayout";
import { PhoneInput } from "../components";
import { useFormik } from "formik";
import { submitJobApplicationValidationSchema } from "../schemas";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  contactNumber: "",
};

const JobPage = () => {
  const params = useParams();
  const { userData, setUserData, setIsTestMode } = useDashboardContext();
  const navigate = useNavigate();
  // console.log(userData);
  const [jobData, setJobData] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isJobApplied, setIsJobApplied] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    resetForm();
  };
  const handleClose = () => {
    setOpen(false);
    deleteResumeFile();
    setSelectedValue("a");
  };
  const [selectedValue, setSelectedValue] = useState("a");

  const [resume, setResume] = useState({
    file: "",
    URL: "",
    filename: "",
    isRemoved: false,
  });
  const [resumeFileError, setResumeFileError] = useState(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: submitJobApplicationValidationSchema,
    onSubmit: async (values, actions) => {
      const isCorrectSubmission = await submitApplication(values);
      if (isCorrectSubmission) {
        if (Boolean(jobData.hiringTest)) {
          setIsTestMode(true);
          navigate(`/dashboard/job-application/hiring-test/${jobData._id}`);
        } else {
          setIsTestMode(false);
          navigate(`/dashboard/success/${jobData._id}?status=submitted`);
        }
      } else {
        return;
      }
    },
  });

  const getData = async () => {
    try {
      const response = await http.get(`/employer/jobs/${params.id}`);
      const data = response.data;
      setJobData(() => data);
      console.log(data);

      await checkTestStatusAndRedirect(data._id, data?.hiringTest?._id);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkTestStatusAndRedirect = async (jobId, testId = null) => {
    try {
      if (userData.user.userId.role === "teacher") {
        const { data } = await http.get(
          `/teacher/job-application/test-status/${jobId}`
        );
        console.log(data);
        if (data.notFound) {
          return;
        }

        const { status } = data;
        const { jobStatus } = data;

        if (
          Boolean(testId) &&
          jobStatus === "pending" &&
          (status === "pending" || status === "in progress")
        ) {
          setIsTestMode(true);
          navigate(`/dashboard/job-application/hiring-test/${params.id}`);
        } else if (jobStatus === "applied") {
          setIsTestMode(false);
          setIsJobApplied(true);
        }
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
    updateUserData();
  }, [params.id]);

  const updateUserData = async () => {
    const { data } = await http.get("/users/current-user");
    setUserData(() => data);
  };

  const bookmarkJob = async (jobId) => {
    try {
      const response = await http.post(`/teacher/bookmark/${jobId}`);
      console.log(response);
      updateUserData();
    } catch (error) {
      console.log(error);
    }
  };

  const unBookmarkJob = async (jobId) => {
    try {
      const response = await http.delete(`/teacher/bookmark/${jobId}`);
      console.log(response);
      updateUserData();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
    if (event.target.value === "a") {
      setResume({
        file: "",
        URL: "",
        value: "",
        filename: "",
        isRemoved: false,
      });
      setResumeFileError(false);
    }
  };

  const handleResumeChange = (event) => {
    const file = event.target.files[0];
    if (file?.type === "application/pdf") {
      setResumeFileError("");
      const resumeURL = URL.createObjectURL(file);
      setResume({
        file,
        URL: resumeURL,
        value: event.target.value,
        filename: file.name,
        isRemoved: false,
      });
    } else {
      setResumeFileError("Resume file must be PDF");
    }
  };

  const ResumeFileMessageBox = () => {
    if (resumeFileError) {
      return (
        <Alert variant="filled" severity="error">
          {resumeFileError}
        </Alert>
      );
    }
  };

  const deleteResumeFile = () => {
    setResume(() => {
      return {
        file: "",
        URL: "",
        value: "",
        filename: "",
        isRemoved: true,
      };
    });
  };

  const submitApplication = async (values) => {
    try {
      if (!userData.user.resumeFile && !resume.file) {
        setResumeFileError("A resume is required to submit the application.");
        return false;
      } else if (selectedValue === "b" && !resume.file) {
        setResumeFileError("A resume is required to submit the application.");
        return false;
      }
      const formData = new FormData();
      const contactNumber = values.contactNumber.replace(/\s+/g, "");
      formData.append("applicantId", userData.user._id);
      formData.append("jobId", jobData._id);
      if (selectedValue === "b" && resume.file) {
        formData.append("newResumeFile", resume.file);
      } else if (selectedValue === "a" && userData.user.resumeFile) {
        formData.append("resumeFile", userData.user.resumeFile);
      } else if (resume.file) {
        formData.append("newResumeFile", resume.file);
      }

      formData.append("contactNumber", contactNumber);

      if (!jobData.hiringTest) {
        const test = {
          status: "no test",
        };
        formData.append("test", JSON.stringify(test));
        formData.append("status", "applied");
      } else {
        const test = {
          status: "pending",
        };
        formData.append("test", JSON.stringify(test));
        formData.append("status", "pending");
      }

      const response = await http.post("/teacher/job-application", formData);
      console.log(response);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <div className="container mx-auto my-3">
      <div className="bg-white py-4 rounded grey-border px-5">
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="d-flex flex-sm-row flex-column align-items-center justify-content-between">
              <h4 className="fw-bold mt-3">{jobData.title}</h4>
              {userData.user.userId.role === "teacher" &&
              !userData.user.bookmarks.includes(jobData._id) ? (
                <Button
                  startIcon={<BookmarkBorderOutlinedIcon />}
                  onClick={() => bookmarkJob(jobData._id)}
                  className="mt-3 mt-lg-0 "
                  variant="outlined"
                  size="small"
                  sx={{
                    border: 2,
                    ":hover": {
                      border: 2,
                    },
                  }}
                >
                  Bookmark
                </Button>
              ) : (
                userData.user.userId.role === "teacher" && (
                  <Button
                    startIcon={<BookmarkOutlinedIcon />}
                    onClick={() => unBookmarkJob(jobData._id)}
                    className="mt-3 mt-lg-0 "
                    variant="outlined"
                    size="small"
                    sx={{
                      border: 2,
                      ":hover": {
                        border: 2,
                      },
                    }}
                  >
                    Unbookmark
                  </Button>
                )
              )}
            </div>
            <div className="d-flex align-items-center mt-3 mb-4 flex-wrap">
              <div className="d-flex align-items-center gap-2 me-5">
                <Avatar
                  src={`${serverURL}${
                    jobData.createdBy.universityLogo &&
                    jobData.createdBy.universityLogo.split("public\\")[1]
                  }`}
                  variant="rounded"
                  sx={{ width: 35, height: 35 }}
                  alt={jobData.createdBy.universityName[0]}
                />
                <p className="m-0 fw-semibold">
                  {jobData.createdBy.universityName}
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <LocationOnOutlinedIcon fontSize="small" />
                <p className="m-0 fw-semibold">{jobData.location}</p>
              </div>
              <hr className="w-100" />
            </div>

            <div className="descriptive-section">
              <h6 className="fw-semibold">Description</h6>
              <p>{jobData.description}</p>
              <h6 className="fw-semibold mt-4">Required Qualification:</h6>
              <ul>
                <li>
                  {jobData.requiredQualification.field.length === 1
                    ? `${jobData.requiredQualification.degree} in `
                    : `${jobData.requiredQualification.degree} in any of the following fields:`}
                  {jobData.requiredQualification.field.map((e, index) => {
                    if (
                      index ===
                        jobData.requiredQualification.field.length - 1 &&
                      jobData.requiredQualification.field.length === 1
                    ) {
                      return e;
                    } else if (
                      index ===
                        jobData.requiredQualification.field.length - 1 &&
                      jobData.requiredQualification.field.length > 1
                    ) {
                      return (
                        <ul key={index}>
                          <li>{e}</li>
                        </ul>
                      );
                    } else {
                      return (
                        <ul key={index}>
                          <li>{e}</li>
                        </ul>
                      );
                    }
                  })}
                </li>
              </ul>
              <h6 className="fw-semibold mt-4">Required Experience:</h6>
              <ul>
                <li>
                  {jobData.requiredExperience > 1
                    ? jobData.requiredExperience >= 6
                      ? "More than 5 years"
                      : `${jobData.requiredExperience} Years`
                    : `${jobData.requiredExperience} Year`}
                </li>
              </ul>
              <h6 className="fw-semibold mt-4">Required Skills:</h6>
              <div className="d-flex gap-2 flex-wrap">
                {jobData.skills &&
                  jobData.skills.map((skill, index) => {
                    return <Chip key={index} label={skill} />;
                  })}
              </div>
            </div>
            <div className="dateinfo-section my-5">
              <h6 className="fw-semibold">
                Number of Positions:{" "}
                <span className="fw-normal">{jobData.totalPositions}</span>
              </h6>
              <h6 className="fw-semibold">
                Posted Date:{" "}
                <span className="fw-normal">
                  {dayjs(jobData.createdAt).format("DD MMMM YYYY")}
                </span>
              </h6>
              <h6 className="fw-semibold">
                Closing Date:{" "}
                <span className="fw-normal">
                  {dayjs(jobData.endDate).format("DD MMMM YYYY")}
                </span>
              </h6>
            </div>
          </div>
          <div className="col-lg-3 col-12 offset-lg-1 mt-3 mt-lg-0">
            <div
              className="bg-white mt-5 p-3 w-100 rounded shadow d-flex flex-column align-items-center justify-content-center"
              style={{ border: "1px solid #0A9396" }}
            >
              <Avatar
                src={`${serverURL}${
                  jobData.createdBy.profileImage &&
                  jobData.createdBy.profileImage.split("public\\")[1]
                }`}
                sx={{ width: 80, height: 80 }}
              />
              <h4 className="fw-semibold">{`${jobData.createdBy.userId.firstname} ${jobData.createdBy.userId.lastname}`}</h4>
              <p>{jobData.createdBy.departmentName} Department</p>
              <hr className="w-100" />
              <div className="d-flex align-items-center gap-2">
                <Avatar
                  src={`${serverURL}${
                    jobData.createdBy.universityLogo &&
                    jobData.createdBy.universityLogo.split("public\\")[1]
                  }`}
                  variant="rounded"
                  sx={{ width: 40, height: 40 }}
                  className="mt-1"
                  alt={jobData.createdBy.universityName[0]}
                />
                <p className="m-0 fw-semibold">
                  {jobData.createdBy.universityName}
                </p>
              </div>
              <Button
                variant="outlined"
                className="mt-4 mb-3"
                sx={{
                  border: 2,
                  ":hover": {
                    border: 2,
                  },
                }}
                onClick={() =>
                  jobData.createdBy._id === userData.user._id
                    ? navigate("/dashboard/profile")
                    : navigate(
                        `/dashboard/employer-profile/${jobData.createdBy.userId._id}`
                      )
                }
              >
                {jobData.createdBy._id === userData.user._id
                  ? "My Profile"
                  : "View Employer Profile"}
              </Button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 d-flex align-items-center flex-column justify-content-center mt-3 ">
            {isJobApplied && (
              <p
                className="fw-semibold"
                style={{
                  color: "#0a9396",
                }}
              >
                You have already applied for this job
              </p>
            )}
            {userData.user.userId.role !== "employer" && (
              <Button
                variant="contained"
                className="w-25 w-lg-50"
                onClick={handleOpen}
                disabled={isJobApplied}
              >
                {!isJobApplied ? "Apply Now" : "Applied"}
              </Button>
            )}
          </div>
        </div>
        {jobData.isTestEnabled && (
          <div className="row">
            <div className="col-12 d-flex justify-content-center mt-2">
              <ListAltIcon sx={{ fontSize: 25 }} color="primary" />
              <span className="fw-medium">
                This job requires an online hiring test
              </span>
            </div>
          </div>
        )}
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit}>
            <h3 className="text-center fw-bold">Apply</h3>
            <hr className="mb-5" />
            <div className="mb-4">
              <h5 className="fw-semibold">Email</h5>
              <p>{userData.user.userId.email}</p>
            </div>
            <div className="mb-4">
              <h5 className="fw-semibold">Contact Number</h5>
              <PhoneInput
                name="contactNumber"
                value={values.contactNumber}
                onChange={(value) => {
                  setFieldValue("contactNumber", value);
                }}
                onBlur={handleBlur}
                helperText={
                  Boolean(touched.contactNumber) && errors.contactNumber
                }
                error={
                  Boolean(touched.contactNumber) &&
                  Boolean(errors.contactNumber)
                }
              />
            </div>
            <div className="mb-4">
              <h5 className="fw-semibold">Resume</h5>
              {userData.user.resumeFile ? (
                <>
                  <div className="border border-1 border-secondary-subtle rounded p-2 px-4">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={selectedValue === "a"}
                          onChange={handleRadioChange}
                          value="a"
                          name="radio-buttons"
                          color="primary"
                        />
                      }
                      label={
                        userData.user.resumeFile
                          ? userData.user.resumeFile.split("documents\\")[1]
                          : ""
                      }
                    />
                    <p
                      style={{
                        color: "gray",
                        fontSize: "0.875rem",
                        // marginTop: "0.5rem",
                      }}
                      className="m-0"
                    >
                      Use existing resume
                    </p>
                  </div>
                  <p className="text-center my-3 text-secondary">or</p>
                  <div className="border border-1 border-secondary-subtle rounded p-2 px-4 mt-3">
                    <FormControlLabel
                      control={
                        <Radio
                          checked={selectedValue === "b"}
                          onChange={handleRadioChange}
                          value="b"
                          name="radio-buttons"
                          color="primary"
                        />
                      }
                      label={
                        Boolean(resume.value)
                          ? resume.filename
                          : "Upload new resume"
                      }
                    />

                    {selectedValue === "b" && (
                      <div className="d-flex justify-content-center">
                        <Button
                          className="my-1 w-50"
                          variant="outlined"
                          component="label"
                          sx={{ border: 2, ":hover": { border: 2 } }}
                          startIcon={<UploadIcon />}
                        >
                          Upload Resume
                          <input
                            type="file"
                            hidden
                            name="resumeFile"
                            accept=".pdf"
                            onChange={handleResumeChange}
                          />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="d-flex flex-column">
                  {Boolean(resume.value) && (
                    <div className="border border-1 border-secondary-subtle rounded p-2 px-4 d-flex align-items-center justify-content-between mb-3">
                      <p className="m-0">{resume.filename}</p>
                      <IconButton color="danger" onClick={deleteResumeFile}>
                        <CancelOutlinedIcon />
                      </IconButton>
                    </div>
                  )}
                  <Button
                    className="my-1"
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ border: 2, ":hover": { border: 2 } }}
                    startIcon={<UploadIcon />}
                  >
                    Upload Resume
                    <input
                      key={resume.isRemoved}
                      type="file"
                      hidden
                      name="resumeFile"
                      accept=".pdf"
                      onChange={handleResumeChange}
                    />
                  </Button>
                </div>
              )}
            </div>
            <ResumeFileMessageBox />

            <div className="mt-5 d-flex justify-content-center">
              <Button
                variant="contained"
                type="submit"
                color="secondary"
                endIcon={
                  Boolean(jobData.hiringTest) && <ArrowForwardOutlinedIcon />
                }
              >
                {Boolean(jobData.hiringTest)
                  ? "Proceed to Test"
                  : "Submit Application"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default JobPage;
