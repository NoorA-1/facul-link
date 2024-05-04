import React, { memo, useCallback, useMemo, useState, useEffect } from "react";
import { useFormik } from "formik";
import Modal from "@mui/material/Modal";
import {
  Button,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import IconButton from "@mui/material/IconButton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { teacherExperienceFormValidationSchema } from "../schemas";
import http from "../utils/http";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  experience: {
    title: "",
    company: "",
    isCurrentlyWorking: false,
    date: {
      startDate: "",
      endDate: "",
    },
    location: {
      country: "",
      city: "",
    },
  },
};

const ExperienceForm = memo(({ experiencesArray, setExperiencesArray }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [minEndDate, setMinEndDate] = useState(startDate.add(1, "month"));
  const [searchParams, setSearchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();

    setStartDate(dayjs());
    setMinEndDate(startDate.add(1, "month"));
  };
  const [editMode, setEditMode] = useState({
    isEditMode: false,
    index: null,
  });
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);

  const handleIsCurrentlyWorking = () => {
    setIsCurrentlyWorking((prev) => {
      const newIsCurrentlyWorking = !prev;
      setFieldValue("experience.isCurrentlyWorking", newIsCurrentlyWorking);
      return newIsCurrentlyWorking;
    });
    if (isCurrentlyWorking) {
      setFieldValue("experience.date.endDate", dayjs().add(1, "month"));
    }
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    resetForm,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: teacherExperienceFormValidationSchema,
    onSubmit: (values, actions) => {
      console.log(values);
      saveFormData(values);
      actions.resetForm();
      handleClose();
    },
  });

  const saveFormData = (values, actions) => {
    if (!editMode.isEditMode) {
      if (isCurrentlyWorking) {
        values.experience.date.endDate = null;
      }
      setExperiencesArray((prev) => [...prev, values.experience]);
    } else {
      if (isCurrentlyWorking) {
        values.experience.date.endDate = null;
      }
      setExperiencesArray((arr) => {
        return arr.map((e, i) => {
          return i === editMode.index ? values.experience : e;
        });
      });
      setEditMode({
        isEditMode: false,
        index: null,
      });
    }
  };

  const newExperience = () => {
    resetForm();
    setStartDate(dayjs());
    setMinEndDate(startDate.add(1, "month"));
    setIsCurrentlyWorking(false);
    setEditMode({
      isEditMode: false,
      index: null,
    });
    values.experience = {
      title: "",
      company: "",
      isCurrentlyWorking: false,
      date: {
        startDate: "",
        endDate: "",
      },
      location: {
        country: "",
        city: "",
      },
    };
    values.experience.date.startDate = startDate;
    values.experience.date.endDate = startDate.add(1, "month");
    handleOpen();
  };

  const editExperience = (index) => {
    setEditMode({
      isEditMode: true,
      index,
    });
    values.experience = experiencesArray[index];
    // console.log(values.experience);
    values.experience.date.startDate = dayjs(values.experience.date.startDate);
    setIsCurrentlyWorking(() => values.experience.isCurrentlyWorking);
    if (!values.experience.isCurrentlyWorking) {
      setFieldValue(
        "experience.date.endDate",
        dayjs(values.experience.date.endDate)
      );
    } else {
      setFieldValue("experience.date.endDate", dayjs().add(1, "month"));
    }
    setStartDate(dayjs());
    setMinEndDate(values.experience.date.startDate.add(1, "month"));
    handleOpen();
  };

  const deleteExperience = (index) => {
    setExperiencesArray((prev) =>
      prev.filter((e, i) => prev[i] !== prev[index])
    );
  };

  const getApplication = async (applicationId) => {
    try {
      const { data } = await http.get(
        `/teacher/job-application/${applicationId}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (applicationId) {
        const data = await getApplication(applicationId);
        console.log(data);
        newExperience();
        handleIsCurrentlyWorking();
        setFieldValue("experience.title", data?.jobId?.title);
        setFieldValue("experience.location.country", "Pakistan");
        setFieldValue(
          "experience.company",
          data?.jobId?.createdBy?.universityName
        );
      }
    };
    fetchData();
  }, [searchParams]);

  return (
    <>
      {experiencesArray &&
        experiencesArray
          .sort((a, b) => dayjs(b.date.startDate) - dayjs(a.date.startDate))
          .map((e, index) => {
            return (
              <div
                className="bg-light-gray border border-dark-subtle rounded shadow-sm px-5 py-3 mb-3"
                key={index}
              >
                <div className="mb-2">
                  <p className="fw-bold d-inline">Job Title:</p>{" "}
                  <p className="d-inline">{e.title}</p>
                </div>
                <div className="mb-2">
                  <p className="fw-bold d-inline">Company:</p>{" "}
                  <p className="d-inline">{e.company}</p>
                </div>
                <div className="mb-2">
                  <p className="fw-bold d-inline">Start Date:</p>{" "}
                  <p className="d-inline">
                    {dayjs(e.date.startDate).format("MMM - YYYY")}
                  </p>
                </div>
                <div className="mb-1">
                  <p className="fw-bold d-inline">End Date:</p>{" "}
                  <p className="d-inline">
                    {!e.isCurrentlyWorking
                      ? dayjs(e.date.endDate).format("MMM - YYYY")
                      : "Present"}
                  </p>
                </div>
                <div className="d-flex justify-content-end">
                  <IconButton
                    onClick={() => editExperience(index)}
                    color="secondary"
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    color="danger"
                    onClick={() => deleteExperience(index)}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            );
          })}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h3 className="text-center fw-bold mb-5">Experience</h3>

          {/* <div className="bg-body-secondary border border-dark-subtle rounded shadow-sm px-5 py-3"> */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Job Title"
              variant="outlined"
              className="mb-3 bg-white"
              name="experience.title"
              value={values.experience.title}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.experience?.title) &&
                Boolean(touched.experience?.title) &&
                errors.experience?.title
              }
              error={
                Boolean(touched.experience?.title) &&
                Boolean(errors.experience?.title)
              }
            />
            <TextField
              fullWidth
              label="Company"
              variant="outlined"
              className="mb-3 bg-white"
              name="experience.company"
              value={values.experience.company}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.experience?.company) &&
                Boolean(touched.experience?.company) &&
                errors.experience?.company
              }
              error={
                Boolean(touched.experience?.company) &&
                Boolean(errors.experience?.company)
              }
            />
            <TextField
              fullWidth
              label="Country"
              variant="outlined"
              className="mb-3 bg-white"
              name="experience.location.country"
              value={values.experience.location.country}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.experience?.location?.country) &&
                Boolean(touched.experience?.location?.country) &&
                errors.experience?.location?.country
              }
              error={
                Boolean(touched.experience?.location?.country) &&
                Boolean(errors.experience?.location?.country)
              }
            />
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              className="mb-3 bg-white"
              name="experience.location.city"
              value={values.experience.location.city}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                Boolean(errors.experience?.location?.city) &&
                Boolean(touched.experience?.location?.city) &&
                errors.experience?.location?.city
              }
              error={
                Boolean(touched.experience?.location?.city) &&
                Boolean(errors.experience?.location?.city)
              }
            />
            <FormControlLabel
              control={<Checkbox />}
              label="I am currently working in this role"
              className="mb-3"
              checked={isCurrentlyWorking}
              onChange={handleIsCurrentlyWorking}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="d-flex justify-content-center gap-3">
                <DatePicker
                  label="Start Date"
                  views={["month", "year"]}
                  disableFuture
                  openTo="month"
                  className="mb-3 bg-white"
                  name="experience.date.startDate"
                  value={values.experience.date.startDate}
                  onBlur={handleBlur}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                    setMinEndDate(newValue.add(1, "month"));
                    handleChange({
                      target: {
                        name: "experience.date.startDate",
                        value: newValue,
                      },
                    });
                  }}
                />

                <DatePicker
                  label="End Date"
                  views={["month", "year"]}
                  openTo="month"
                  minDate={minEndDate}
                  maxDate={dayjs().add(1, "month")}
                  className="mb-3 bg-white"
                  name="experience.date.endDate"
                  value={dayjs(values.experience.date.endDate)}
                  onBlur={handleBlur}
                  onChange={(newValue) => {
                    handleChange({
                      target: {
                        name: "experience.date.endDate",
                        value: newValue,
                      },
                    });
                  }}
                  disabled={isCurrentlyWorking}
                  sx={{ display: isCurrentlyWorking && "none" }}
                />
              </div>
            </LocalizationProvider>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="contained" type="submit" color="secondary">
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{
                  border: 2,
                  borderColor: "#AE2012",
                  color: "#AE2012",
                  ":hover": {
                    border: 2,
                    borderColor: "#AE2012",
                  },
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </form>
          {/* </div> */}
        </Box>
      </Modal>

      <div className="d-flex justify-content-center">
        <Button
          className="mt-4 mb-3 w-50"
          variant="outlined"
          sx={{ border: 2, ":hover": { border: 2 } }}
          startIcon={<AddOutlinedIcon />}
          onClick={newExperience}
          disabled={open}
        >
          Add Experience
        </Button>
      </div>
    </>
  );
});

export default ExperienceForm;
