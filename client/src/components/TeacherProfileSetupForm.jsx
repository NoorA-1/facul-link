import React from "react";
import InitialForm from "./InitialForm";
import { Avatar, Button, TextField } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import IconButton from "@mui/material/IconButton";

const TeacherProfileSetupForm = ({ userData }) => {
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
      <div className="d-flex justify-content-center">
        <Button
          className="mt-4 mb-3 w-50"
          variant="outlined"
          sx={{ border: 2, ":hover": { border: 2 } }}
          startIcon={<AddOutlinedIcon />}
        >
          Add Qualification
        </Button>
      </div>
      <hr />
      <h3 className="fw-bold mt-4 mb-1">Experience</h3>
      <h6 className="text-secondary">Add your experience(s).</h6>
      <div className="d-flex justify-content-center">
        <Button
          className="mt-4 mb-3 w-50"
          variant="outlined"
          sx={{ border: 2, ":hover": { border: 2 } }}
          startIcon={<AddOutlinedIcon />}
        >
          Add Experience
        </Button>
      </div>
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
