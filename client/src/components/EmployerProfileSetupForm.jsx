import React, { useState } from "react";
import InitialForm from "./InitialForm";
import { useFormik } from "formik";
import {
  Avatar,
  Button,
  TextField,
  Autocomplete,
  createFilterOptions,
  Alert,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

import { employerProfileValidationSchema } from "../schemas";
import http from "../utils/http";
import data from "../utils/universities";
import { useNavigate } from "react-router-dom";
import { programNamesList } from "../utils/formData";

const EmployerProfileSetupForm = ({ userData }) => {
  const navigate = useNavigate();
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
    universityURL: Boolean(userData.universityURL)
      ? userData.universityURL
      : "",
    departmentname: Boolean(userData.departmentName)
      ? userData.departmentName
      : "",
  };

  const serverURL = "http://localhost:3000/";
  const profileImage = serverURL + userData.profileImage?.split("public\\")[1];
  const universityLogo =
    serverURL + userData.universityLogo?.split("public\\")[1];

  const [imageSrc, setImageSrc] = useState({
    profileImage: Boolean(userData.profileImage) ? profileImage : null,
    universityLogo: Boolean(userData.universityLogo) ? universityLogo : null,
  });

  const [image, setImage] = useState({
    profileImage: { file: "", URL: "", value: "", filename: "" },
    universityLogo: { file: "", URL: "", value: "", filename: "" },
  });

  const {
    values,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: employerProfileValidationSchema,
    onSubmit: (values, actions) => {
      console.log(values);
      if (!imageFileError.profileImage && !imageFileError.universityLogo) {
        submitData(values);
      }
    },
  });

  const submitData = async (values) => {
    const formData = new FormData();
    try {
      console.log(image);
      if (image.profileImage.file) {
        formData.append("profileImage", image.profileImage.file);
      }
      if (image.universityLogo.file) {
        formData.append("universityLogo", image.universityLogo.file);
      }
      formData.append("firstname", values.firstname);
      formData.append("lastname", values.lastname);
      formData.append("profileDescription", values.profileDescription);
      formData.append("universityName", values.universityname);
      formData.append("departmentName", values.departmentname);
      formData.append("universityURL", values.universityURL);

      const response = await http.put("/users/employer-profile", formData);
      console.log(response);
      navigate("/dashboard/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const handleFile = (event) => {
    const file = event.target.files[0];
    const value = event.target.value;
    const filetype = file?.type;
    const targetName = event.target.name;
    // if (event.target.name === "profileImage") {
    const validImageTypes = ["image/png", "image/jpeg"];
    if (validImageTypes.includes(filetype)) {
      setImageFileError((prev) => {
        return {
          ...prev,
          [targetName]: "",
        };
      });
      const imageURL = URL.createObjectURL(file);
      setImageSrc((prev) => {
        return {
          ...prev,
          [targetName]: imageURL,
        };
      });
      setImage((prevValue) => {
        return {
          ...prevValue,
          [targetName]: { file, URL: imageURL, value, filename: file.name },
        };
      });
    } else {
      setImageFileError((prev) => {
        return {
          ...prev,
          [targetName]: "Image file must be JPG or PNG",
        };
      });
    }
    // }
  };
  const [imageFileError, setImageFileError] = useState({
    profileImage: "",
    universityLogo: "",
  });

  console.log(imageFileError);

  const ProfileImageMessageBox = () => {
    if (imageFileError.profileImage) {
      return (
        <Alert variant="filled" severity="error">
          {imageFileError.profileImage}
        </Alert>
      );
    }
  };

  const LogoImageMessageBox = () => {
    if (imageFileError.universityLogo) {
      return (
        <Alert variant="filled" severity="error">
          {imageFileError.universityLogo}
        </Alert>
      );
    }
  };

  const filterOptions = createFilterOptions({
    ignoreCase: true,
    matchFrom: "start",
    limit: 5,
  });

  const [inputValue, setInputValue] = useState(
    Boolean(userData.departmentName) ? userData.departmentName : ""
  );

  return (
    <InitialForm noColoredLine={true} className="w-100 px-5 mt-3 mb-5">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="d-flex align-items-center justify-content-center flex-column gap-3">
          <Avatar sx={{ width: 120, height: 120 }} src={imageSrc.profileImage}>
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
        <ProfileImageMessageBox />

        <hr className="mb-3" />
        <div className="d-flex align-items-center justify-content-center flex-column gap-3 mt-3">
          <Avatar
            sx={{ width: 80, height: 80 }}
            src={imageSrc.universityLogo}
          ></Avatar>
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
                name="universityLogo"
                accept=".jpg, .png"
                onChange={handleFile}
              />
            </Button>
          </div>
        </div>

        <LogoImageMessageBox />
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
        <Autocomplete
          options={data}
          disableClearable
          value={values.universityname}
          // getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.label === value}
          onChange={(event, newValue) => {
            if (newValue !== "" && data.includes(newValue, 0)) {
              setFieldValue("universityname", newValue.label);
            }
            console.log(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="University Name"
              fullWidth
              className="mt-4 mb-3"
              name="universityname"
              onBlur={handleBlur}
              onChange={(event, newValue) => {
                if (newValue !== "" && data.includes(newValue, 0)) {
                  setFieldValue("universityname", newValue.label);
                }
              }}
              value={values.universityname}
              helperText={
                Boolean(errors.universityname) &&
                Boolean(touched.universityname) &&
                errors.universityname
              }
              error={
                Boolean(touched.universityname) &&
                Boolean(errors.universityname)
              }
            />
          )}
        />
        <hr />
        <h3 className="fw-bold mt-4 mb-1">
          University Website
          <sup className="fs-5 text-danger">*</sup>
        </h3>
        <TextField
          label="Website"
          fullWidth
          className="my-3"
          name="universityURL"
          value={values.universityURL}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={
            Boolean(errors.universityURL) &&
            Boolean(touched.universityURL) &&
            errors.universityURL
          }
          error={
            Boolean(touched.universityURL) && Boolean(errors.universityURL)
          }
        />
        <hr />
        <h3 className="fw-bold mt-4 mb-1">
          Department Name
          <sup className="fs-5 text-danger">*</sup>
        </h3>
        <Autocomplete
          freeSolo
          options={programNamesList}
          disableClearable
          filterOptions={filterOptions}
          inputValue={inputValue}
          onChange={(event, newValue) => {
            if (newValue !== "") {
              setFieldValue("departmentname", newValue);
            }
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(() => newInputValue);
            setFieldValue("departmentname", newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Department"
              fullWidth
              className="mb-3"
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
                Boolean(touched.departmentname) &&
                Boolean(errors.departmentname)
              }
            />
          )}
        />
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
