import * as Yup from "yup";

const emailRegex = new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

//Minimum eight characters, at least one uppercase letter, one number and one special character
const passwordRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.])[A-Za-z\\d@$!%*?&.]{8,}$"
);

export const signInValidationSchema = Yup.object({
  email: Yup.string()
    .matches(emailRegex, "Please enter valid email.")
    .required("Please enter email"),
  password: Yup.string().required("Please enter password"),
});

// const lettersSpaceOnlyRegex = new RegExp("^[a-zA-Z][a-zA-Z ]+$");
const lettersSpaceOnlyRegex = new RegExp("^[a-zA-Z]+( [a-zA-Z]+)*$");

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
    .matches(emailRegex, "Please enter valid email.")
    .required("Please enter email"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password should contain minimum eight characters (one uppercase, one numeric, one special, no whitespaces)"
    )
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
    .min(5, "University name must be at least 5 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid university name")
    .required("Please enter university name"),
  departmentname: Yup.string()
    // .min(3, "Department name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid department name")
    .required("Please select department name"),
  email: Yup.string()
    .matches(emailRegex, "Please enter valid email.")
    .required("Please enter email"),
  password: Yup.string()
    .matches(
      passwordRegex,
      "Password should contain minimum eight characters (one uppercase, one numeric, one special, no whitespaces)"
    )
    .required("Please enter password"),
  conpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please enter confirm password"),
});

export const changeNameValidationSchema = new Yup.object({
  firstname: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid first name")
    .required("Please enter first name"),
  lastname: Yup.string()
    .min(3, "Last name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid last name")
    .required("Please enter last name"),
});

export const changePasswordValidationSchema = new Yup.object({
  currentpassword: Yup.string()
    // .matches(
    //   passwordRegex,
    //   "Old password should contain minimum eight characters (one uppercase, one numeric, one special, no whitespaces)"
    // )
    .required("Please current password"),
  newpassword: Yup.string()
    .matches(
      passwordRegex,
      "New password should contain minimum eight characters (one uppercase, one numeric, one special, no whitespaces)"
    )
    .required("Please new password"),
  connewpassword: Yup.string()
    .oneOf([Yup.ref("newpassword")], "New passwords do not match")
    .required("Please enter confirm new password"),
});
