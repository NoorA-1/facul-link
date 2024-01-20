import React, { useState } from "react";
import InitialForm from "./InitialForm";
import { useFormik } from "formik";
import {
  Avatar,
  Button,
  TextField,
  Alert,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

import { employerProfileValidationSchema } from "../schemas";

const EmployerProfileSetupForm = ({ userData }) => {
  const initialValues = {
    firstname: Boolean(userData.userId.firstname)
      ? userData.userId.firstname
      : "",
    lastname: Boolean(userData.userId.lastname) ? userData.userId.lastname : "",
    profileDescription: Boolean(userData.profileDescription)
      ? userData.profileDescription
      : "",
    universityname: Boolean(userData.universityName)
      ? userData.universityName
      : "",
    departmentname: Boolean(userData.departmentName)
      ? userData.departmentName
      : "",
  };

  const [imageSrc, setImageSrc] = useState(
    Boolean(userData.profileImage) ? profileImage : null
  );

  const [image, setImage] = useState({
    file: "",
    URL: "",
    value: "",
    filename: "",
  });

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: employerProfileValidationSchema,
      onSubmit: (values, actions) => {
        console.log(values);
        if (!imageFileError) {
          submitData(values);
        }
      },
    });

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
          };
        });
      } else {
        setImageFileError("Image file must be JPG or PNG");
      }
    }
  };
  const [imageFileError, setImageFileError] = useState("");

  const FileMessageBox = () => {
    if (imageFileError) {
      return (
        <Alert variant="filled" severity="error">
          {imageFileError}
        </Alert>
      );
    }
  };

  return (
    <InitialForm noColoredLine={true} className="w-100 px-5 mt-3 mb-5">
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
            <Button
              className="mt-4 mb-3"
              variant="outlined"
              component="label"
              sx={{ border: 2, ":hover": { border: 2 } }}
              fullWidth
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
          </div>
        </div>
        <hr className="mb-3" />
        <div className="d-flex align-items-center justify-content-center flex-column gap-3 mt-3">
          <Avatar sx={{ width: 80, height: 80 }} src={imageSrc}></Avatar>
          <div>
            <h3 className="fw-bold text-center mb-1">University Logo</h3>
            <h6 className="text-secondary text-center">
              Upload your logo. (JPG or PNG)
            </h6>
            <Button
              className="mt-4 mb-3"
              variant="outlined"
              component="label"
              sx={{ border: 2, ":hover": { border: 2 } }}
              fullWidth
              startIcon={<UploadIcon />}
            >
              Upload Logo
              <input
                type="file"
                hidden
                name="profileImage"
                accept=".jpg, .png"
                onChange={handleFile}
              />
            </Button>
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
        <hr />
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

        <h3 className="fw-bold mt-4 mb-1">
          University Name
          <sup className="fs-5 text-danger">*</sup>
        </h3>
        <TextField
          variant="outlined"
          type="text"
          label="University Name"
          fullWidth
          className="mt-4 mb-3"
          name="universityname"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.universityname}
          helperText={
            Boolean(errors.universityname) &&
            Boolean(touched.universityname) &&
            errors.universityname
          }
          error={
            Boolean(touched.universityname) && Boolean(errors.universityname)
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <BusinessOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
        <hr />
        <h3 className="fw-bold mt-4 mb-1">
          Department Name
          <sup className="fs-5 text-danger">*</sup>
        </h3>
        <TextField
          select
          variant="outlined"
          label="Department"
          fullWidth
          className="mt-4 mb-3"
          name="departmentname"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.departmentname}
          helperText={
            Boolean(errors.departmentname) &&
            Boolean(touched.departmentname) &&
            errors.departmentname
          }
          error={
            Boolean(touched.departmentname) && Boolean(errors.departmentname)
          }
        >
          <MenuItem value={"Computer Science"}>Computer Science</MenuItem>
          <MenuItem value={"Media Science"}>Media Science</MenuItem>
          <MenuItem value={"Management Science"}>Management Science</MenuItem>
          <MenuItem value={"Engineering"}>Engineering</MenuItem>
        </TextField>
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
    </InitialForm>
  );
};

export default EmployerProfileSetupForm;
