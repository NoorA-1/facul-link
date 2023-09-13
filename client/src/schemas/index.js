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
