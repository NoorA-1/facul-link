import { body } from "express-validator";
import User from "../models/userModel.js";

export const validateSignUp = [
  body("firstname").notEmpty().withMessage("firstname is required"),
  body("lastname").notEmpty().withMessage("lastname is required"),
  body("gender").notEmpty().withMessage("gender is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is invalid")
    .custom(async (email) => {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        throw new Error("User already exists");
      }
    }),
  body("password").notEmpty().withMessage("password is required"),
  body("role").notEmpty().withMessage("role is required"),
];

export const validateSignIn = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is invalid"),
  body("password").notEmpty().withMessage("password is required"),
];
