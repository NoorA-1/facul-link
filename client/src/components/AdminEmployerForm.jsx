import React, { useState } from "react";
import {
  Button,
  MenuItem,
  Autocomplete,
  createFilterOptions,
  IconButton,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Alert,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useFormik } from "formik";
import { employerSignUpValidationSchema } from "../schemas";
import http from "../utils/http";
import data from "../utils/universities";
import { programNamesList } from "../utils/formData";
import { Link } from "react-router-dom";

const initialValues = {
  firstname: "",
  lastname: "",
  gender: "male",
  universityname: "",
  departmentname: "",
  email: "",
  password: "",
  conpassword: "",
};

const AdminEmployerForm = ({ onSuccess }) => {
  const [alertError, setAlertError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    conpassword: false,
  });

  const handleClickShowPassword = (name) => {
    setShowPassword((prev) => {
      return { ...prev, [name]: !prev[name] };
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitSignUpData = async (data, actions) => {
    try {
      await http.post("/auth/sign-up", data);
      console.log(data);
      setAlertError("");
      setIsSuccess(true);
      actions.resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      const { message } = error.response.data;
      setAlertError(message);
      console.log(error);
    }
  };

  const {
    values,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    validateField,
    isValid,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: employerSignUpValidationSchema,
    onSubmit: (values, actions) => {
      const trimmedValues = {
        ...values,
        firstname: values.firstname.trim(),
        lastname: values.lastname.trim(),
      };
      console.log(trimmedValues);

      const role = "employer";
      submitSignUpData({ ...trimmedValues, role }, actions);
    },
  });

  const MessageBox = () => {
    if (alertError) {
      return (
        <Alert variant="filled" severity="error">
          {alertError}
        </Alert>
      );
    }
    if (isSuccess) {
      return (
        <Alert variant="filled" severity="success">
          Sign Up Successful
        </Alert>
      );
    }
  };

  const filterOptions = createFilterOptions({
    ignoreCase: true,
    matchFrom: "start",
    limit: 5,
  });

  const [inputValue, setInputValue] = useState("");

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="text-center fw-bold">Add Employer</h4>
      <hr />
      <MessageBox />
      <div className="px-sm-3">
        <div className="d-flex gap-3">
          <TextField
            variant="outlined"
            type="text"
            label="First Name"
            className="mt-4 w-100"
            onBlur={handleBlur}
            onChange={handleChange}
            name="firstname"
            value={values.firstname}
            helperText={
              Boolean(errors.firstname) &&
              Boolean(touched.firstname) &&
              errors.firstname
            }
            error={Boolean(touched.firstname) && Boolean(errors.firstname)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            type="text"
            label="Last Name"
            className="mt-4 w-100"
            name="lastname"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.lastname}
            helperText={
              Boolean(errors.lastname) &&
              Boolean(touched.lastname) &&
              errors.lastname
            }
            error={Boolean(touched.lastname) && Boolean(errors.lastname)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <FormLabel className="mt-3" id="radio-buttons-group-label">
          Gender
        </FormLabel>
        <RadioGroup
          aria-labelledby="radio-buttons-group-label"
          defaultValue="male"
          name="gender"
          row
          onChange={handleChange}
          value={values.gender}
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>
        <Autocomplete
          options={data}
          disableClearable
          getOptionLabel={(option) => option.label}
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

        <TextField
          variant="outlined"
          type="email"
          label="Email"
          fullWidth
          className="mb-3"
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.email}
          helperText={
            Boolean(errors.email) && Boolean(touched.email) && errors.email
          }
          error={Boolean(touched.email) && Boolean(errors.email)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmailOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          variant="outlined"
          type={showPassword.password ? "text" : "password"}
          label="Password"
          fullWidth
          className="mb-3"
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          helperText={
            Boolean(errors.password) &&
            Boolean(touched.password) &&
            errors.password
          }
          error={Boolean(touched.password) && Boolean(errors.password)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleClickShowPassword("password")}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword.password ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          variant="outlined"
          type={showPassword.conpassword ? "text" : "password"}
          label="Confirm Password"
          fullWidth
          name="conpassword"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.conpassword}
          helperText={
            Boolean(errors.conpassword) &&
            Boolean(touched.conpassword) &&
            errors.conpassword
          }
          error={Boolean(touched.conpassword) && Boolean(errors.conpassword)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleClickShowPassword("conpassword")}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword.conpassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div className="d-flex justify-content-center">
          <Button
            type="submit"
            variant="contained"
            className="w-50 mt-5 mb-4"
            disabled={!isValid}
          >
            Add
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AdminEmployerForm;
