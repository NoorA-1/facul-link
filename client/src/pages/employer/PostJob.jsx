import { TextField } from "@mui/material";
import React from "react";

const PostJob = () => {
  return (
    <div className="container my-3 bg-white py-3 px-5 rounded grey-border">
      <h3 className="fw-bold text-center">Post Job</h3>
      <hr />
      <div className="d-flex flex-column align-items-center justify-content-start">
        <TextField variant="outlined" label="Job Title" className="w-50" />
        <TextField label="Job Description" multiline rows={4} />
        <TextField label="Location" />
        {/* required qualification (bachelors or masters), experience num, skills, test select (no or any test), end date */}
      </div>
    </div>
  );
};

export default PostJob;
