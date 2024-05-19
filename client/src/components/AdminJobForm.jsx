import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  Chip,
  MenuItem,
  Autocomplete,
  createFilterOptions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AdminJobForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  testsData,
  skillsList,
  programNamesList,
}) => {
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
    validationSchema,
    onSubmit,
  });
  const [startDate, setStartDate] = useState(dayjs().add(1, "day"));
  const [qualificationFieldsArray, setQualificationFieldsArray] = useState([]);
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
  const [fieldInputValue, setFieldInputValue] = useState("");

  const handleQualificationFieldChange = (event, newValue) => {
    const filteredValue = newValue.filter((item) => item.trim() !== "");
    setFieldValue("requiredQualification.field", filteredValue);
  };

  const deleteQualificationField = (index) => {
    const newFieldsArray = values.requiredQualification.field.filter(
      (_, i) => i !== index
    );
    setFieldValue("requiredQualification.field", newFieldsArray);
    setQualificationFieldsArray(newFieldsArray);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  };

  const filterOptions = createFilterOptions({
    ignoreCase: true,
    matchFrom: "start",
    limit: 10,
  });

  return (
    <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
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
        label="Required Qualification "
        className="mb-3"
        name="requiredQualification.degree"
        value={values.requiredQualification?.degree}
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={
          Boolean(errors.requiredQualification?.degree) &&
          Boolean(touched.requiredQualification?.degree) &&
          errors.requiredQualification?.degree
        }
        error={
          Boolean(touched.requiredQualification?.degree) &&
          Boolean(errors.requiredQualification?.degree)
        }
      >
        <MenuItem value="Bachelors">Bachelors</MenuItem>
        <MenuItem value="Masters">Masters</MenuItem>
      </TextField>

      <Autocomplete
        fullWidth
        disableClearable
        multiple
        freeSolo
        onBlur={() => setFieldTouched("requiredQualification.field", true)}
        options={
          values.requiredQualification.field.length >= 5
            ? []
            : programNamesList.filter(
                (field) => !values.requiredQualification.field.includes(field)
              )
        }
        value={values.requiredQualification.field}
        onChange={handleQualificationFieldChange}
        inputValue={fieldInputValue}
        onInputChange={(event, newInputValue) => {
          if (values.requiredQualification.field.length < 5) {
            setFieldInputValue(newInputValue);
          }
        }}
        filterOptions={filterOptions}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              className="me-1"
              key={index}
              label={option}
              onDelete={() => {
                deleteQualificationField(index);
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Qualification Programs"
            placeholder="Required qualification programs"
            helperText={
              Boolean(errors.requiredQualification?.field) &&
              Boolean(touched.requiredQualification?.field) &&
              errors.requiredQualification?.field
            }
            error={
              Boolean(touched.requiredQualification?.field) &&
              Boolean(errors.requiredQualification?.field)
            }
            className="mb-2"
          />
        )}
      />
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
        {/* <MenuItem value="0">Less than 1 Year</MenuItem> */}
        <MenuItem value="1">1 Year</MenuItem>
        <MenuItem value="2">2 Years</MenuItem>
        <MenuItem value="3">3 Years</MenuItem>
        <MenuItem value="4">4 Years</MenuItem>
        <MenuItem value="5">5 Years</MenuItem>
        <MenuItem value="6">More than 5 Years</MenuItem>
      </TextField>
      <div className="d-flex">
        <Autocomplete
          value={values.skills}
          multiple
          freeSolo
          fullWidth
          onBlur={() => setFieldTouched("skills", true)}
          options={
            values.skills.length >= 8
              ? []
              : skillsList.filter((skill) => !values.skills.includes(skill))
          }
          disableClearable
          filterOptions={filterOptions}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            if (values.skills.length < 8) {
              setInputValue(newInputValue);
            }
          }}
          onChange={(event, newValue) => {
            const filteredValue = newValue.filter((item) => item.trim() !== "");
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
          Boolean(touched.totalPositions) && Boolean(errors.totalPositions)
        }
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Closing Date"
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
          Update
        </Button>
      </div>
    </form>
  );
};

export default AdminJobForm;
