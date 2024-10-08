import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  Avatar,
  Button,
  TextField,
  Chip,
  Alert,
  InputAdornment,
  Autocomplete,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { createFilterOptions } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import IconButton from "@mui/material/IconButton";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import QualificationForm from "./QualificationForm";
import ExperienceForm from "./ExperienceForm";
import { teacherProfileValidationSchema } from "../schemas";
import http from "../utils/http";
import { skillsList } from "../utils/formData";

const TeacherEditProfileForm = ({
  userData,
  setEditMode,
  updateUserData,
  role = null,
}) => {
  const navigate = useNavigate();
  const initialValues = {
    firstname: Boolean(userData.userId.firstname)
      ? userData.userId.firstname
      : "",
    lastname: Boolean(userData.userId.lastname) ? userData.userId.lastname : "",
    profileDescription: Boolean(userData.profileDescription)
      ? userData.profileDescription
      : "",

    gender: Boolean(userData.userId.gender) ? userData.userId.gender : "",
    email: Boolean(userData.userId.email) ? userData.userId.email : "",
  };
  const [qualificationsArray, setQualificationsArray] = useState(
    Boolean(userData.qualification.length > 0) ? userData.qualification : []
  );

  const [experiencesArray, setExperiencesArray] = useState(
    Boolean(userData.experience.length > 0) ? userData.experience : []
  );
  const [inputValue, setInputValue] = useState(""); //for autocomplete component
  const [skillsArray, setSkillsArray] = useState(
    userData.skills.length > 0 ? userData.skills : []
  );
  const skillRef = useRef(null);

  const serverURL = import.meta.env.VITE_BACKENDURL;
  const profileImage = serverURL + userData.profileImage?.split("public\\")[1];
  const [imageSrc, setImageSrc] = useState(
    Boolean(userData.profileImage) ? profileImage : null
  );

  const [image, setImage] = useState({
    file: "",
    URL: "",
    value: "",
    filename: "",
    isRemoved: false,
  });

  const resumeFile = serverURL + userData.resumeFile?.split("public\\")[1];
  const [resumeFileSrc, setResumeFileSrc] = useState(
    Boolean(userData.resumeFile) ? resumeFile : null
  );
  const [resume, setResume] = useState({
    file: "",
    URL: "",
    value: "",
    filename: resumeFileSrc ? resumeFileSrc.split("documents\\")[1] : "",
    isRemoved: false,
  });

  const [imageFileError, setImageFileError] = useState("");
  const [resumeFileError, setResumeFileError] = useState("");

  const addSkill = (skill) => {
    if (skill.trim() !== "") {
      setSkillsArray((prev) => [...prev, skill.trim()]);
    }
  };

  const deleteSkill = (index) => {
    setSkillsArray((skillArr) => {
      return skillArr.filter((skill, i) => i !== index);
    });
  };
  const FileMessageBox = () => {
    if (imageFileError) {
      return (
        <Alert variant="filled" severity="error">
          {imageFileError}
        </Alert>
      );
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

  const handleFile = (event) => {
    const file = event.target.files[0];
    const value = event.target.value;
    const filetype = file?.type;
    if (event.target.name === "profileImage") {
      const validImageTypes = ["image/png", "image/jpeg"];
      if (validImageTypes.includes(filetype)) {
        setImageFileError("");
        const imageURL = URL.createObjectURL(file);
        setImageSrc(imageURL);
        setImage((prevValue) => {
          return {
            file,
            URL: imageURL,
            value,
            filename: file.name,
            isRemoved: false,
          };
        });
      } else {
        setImageFileError("Image file must be JPG or PNG");
      }
    } else if (event.target.name === "resumeFile") {
      if (filetype === "application/pdf" && file.size <= 5 * 1024 * 1024) {
        setResumeFileError("");
        const resumeURL = URL.createObjectURL(file);
        setResumeFileSrc(resumeURL);
        setResume((prevValue) => {
          return {
            file,
            URL: resumeURL,
            value,
            filename: file.name,
            isRemoved: false,
          };
        });
      } else {
        setResumeFileError(
          "Resume file must be PDF and maximum filesize is 5MB"
        );
      }
    }
  };

  const deleteResumeFile = () => {
    setResumeFileSrc("");
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

  // console.log(resume);

  const submitData = async (values) => {
    const formData = new FormData();
    try {
      console.log(image);
      if (image.file) {
        formData.append("profileImage", image.file);
      } else if (image.isRemoved) {
        formData.append("profileImage", "");
      }
      formData.append("firstname", values.firstname);
      formData.append("lastname", values.lastname);
      if (role === "admin") {
        formData.append("gender", values.gender);
        formData.append("email", values.email);
      }
      formData.append("profileDescription", values.profileDescription);
      formData.append("qualification", JSON.stringify(qualificationsArray));
      formData.append("skills", JSON.stringify(skillsArray));
      formData.append("experience", JSON.stringify(experiencesArray));
      if (resume.file) {
        formData.append("resumeFile", resume.file);
      } else if (resume.isRemoved) {
        formData.append("resumeFile", "");
      }

      const response = await http.put(
        `/users/teacher-profile/${userData.userId._id}`,
        formData
      );
      console.log(response);
      updateUserData();
      setEditMode(false);
      if (role === null) {
        navigate("/dashboard/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: teacherProfileValidationSchema,
      onSubmit: (values, actions) => {
        console.log(values);
        if (!imageFileError || !resumeFileError) {
          submitData(values);
        }
      },
    });

  const RemoveImageButton = () => {
    return (
      imageSrc && (
        <Button
          className="mt-4 mb-3"
          variant="outlined"
          color="danger"
          sx={{ border: 2, ":hover": { border: 2 } }}
          startIcon={<ClearOutlinedIcon />}
          onClick={() => {
            setImage({
              file: "",
              URL: "",
              value: "",
              filename: "",
              isRemoved: true,
            });
            setImageSrc("");
          }}
        >
          Remove Image
        </Button>
      )
    );
  };

  const filterOptions = createFilterOptions({
    ignoreCase: true,
    matchFrom: "start",
    limit: 10,
  });

  return (
    <div className={`col-8 ${role === "admin" && "col-12"} mt-3 mx-auto`}>
      <div className="bg-white p-3 px-5 rounded grey-border">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="d-flex align-items-center justify-content-center flex-column gap-3">
            <Avatar sx={{ width: 120, height: 120 }} src={imageSrc}>
              {`${userData.userId.firstname[0]} ${userData.userId.lastname[0]}`}
            </Avatar>
            <div>
              <h3 className="fw-bold text-center mb-1">Profile Image</h3>
              <h6 className="text-secondary text-center">
                Upload your image. (JPG or PNG)
              </h6>
              <div className="buttons d-flex justify-content-center">
                <Button
                  className="mt-4 mb-3 me-3"
                  variant="outlined"
                  component="label"
                  sx={{ border: 2, ":hover": { border: 2 } }}
                  startIcon={<UploadIcon />}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    name="profileImage"
                    accept=".jpg, .png"
                    onChange={handleFile}
                  />
                </Button>
                <RemoveImageButton />
              </div>
            </div>
          </div>
          <FileMessageBox />
          <hr />
          <div className="name-fields d-flex justify-content-center gap-3">
            <TextField
              variant="outlined"
              type="text"
              label="First Name"
              className="mt-4"
              fullWidth
              name="firstname"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstname}
              helperText={
                Boolean(errors.firstname) &&
                Boolean(touched.firstname) &&
                errors.firstname
              }
              error={Boolean(touched.firstname) && Boolean(errors.firstname)}
            />
            <TextField
              variant="outlined"
              type="text"
              label="Last Name"
              className="mt-4"
              fullWidth
              name="lastname"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastname}
              helperText={
                Boolean(errors.lastname) &&
                Boolean(touched.lastname) &&
                errors.lastname
              }
              error={Boolean(touched.lastname) && Boolean(errors.lastname)}
            />
          </div>
          {role === "admin" && (
            <div className="my-3">
              <FormLabel className="mt-3" id="radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                aria-labelledby="radio-buttons-group-label"
                defaultValue="male"
                name="gender"
                row
                onChange={handleChange}
                value={values.gender}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>

              <TextField
                variant="outlined"
                type="email"
                label="Email"
                className="mt-4"
                fullWidth
                name="email"
                onChange={handleChange}
                value={values.email}
                helperText={
                  Boolean(errors.email) &&
                  Boolean(touched.email) &&
                  errors.email
                }
                error={Boolean(touched.email) && Boolean(errors.email)}
              />
            </div>
          )}
          <h3 className="fw-bold mt-4 mb-1">
            Profile Description
            <sup className="fs-5 text-danger">*</sup>
          </h3>
          <h6 className="text-secondary">Write about yourself.</h6>
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            className="my-3"
            name="profileDescription"
            value={values.profileDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={
              Boolean(errors.profileDescription) &&
              Boolean(touched.profileDescription) &&
              errors.profileDescription
            }
            error={
              Boolean(touched.profileDescription) &&
              Boolean(errors.profileDescription)
            }
          />
          <hr />
          <h3 className="fw-bold mt-4 mb-1">Qualification</h3>
          <h6 className="text-secondary mb-3">Add your qualification(s).</h6>

          <QualificationForm
            qualificationsArray={qualificationsArray}
            setQualificationsArray={setQualificationsArray}
          />

          <hr />
          <h3 className="fw-bold mt-4 mb-1">Experience</h3>
          <h6 className="text-secondary">Add your experience(s).</h6>
          <ExperienceForm
            experiencesArray={experiencesArray}
            setExperiencesArray={setExperiencesArray}
          />

          <hr />
          <h3 className="fw-bold mt-4 mb-1">Skills</h3>
          <h6 className="text-secondary">Add your skills.</h6>
          <div className="d-flex justify-content-center mt-4 mb-3">
            <Autocomplete
              freeSolo
              fullWidth
              options={skillsList.filter(
                (skill) => !skillsArray.includes(skill)
              )}
              disableClearable
              filterOptions={filterOptions}
              // getOptionLabel={(option) => option}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skill Name"
                  fullWidth
                  inputRef={skillRef}
                />
              )}
            />
            <IconButton
              size="large"
              color="primary"
              onClick={() => {
                addSkill(skillRef.current.value);
                skillRef.current.value = "";
                setInputValue("");
              }}
            >
              <AddOutlinedIcon />
            </IconButton>
          </div>
          <div className="d-flex gap-3 mb-5 flex-wrap">
            {skillsArray.map((skill, index) => {
              return (
                <Chip
                  key={index}
                  label={skill}
                  size="large"
                  onDelete={() => deleteSkill(index)}
                />
              );
            })}
          </div>
          <hr />
          <h3 className="fw-bold mt-4 mb-1">Resume</h3>
          <h6 className="text-secondary mb-4">
            Upload your resume (PDF, max filesize: 5MB)
          </h6>
          {resumeFileSrc && (
            <div className="bg-light-gray border border-dark-subtle rounded shadow-sm px-5 py-3 mb-1 d-flex align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center gap-3">
                <DescriptionOutlinedIcon fontSize="large" color="secondary" />
                <span>{resume.filename}</span>
              </div>
              <div>
                <a
                  href={resumeFileSrc}
                  download={resume.filename}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconButton size="large" color="secondary">
                    <FileDownloadOutlinedIcon />
                  </IconButton>
                </a>
                <IconButton color="danger" onClick={deleteResumeFile}>
                  <CancelOutlinedIcon />
                </IconButton>
              </div>
            </div>
          )}
          <div className="d-flex justify-content-center mb-1">
            <Button
              className="mt-4 mb-1 w-50"
              variant="outlined"
              component="label"
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
                onChange={handleFile}
              />
            </Button>
          </div>
          <ResumeFileMessageBox />
          <div className="d-flex justify-content-center mt-5 mb-3 gap-3">
            <Button
              variant="contained"
              type="submit"
              className="w-75"
              endIcon={<ArrowForwardOutlinedIcon />}
            >
              Save & Proceed
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherEditProfileForm;
