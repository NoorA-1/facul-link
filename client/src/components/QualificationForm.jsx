import React, { memo, useCallback, useMemo, useState } from "react";
import { useFormik } from "formik";
import Modal from "@mui/material/Modal";
import { Avatar, Button, TextField, MenuItem, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import IconButton from "@mui/material/IconButton";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { teacherQualificationValidationSchema } from "../schemas";
import dayjs from "dayjs";

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
  qualification: {
    instituteName: "",
    field: "",
    level: "",
    grade: "",
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

const QualificationForm = memo(
  ({ qualificationsArray, setQualificationsArray }) => {
    const [startDate, setStartDate] = useState(dayjs());
    const [minEndDate, setMinEndDate] = useState(startDate.add(1, "month"));
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      setOpen(false);
      setStartDate(dayjs());
      setMinEndDate(startDate.add(1, "month"));
      resetForm();
    };
    const [editMode, setEditMode] = useState({
      isEditMode: false,
      index: null,
    });

    // console.log("Start Date" + startDate + ", End Date" + minEndDate);
    const {
      values,
      handleBlur,
      handleChange,
      handleSubmit,
      errors,
      touched,
      resetForm,
    } = useFormik({
      initialValues,
      validationSchema: teacherQualificationValidationSchema,
      onSubmit: (values, actions) => {
        console.log(values);
        saveFormData(values);
        actions.resetForm();
        handleClose();
      },
    });

    const saveFormData = (values, actions) => {
      if (!editMode.isEditMode) {
        setQualificationsArray((prev) => [...prev, values.qualification]);
      } else {
        setQualificationsArray((arr) => {
          return arr.map((e, i) => {
            return i === editMode.index ? values.qualification : e;
          });
        });
        setEditMode({
          isEditMode: false,
          index: null,
        });
      }
    };

    const newQualification = () => {
      resetForm();
      setStartDate(dayjs());
      setMinEndDate(startDate.add(1, "month"));
      setEditMode({
        isEditMode: false,
        index: null,
      });
      values.qualification = {
        instituteName: "",
        field: "",
        level: "",
        grade: "",
        date: {
          startDate: "",
          endDate: "",
        },
        location: {
          country: "",
          city: "",
        },
      };
      values.qualification.date.startDate = startDate;
      values.qualification.date.endDate = startDate.add(1, "month");
      handleOpen();
    };

    const editQualification = (index) => {
      setEditMode({
        isEditMode: true,
        index,
      });
      values.qualification = qualificationsArray[index];
      values.qualification.date.startDate = dayjs(
        values.qualification.date.startDate
      );
      values.qualification.date.endDate = dayjs(
        values.qualification.date.endDate
      );
      setStartDate(dayjs());
      setMinEndDate(values.qualification.date.startDate.add(1, "month"));
      handleOpen();
    };

    const deleteQualification = (index) => {
      setQualificationsArray((prev) =>
        prev.filter((e, i) => prev[i] !== prev[index])
      );
    };

    // const removeQualification = (index) => {
    //   formik.values.qualification.splice(index, 1);
    // };
    return (
      <>
        {qualificationsArray &&
          qualificationsArray.map((e, index) => {
            return (
              <div
                className="bg-light-gray border border-dark-subtle rounded shadow-sm px-5 py-3 mb-3"
                key={index}
              >
                <div className="mb-2">
                  <p className="fw-bold d-inline">Institute:</p>{" "}
                  <p className="d-inline">{e.instituteName}</p>
                </div>
                <div className="mb-2">
                  <p className="fw-bold d-inline">Field of Study:</p>{" "}
                  <p className="d-inline">{e.field}</p>
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
                    {dayjs(e.date.endDate).format("MMM - YYYY")}
                  </p>
                </div>
                <div className="d-flex justify-content-end">
                  <IconButton
                    onClick={() => editQualification(index)}
                    color="secondary"
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    color="danger"
                    onClick={() => deleteQualification(index)}
                  >
                    <CancelOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            );
          })}
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <h3 className="text-center fw-bold mb-5">Qualification</h3>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Institute Name"
                variant="outlined"
                className="mb-3 bg-white"
                name="qualification.instituteName"
                value={values.qualification.instituteName}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  Boolean(errors.qualification?.instituteName) &&
                  Boolean(touched.qualification?.instituteName) &&
                  errors.qualification?.instituteName
                }
                error={
                  Boolean(touched.qualification?.instituteName) &&
                  Boolean(errors.qualification?.instituteName)
                }
              />
              <TextField
                fullWidth
                label="Field of Study"
                variant="outlined"
                className="mb-3 bg-white"
                name="qualification.field"
                value={values.qualification.field}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  Boolean(errors.qualification?.field) &&
                  Boolean(touched.qualification?.field) &&
                  errors.qualification?.field
                }
                error={
                  Boolean(touched.qualification?.field) &&
                  Boolean(errors.qualification?.field)
                }
              />
              <TextField
                select
                fullWidth
                label="Level of Study"
                className="mb-3 bg-white"
                name="qualification.level"
                value={values.qualification.level}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  Boolean(errors.qualification?.level) &&
                  Boolean(touched.qualification?.level) &&
                  errors.qualification?.level
                }
                error={
                  Boolean(touched.qualification?.level) &&
                  Boolean(errors.qualification?.level)
                }
              >
                <MenuItem value={"School"}>School</MenuItem>
                <MenuItem value={"College"}>College</MenuItem>
                <MenuItem value={"Bachelors"}>Bachelors</MenuItem>
                <MenuItem value={"Masters"}>Masters</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Grade or GPA"
                variant="outlined"
                className="mb-3 bg-white"
                name="qualification.grade"
                value={values.qualification.grade}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  Boolean(errors.qualification?.grade) &&
                  Boolean(touched.qualification?.grade) &&
                  errors.qualification?.grade
                }
                error={
                  Boolean(touched.qualification?.grade) &&
                  Boolean(errors.qualification?.grade)
                }
              />

              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                className="mb-3 bg-white"
                name="qualification.location.country"
                value={values.qualification.location.country}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  Boolean(errors.qualification?.location?.country) &&
                  Boolean(touched.qualification?.location?.country) &&
                  errors.qualification?.location.country
                }
                error={
                  Boolean(touched.qualification?.location?.country) &&
                  Boolean(errors.qualification?.location?.country)
                }
              />
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                className="mb-3 bg-white"
                name="qualification.location.city"
                value={values.qualification.location.city}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  Boolean(errors.qualification?.location?.city) &&
                  Boolean(touched.qualification?.location?.city) &&
                  errors.qualification?.location?.city
                }
                error={
                  Boolean(touched.qualification?.location?.city) &&
                  Boolean(errors.qualification?.location?.city)
                }
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="d-flex justify-content-center gap-3">
                  <DatePicker
                    label="Start Date"
                    views={["month", "year"]}
                    disableFuture
                    openTo="month"
                    className="mb-3 bg-white"
                    onChange={(newValue) => {
                      setStartDate(newValue);
                      setMinEndDate(newValue.add(1, "month"));
                      handleChange({
                        target: {
                          name: "qualification.date.startDate",
                          value: newValue,
                        },
                      });
                    }}
                    name="qualification.date.startDate"
                    value={values.qualification.date.startDate}
                    onBlur={handleBlur}
                  />

                  <DatePicker
                    label="End Date"
                    views={["month", "year"]}
                    openTo="month"
                    minDate={minEndDate}
                    className="mb-3 bg-white"
                    name="qualification.date.endDate"
                    value={values.qualification.date.endDate}
                    onBlur={handleBlur}
                    onChange={(newValue) => {
                      handleChange({
                        target: {
                          name: "qualification.date.endDate",
                          value: newValue,
                        },
                      });
                    }}
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
          </Box>
        </Modal>

        <div className="d-flex justify-content-center">
          <Button
            className="mt-4 mb-3 w-50"
            variant="outlined"
            sx={{ border: 2, ":hover": { border: 2 } }}
            startIcon={<AddOutlinedIcon />}
            disabled={open}
            onClick={newQualification}
          >
            Add Qualification
          </Button>
        </div>
      </>
    );
  }
);

export default QualificationForm;
