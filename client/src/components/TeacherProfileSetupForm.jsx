import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import InitialForm from "./InitialForm";
import { useFormik } from "formik";
import { Avatar, Button, TextField, MenuItem, Box, Chip } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import IconButton from "@mui/material/IconButton";
import QualificationForm from "./QualificationForm";
import ExperienceForm from "./ExperienceForm";

const TeacherProfileSetupForm = ({ userData }) => {
  console.log(userData);
  const [qualificationsArray, setQualificationsArray] = useState(
    Boolean(userData.qualification.length > 0)
      ? userData.qualification
      : [
          // {
          //   instituteName: "",
          //   field: "",
          //   level: "",
          //   grade: "",
          //   date: {
          //     startDate: "",
          //     endDate: "",
          //   },
          //   location: {
          //     country: "",
          //     city: "",
          //   },
          // },
        ]
  );

  const [experiencesArray, setExperiencesArray] = useState(
    Boolean(userData.experience.length > 0) ? userData.experience : []
  );

  const [skillsArray, setSkillsArray] = useState([]);
  const skillRef = useRef(null);

  const addSkill = (skill) => {
    console.log(skill);
    if (skill.trim() !== "") {
      setSkillsArray((prev) => [...prev, skill.trim()]);
    }
  };

  const deleteSkill = (index) => {
    setSkillsArray((skillArr) => {
      return skillArr.filter((skill, i) => i !== index);
    });
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
        name="profileDescription"
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
        <TextField label="Skill Name" fullWidth inputRef={skillRef} />
        <IconButton
          size="large"
          color="primary"
          onClick={() => {
            addSkill(skillRef.current.value);
            skillRef.current.value = "";
          }}
        >
          <AddOutlinedIcon />
        </IconButton>
      </div>
      <div className="d-flex gap-3 mb-5">
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
