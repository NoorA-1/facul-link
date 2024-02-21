import * as Yup from "yup";

const emailRegex = new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

//Minimum eight characters, at least one uppercase letter, one number and one special character
const passwordRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.])[A-Za-z\\d@$!%*?&.]{8,}$"
);

const onlyWhiteSpaceRegex = new RegExp("^(?!\\s*$).+");
const URLRegex =
  /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

export const signInValidationSchema = Yup.object({
  email: Yup.string()
    .matches(emailRegex, "Please enter valid email.")
    .required("Please enter email"),
  password: Yup.string().required("Please enter password"),
});

// const lettersSpaceOnlyRegex = new RegExp("^[a-zA-Z][a-zA-Z ]+$");
const lettersSpaceOnlyRegex = new RegExp("^[a-zA-Z]+( [a-zA-Z]+)*$");
const lettersNumbersSpaceOnlyRegex = new RegExp(
  "^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$"
);

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
    // .matches(lettersSpaceOnlyRegex, "Invalid university name")
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

export const changeEmailValidationSchema = new Yup.object({
  email: Yup.string()
    .matches(emailRegex, "Please enter valid email.")
    .required("Please enter email"),
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

export const teacherQualificationValidationSchema = Yup.object({
  qualification: Yup.object({
    instituteName: Yup.string()
      .required("Institute Name is required")
      .min(3, "Institute Name must be at least 3 characters long")
      .test(
        "is-empty-after-trim",
        "Institute Name cannot be empty or only whitespace",
        (value) => value.trim() !== ""
      ),
    field: Yup.string()
      .required("Field of Study is required")
      .min(2, "Field of Study must be at least 2 characters long")
      .test(
        "is-empty-after-trim",
        "Field of Study cannot be empty or only whitespace",
        (value) => value.trim() !== ""
      ),
    level: Yup.string().required("Qualification Title is required"),
    grade: Yup.string()
      .required("Grade is required")
      .min(1, "Grade or GPA must be at least 1 character long")
      .test(
        "is-empty-after-trim",
        "Grade cannot be empty or only whitespace",
        (value) => value.trim() !== ""
      ),
    date: Yup.object({
      startDate: Yup.date().required("Start Date is required"),
      endDate: Yup.string().required("End Date is required"),
      // .min(Yup.ref("startDate"), "End date can't be before start date"),
    }),
    location: Yup.object({
      country: Yup.string()
        .required("Country is required")
        .matches(lettersSpaceOnlyRegex, "Invalid Country name")
        .min(3, "Country must be at least 3 characters long"),
      city: Yup.string()
        .required("City is required")
        .matches(lettersSpaceOnlyRegex, "Invalid City name")
        .min(3, "City must be at least 3 characters long"),
    }),
  }),
});

export const teacherExperienceFormValidationSchema = Yup.object({
  experience: Yup.object({
    title: Yup.string()
      .required("Job Title is required")
      .min(3, "Job Title must be at least 3 characters long")
      .test(
        "is-empty-after-trim",
        "Field of Study cannot be empty or only whitespace",
        (value) => value.trim() !== ""
      ),
    company: Yup.string()
      .required("Company Name is required")
      .test(
        "is-empty-after-trim",
        "Field of Study cannot be empty or only whitespace",
        (value) => value.trim() !== ""
      ),
    // .min(3, "Company Name must be at least 3 characters long"),
    date: Yup.object({
      startDate: Yup.date().required("Start Date is required"),
      endDate: Yup.date()
        // .min(Yup.ref("startDate"), "End date can't be before start date")
        .nullable(),
    }),
    location: Yup.object({
      country: Yup.string()
        .required("Country is required")
        .matches(lettersSpaceOnlyRegex, "Invalid Country name")
        .min(3, "Country must be at least 3 characters long"),
      city: Yup.string()
        .required("City is required")
        .matches(lettersSpaceOnlyRegex, "Invalid City name")
        .min(3, "Country must be at least 3 characters long"),
    }),
    isCurrentlyWorking: Yup.boolean(),
  }),
});

export const teacherProfileValidationSchema = Yup.object({
  firstname: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid first name")
    .required("Please enter first name"),
  lastname: Yup.string()
    .min(3, "Last name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid last name")
    .required("Please enter last name"),
  profileDescription: Yup.string()
    .required("Description is required")
    .min(5, "Description must be at least 3 characters long")
    .test(
      "is-empty-after-trim",
      "Description cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
});

export const employerProfileValidationSchema = Yup.object({
  firstname: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid first name")
    .required("Please enter first name"),
  lastname: Yup.string()
    .min(3, "Last name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid last name")
    .required("Please enter last name"),
  profileDescription: Yup.string()
    .required("Description is required")
    .min(5, "Description must be at least 3 characters long")
    .test(
      "is-empty-after-trim",
      "Description cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  universityname: Yup.string()
    .min(5, "University name must be at least 5 characters long")
    // .matches(lettersSpaceOnlyRegex, "Invalid university name")
    .required("Please enter university name"),
  universityURL: Yup.string()
    .url("Must be a valid URL")
    .transform((currentValue) => {
      const notStartsWithHTTP =
        currentValue &&
        !(
          currentValue.startsWith("http://") ||
          currentValue.startsWith("https://")
        );

      if (notStartsWithHTTP) {
        return `http://${currentValue}`;
      }
      return currentValue;
    })
    .required("Please provide university website"),
  departmentname: Yup.string()
    .matches(lettersSpaceOnlyRegex, "Invalid department name")
    .required("Please select department name"),
});

export const employerEditProfileValidationSchema = Yup.object({
  firstname: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid first name")
    .required("Please enter first name"),
  lastname: Yup.string()
    .min(3, "Last name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid last name")
    .required("Please enter last name"),
  profileDescription: Yup.string()
    .required("Description is required")
    .min(5, "Description must be at least 3 characters long")
    .test(
      "is-empty-after-trim",
      "Description cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  universityURL: Yup.string()
    .url("Must be a valid URL")
    .transform((currentValue) => {
      const notStartsWithHTTP =
        currentValue &&
        !(
          currentValue.startsWith("http://") ||
          currentValue.startsWith("https://")
        );

      if (notStartsWithHTTP) {
        return `http://${currentValue}`;
      }
      return currentValue;
    })
    .required("Please provide university website"),
});

export const adminEditEmployerValidationSchema = Yup.object({
  firstname: Yup.string()
    .min(3, "First name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid first name")
    .required("Please enter first name"),
  lastname: Yup.string()
    .min(3, "Last name must be at least 3 characters long")
    .matches(lettersSpaceOnlyRegex, "Invalid last name")
    .required("Please enter last name"),
  email: Yup.string()
    .matches(emailRegex, "Please enter valid email.")
    .required("Please enter email"),
  departmentname: Yup.string()
    .matches(lettersSpaceOnlyRegex, "Invalid department name")
    .required("Please select department name"),
  universityURL: Yup.string()
    .url("Must be a valid URL")
    .transform((currentValue) => {
      const notStartsWithHTTP =
        currentValue &&
        !(
          currentValue.startsWith("http://") ||
          currentValue.startsWith("https://")
        );

      if (notStartsWithHTTP) {
        return `http://${currentValue}`;
      }
      return currentValue;
    })
    .required("Please provide university website"),
});

export const hiringTestAddQuestionSchema = Yup.object({
  question: Yup.string()
    .min(3, "Question must be at least 3 characters long")
    .required("Question is required")
    .test(
      "is-empty-after-trim",
      "Question cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),

  optionA: Yup.string()
    .required("Option A is required")
    .test(
      "is-empty-after-trim",
      "Option A cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  optionB: Yup.string()
    .required("Option B is required")
    .test(
      "is-empty-after-trim",
      "Option B cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  optionC: Yup.string()
    .required("Option C is required")
    .test(
      "is-empty-after-trim",
      "Option C cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  optionD: Yup.string()
    .required("Option D is required")
    .test(
      "is-empty-after-trim",
      "Option D cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  correctOption: Yup.string().required("Correct option is required"),
});

export const hiringTestSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters long")
    .required("Title is required")
    .test(
      "is-empty-after-trim",
      "Title cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  duration: Yup.string().required("Duration is required"),
  questions: Yup.array().required().min(1, "Questions are required"),
});

export const jobPostValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters long")
    .required("Title is required")
    .test(
      "is-empty-after-trim",
      "Title cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  description: Yup.string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters long")
    .test(
      "is-empty-after-trim",
      "Description cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  location: Yup.string()
    .min(3, "Title must be at least 3 characters long")
    .required("Location is required")
    .test(
      "is-empty-after-trim",
      "Title cannot be empty or only whitespace",
      (value) => value.trim() !== ""
    ),
  requiredQualification: Yup.string().required(
    "Qualification must be provided"
  ),
  requiredExperience: Yup.string().required("Experience must be provided"),
  skills: Yup.array().required().min(1, "Skills are required"),
  isTestEnabled: Yup.boolean(),
  hiringTest: Yup.string().when("isTestEnabled", {
    is: (isTestEnabled) => isTestEnabled === true,
    then: () => Yup.string().required("Hiring Test is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  endDate: Yup.date().required("End date must be provided"),
});
