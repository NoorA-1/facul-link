import React, { useCallback, useState } from "react";
import InitialForm from "./InitialForm";
import { Avatar, Button, TextField, MenuItem } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import IconButton from "@mui/material/IconButton";
import Grow from "@mui/material/Grow";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const TeacherProfileSetupForm = ({ userData }) => {
  const QualificationForm = () => {
    const [qToggle, setQToggle] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().subtract(20, "year"));
    const [minEndDate, setMinEndDate] = useState(startDate.add(1, "month"));
    const handleQClick = useCallback(() => {
      setQToggle((prev) => !prev);
    });
    return (
      <>
        {qToggle && (
          <Grow in={qToggle}>
            <div className="bg-body-secondary border border-dark-subtle rounded shadow-sm px-5 py-3">
              <TextField
                fullWidth
                label="Institute Name"
                variant="outlined"
                className="mb-3 bg-white"
              />
              <TextField
                fullWidth
                label="Field of Study"
                variant="outlined"
                className="mb-3 bg-white"
              />
              <TextField
                select
                fullWidth
                label="Select Level of Study"
                className="mb-3 bg-white"
              >
                <MenuItem value={"School"}>School</MenuItem>
                <MenuItem value={"College"}>College</MenuItem>
                <MenuItem value={"Bachelors"}>Bachelors</MenuItem>
                <MenuItem value={"Masters"}>Masters</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Grade (e.g. A or A+)"
                variant="outlined"
                className="mb-3 bg-white"
              />

              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                className="mb-3 bg-white"
              />
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                className="mb-3 bg-white"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="d-flex justify-content-center gap-3">
                  <DatePicker
                    label="Start Date"
                    views={["month", "year"]}
                    disableFuture
                    value={startDate}
                    openTo="month"
                    onChange={(newValue) => {
                      setStartDate(newValue);
                      setMinEndDate(newValue.add(1, "month"));
                    }}
                    className="mb-3 bg-white"
                  />

                  <DatePicker
                    label="End Date"
                    views={["month", "year"]}
                    openTo="month"
                    minDate={minEndDate}
                    className="mb-3 bg-white"
                  />
                </div>
              </LocalizationProvider>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="contained">Save</Button>
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
                  onClick={handleQClick}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Grow>
        )}
        <div className="d-flex justify-content-center">
          <Button
            className="mt-4 mb-3 w-50"
            variant="outlined"
            sx={{ border: 2, ":hover": { border: 2 } }}
            startIcon={<AddOutlinedIcon />}
            disabled={qToggle}
            onClick={handleQClick}
          >
            Add Qualification
          </Button>
        </div>
      </>
    );
  };

  const ExperienceForm = () => {
    const [expToggle, setExpToggle] = useState(false);

    const [startDate, setStartDate] = useState(dayjs().subtract(20, "year"));
    const [minEndDate, setMinEndDate] = useState(startDate.add(1, "month"));

    const handleExpClick = useCallback(() => {
      setExpToggle((prev) => !prev);
    });

    return (
      <>
        {expToggle && (
          <Grow in={expToggle}>
            <div className="bg-body-secondary border border-dark-subtle rounded shadow-sm px-5 py-3">
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                className="mb-3 bg-white"
              />
              <TextField
                fullWidth
                label="Company"
                variant="outlined"
                className="mb-3 bg-white"
              />
              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                className="mb-3 bg-white"
              />
              <TextField
                fullWidth
                label="City"
                variant="outlined"
                className="mb-3 bg-white"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="d-flex justify-content-center gap-3">
                  <DatePicker
                    label="Start Date"
                    views={["month", "year"]}
                    disableFuture
                    value={startDate}
                    openTo="month"
                    onChange={(newValue) => {
                      setStartDate(newValue);
                      setMinEndDate(newValue.add(1, "month"));
                    }}
                    className="mb-3 bg-white"
                  />

                  <DatePicker
                    label="End Date"
                    views={["month", "year"]}
                    openTo="month"
                    minDate={minEndDate}
                    className="mb-3 bg-white"
                  />
                </div>
              </LocalizationProvider>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="contained">Save</Button>
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
                  onClick={handleExpClick}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Grow>
        )}
        <div className="d-flex justify-content-center">
          <Button
            className="mt-4 mb-3 w-50"
            variant="outlined"
            sx={{ border: 2, ":hover": { border: 2 } }}
            startIcon={<AddOutlinedIcon />}
            onClick={handleExpClick}
            disabled={expToggle}
          >
            Add Experience
          </Button>
        </div>
      </>
    );
  };

  return (
    <InitialForm noColoredLine={true} className="w-100 px-5 mt-3 mb-5">
      <div className="d-flex align-items-center justify-content-center flex-column gap-3">
        <Avatar sx={{ width: 120, height: 120 }}>
          {`${userData.userId.firstname[0]} ${userData.userId.lastname[0]}`}
        </Avatar>
        <div>
          <h3 className="fw-bold text-center mb-1">Profile Image</h3>
          <h6 className="text-secondary text-center">
            Upload your image. (JPG or PNG)
          </h6>
          <Button
            className="mt-4 mb-3"
            variant="outlined"
            component="label"
            sx={{ border: 2, ":hover": { border: 2 } }}
            fullWidth
            startIcon={<UploadIcon />}
          >
            Upload Image
            <input type="file" hidden accept=".jpg, .png" />
          </Button>
        </div>
      </div>
      <hr />
      <h3 className="fw-bold mt-4 mb-1">Profile Description</h3>
      <h6 className="text-secondary">Add a profile description.</h6>
      <TextField
        label="Description"
        multiline
        rows={4}
        fullWidth
        className="my-3"
      />
      <hr />
      <h3 className="fw-bold mt-4 mb-1">Qualification</h3>
      <h6 className="text-secondary">Add your qualification(s).</h6>
      <QualificationForm />

      <hr />
      <h3 className="fw-bold mt-4 mb-1">Experience</h3>
      <h6 className="text-secondary">Add your experience(s).</h6>
      <ExperienceForm />

      <hr />
      <h3 className="fw-bold mt-4 mb-1">Skills</h3>
      <h6 className="text-secondary">Add your skills.</h6>
      <div className="d-flex justify-content-center mt-4 mb-5">
        <TextField label="Skill Name" fullWidth />
        <IconButton size="large" color="primary">
          <AddOutlinedIcon />
        </IconButton>
      </div>
      <hr />
      <h3 className="fw-bold mt-4 mb-1">Resume</h3>
      <h6 className="text-secondary">Upload your resume (PDF)</h6>
      <div className="d-flex justify-content-center mb-5">
        <Button
          className="mt-4 mb-3 w-50"
          variant="outlined"
          component="label"
          sx={{ border: 2, ":hover": { border: 2 } }}
          startIcon={<UploadIcon />}
        >
          Upload Resume
          <input type="file" hidden accept=".pdf" />
        </Button>
      </div>
      <div className="d-flex justify-content-center mb-3 gap-3">
        <Button variant="contained" className="w-75">
          Submit
        </Button>
      </div>
    </InitialForm>
  );
};

export default TeacherProfileSetupForm;
