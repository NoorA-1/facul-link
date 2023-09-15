import React from "react";
import { FormWrapper, InitialForm } from "../components";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { employerSignUpValidationSchema } from "../schemas";

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

const EmployerSignUpPage = () => {
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: employerSignUpValidationSchema,
      onSubmit: (values) => {
        console.log(values);
      },
    });
  return (
    <FormWrapper>
      <InitialForm>
        <h3 className="text-center fw-bold text-uppercase mt-2">
          Sign Up as Employer
        </h3>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="px-sm-5">
            <div className="d-flex gap-3">
              <TextField
                variant="outlined"
                type="text"
                label="First Name"
                className="mt-4"
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
              />
              <TextField
                variant="outlined"
                type="text"
                label="Last Name"
                className="mt-4 "
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
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
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
                Boolean(touched.universityname) &&
                Boolean(errors.universityname)
              }
            />
            <TextField
              variant="outlined"
              type="text"
              label="Department Name"
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
            />
            <TextField
              variant="outlined"
              type="password"
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
            />
            <TextField
              variant="outlined"
              type="password"
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
              error={
                Boolean(touched.conpassword) && Boolean(errors.conpassword)
              }
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="mt-5 mb-4"
            >
              Sign Up
            </Button>

            <p className="text-center">
              Already have an Account?{" "}
              <Link to="/sign-in" className="project-name">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </InitialForm>
    </FormWrapper>
  );
};

export default EmployerSignUpPage;