import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Autocomplete,
  Chip,
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
};

const PostJob = () => {
  const [startDate, setStartDate] = useState(dayjs().add(1, "day"));
  const [skillsArray, setSkillsArray] = useState([]);
  const skillRef = useRef(null);
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
  const [inputValue, setInputValue] = useState("");

  const filterOptions = createFilterOptions({
    ignoreCase: true,
    matchFrom: "start",
    limit: 10,
  });

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: jobPostValidationSchema,

    onSubmit: (values, actions) => {
      console.log(values);
      saveFormData(values);
      actions.resetForm();
      handleClose();
    },
  });

  useEffect(() => {
    setFieldValue("skills", skillsArray);
  }, [skillsArray]);
  console.log(errors);
  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
      <h3 className="fw-bold text-center">Post Job</h3>
      <hr />
      <div className="row flex-column align-items-center justify-content-start">
        <div className="col-6">
          <TextField
            fullWidth
            variant="outlined"
            label="Job Title"
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
            label="Job Description"
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
            error={Boolean(touched.description) && Boolean(errors.description)}
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
              value={skillsArray}
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
                setSkillsArray(newValue);
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
                  label="Skill Name"
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
                }}
                onBlur={handleBlur}
              />
            }
            label="Conduct Hiring Test"
          />
          <TextField
            fullWidth
            select
            variant="outlined"
            label="Select Hiring Test"
            className="mb-3"
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
            <MenuItem value="0">No Test</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="End Date"
              className="mb-3 w-100"
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

              // name="qualification.date.endDate"
              // value={values.qualification.date.endDate}
              // onBlur={handleBlur}
              // onChange={(newValue) => {
              //   handleChange({
              //     target: {
              //       name: "qualification.date.endDate",
              //       value: newValue,s
              //     },
              //   });
              // }}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
