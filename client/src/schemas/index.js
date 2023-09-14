import * as Yup from "yup";

//Minimum eight characters, at least one uppercase letter, one number and one special character
const passwordRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
);

export const signInValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter valid email.")
    .required("Please enter email"),
  password: Yup.string()
    .matches(passwordRegex, "Please enter valid password")
    .required("Please enter password"),
});

const lettersSpaceOnlyRegex = new RegExp("^[a-zA-Z][a-zA-Z ]+$");

export const teacherSignUpValidationSchema = new Yup.object({
  firstname: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid first name")
    .required("Please enter first name"),
  lastname: Yup.string()
    .min(3, "Last name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid last name")
    .required("Please enter last name"),
  gender: Yup.string().required("Please enter gender"),
  email: Yup.string()
    .email("Please enter valid email.")
    .required("Please enter email"),
  password: Yup.string()
    .matches(passwordRegex, "Please enter valid password")
    .required("Please enter password"),
  conpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please enter confirm password"),
});

export const employerSignUpValidationSchema = new Yup.object({
  firstname: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid first name")
    .required("Please enter first name"),
  lastname: Yup.string()
    .min(3, "Last name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid last name")
    .required("Please enter last name"),
  gender: Yup.string().required("Please enter gender"),
  universityname: Yup.string()
    .min(3, "University name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid university name")
    .required("Please enter university name"),
  departmentname: Yup.string()
    .min(3, "Department name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid department name")
    .required("Please enter department name"),
  email: Yup.string()
    .email("Please enter valid email.")
    .required("Please enter email"),
  password: Yup.string()
    .matches(passwordRegex, "Please enter valid password")
    .required("Please enter password"),
  conpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please enter confirm password"),
});
