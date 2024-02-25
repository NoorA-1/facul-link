import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import {
  Autocomplete,
  Chip,
  Button,
  IconButton,
  MenuItem,
  TextField,
  createFilterOptions,
  Switch,
  FormControlLabel,
} from "@mui/material";

import React, { useState, useRef, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import { skillsList } from "../../utils/formData";
import { useFormik } from "formik";
import { jobPostValidationSchema } from "../../schemas";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import http from "../../utils/http";

const initialValues = {
  title: "",
  description: "",
  location: "",
  requiredQualification: "",
  requiredExperience: "",
  skills: [],
  isTestEnabled: false,
  hiringTest: "",
  endDate: null,
  totalPositions: 1,
};

export const loader = async () => {
  try {
    const { data } = await http.get("/employer/get-hiring-tests");
    return data;
  } catch (error) {
    return null;
  }
};

const PostJob = () => {
  const navigate = useNavigate();
  const testsData = useLoaderData();
  const params = useParams();
  const [editMode, setEditMode] = useState(false);

  const [startDate, setStartDate] = useState(dayjs().add(1, "day"));
  const [skillsArray, setSkillsArray] = useState([]);
  const skillRef = useRef(null);
  const addSkill = (skill) => {
    if (skill.trim() !== "") {
      setSkillsArray((prev) => [...prev, skill.trim()]);
    }
  };

  const deleteSkill = (index) => {
    const newSkillsArray = values.skills.filter((_, i) => i !== index);
    setFieldValue("skills", newSkillsArray);
    setSkillsArray(newSkillsArray);
  };
  const [inputValue, setInputValue] = useState("");

  const filterOptions = createFilterOptions({
    ignoreCase: true,
    matchFrom: "start",
    limit: 10,
  });
  const getData = async () => {
    try {
      const response = await http.get(`employer/jobs/${params.id}`);
      const data = response.data;
      setValues({
        title: data.title,
        description: data.description,
        location: data.location,
        requiredQualification: data.requiredQualification,
        requiredExperience: data.requiredExperience,
        skills: data.skills,
        isTestEnabled: data.isTestEnabled,
        hiringTest: data.hiringTest !== null ? data.hiringTest._id : "",
        totalPositions: data.totalPositions,
        endDate: dayjs(data.endDate),
      });

      setEditMode(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
  }, [params]);

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    setFieldError,
    setFieldTouched,
    errors,
    touched,
    isValid,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: jobPostValidationSchema,

    onSubmit: (values, actions) => {
      console.log(values);
      saveFormData(values);
      actions.resetForm();
    },
  });

  const saveFormData = async (values) => {
    try {
      let response;
      if (editMode) {
        response = await http.put(`/employer/jobs/${params.id}`, values);
      } else {
        response = await http.post("/employer/post-job", values);
      }
      console.log(response);
      if (editMode && response.status === 200) {
        // setSuccessMessage("Job updated successfully");
        navigate("/dashboard/post-job?status=updated");
        setEditMode(false);
      } else {
        navigate("/dashboard/post-job?status=posted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFieldValue("skills", skillsArray);
  }, [skillsArray]);
  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
      <Button
        variant="outlined"
        startIcon={<ArrowBackOutlinedIcon />}
        sx={{
          border: 2,
          ":hover": {
            border: 2,
          },
        }}
        onClick={() => navigate("/dashboard/post-job")}
      >
        Back
      </Button>
      <h3 className="fw-bold text-center">Post Job</h3>
      <hr />
      <div className="row flex-column align-items-center justify-content-start">
        <div className="col-6">
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Job or Course Title"
              className="mb-3"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.title) && Boolean(touched.title) && errors.title
              }
              error={Boolean(touched.title) && Boolean(errors.title)}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              className="mb-3"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.description) &&
                Boolean(touched.description) &&
                errors.description
              }
              error={
                Boolean(touched.description) && Boolean(errors.description)
              }
            />
            <TextField
              fullWidth
              label="Location"
              className="mb-3"
              name="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.location) &&
                Boolean(touched.location) &&
                errors.location
              }
              error={Boolean(touched.location) && Boolean(errors.location)}
            />
            <TextField
              fullWidth
              select
              variant="outlined"
              label="Required Qualification"
              className="mb-3"
              name="requiredQualification"
              value={values.requiredQualification}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.requiredQualification) &&
                Boolean(touched.requiredQualification) &&
                errors.requiredQualification
              }
              error={
                Boolean(touched.requiredQualification) &&
                Boolean(errors.requiredQualification)
              }
            >
              <MenuItem value="Bachelors">Bachelors</MenuItem>
              <MenuItem value="Masters">Masters</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              variant="outlined"
              label="Years of experience?"
              className="mb-3"
              name="requiredExperience"
              value={values.requiredExperience}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.requiredExperience) &&
                Boolean(touched.requiredExperience) &&
                errors.requiredExperience
              }
              error={
                Boolean(touched.requiredExperience) &&
                Boolean(errors.requiredExperience)
              }
            >
              <MenuItem value="0">Less than 1 Year</MenuItem>
              <MenuItem value="1">1 Year</MenuItem>
              <MenuItem value="2">2 Years</MenuItem>
              <MenuItem value="3">3 Years</MenuItem>
              <MenuItem value="4">4 Years</MenuItem>
              <MenuItem value="5">5 Years</MenuItem>
              <MenuItem value="6">6 Years</MenuItem>
              <MenuItem value="7">7 Years</MenuItem>
              <MenuItem value="8">8 Years</MenuItem>
              <MenuItem value="9">9 Years</MenuItem>
              <MenuItem value="10">10 Years</MenuItem>
            </TextField>
            <div className="d-flex">
              <Autocomplete
                value={values.skills}
                multiple
                freeSolo
                fullWidth
                options={skillsList.filter(
                  (skill) => !skillsArray.includes(skill)
                )}
                disableClearable
                filterOptions={filterOptions}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                onChange={(event, newValue) => {
                  const filteredValue = newValue.filter(
                    (item) => item.trim() !== ""
                  );
                  setFieldValue("skills", filteredValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={() => deleteSkill(index)}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={
                      Boolean(errors.skills) &&
                      Boolean(touched.skills) &&
                      errors.skills
                    }
                    error={Boolean(touched.skills) && Boolean(errors.skills)}
                    label="Required Skills"
                    inputRef={skillRef}
                    className="mb-2"
                  />
                )}
              />
            </div>

            <FormControlLabel
              control={
                <Switch
                  checked={values.isTestEnabled}
                  name="isTestEnabled"
                  color="primary"
                  onChange={(event) => {
                    handleChange(event);
                    setFieldValue("hiringTest", "");
                    setFieldError("hiringTest", "");
                    setFieldTouched("hiringTest", false);
                  }}
                  onBlur={handleBlur}
                  disabled={!testsData.length > 0}
                />
              }
              label="Conduct Hiring Test"
            />
            <TextField
              fullWidth
              select
              variant="outlined"
              label="Select Hiring Test"
              className="mb-1"
              name="hiringTest"
              value={values.hiringTest}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.hiringTest) &&
                Boolean(touched.hiringTest) &&
                errors.hiringTest
              }
              error={Boolean(touched.hiringTest) && Boolean(errors.hiringTest)}
              disabled={!values.isTestEnabled}
            >
              {testsData.map((e, index) => {
                return (
                  <MenuItem key={index} value={e._id}>
                    {e.title}
                  </MenuItem>
                );
              })}
            </TextField>
            {testsData.length === 0 && (
              <p>
                For conducting hiring test. You must add it{" "}
                <Link
                  to="/dashboard/hiring-tests"
                  className="fw-bold primary-link-color"
                >
                  here
                </Link>
              </p>
            )}
            <TextField
              fullWidth
              label="Number of Positions"
              className="my-3"
              name="totalPositions"
              value={values.totalPositions}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.totalPositions) &&
                Boolean(touched.totalPositions) &&
                errors.totalPositions
              }
              error={
                Boolean(touched.totalPositions) &&
                Boolean(errors.totalPositions)
              }
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                className="my-2 w-100"
                minDate={startDate}
                name="endDate"
                value={values.endDate}
                onBlur={handleBlur}
                onChange={(newValue) => {
                  handleChange({
                    target: {
                      name: "endDate",
                      value: newValue,
                    },
                  });
                }}
                slotProps={{
                  textField: {
                    helperText: errors.endDate,
                  },
                }}
              />
            </LocalizationProvider>
            <div className="d-flex justify-content-center mt-4">
              <Button
                type="submit"
                className="w-50"
                variant="contained"
                color="secondary"
                disabled={!isValid}
              >
                {editMode ? "Update" : "Post"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
