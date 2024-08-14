import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import UniEmployer from "../models/uniEmployerModel.js";
import { validationResult } from "express-validator";
import {
  validateSignUp,
  validateSignIn,
} from "../middlewares/validationMiddleware.js";
import { createJWTToken } from "../utils/tokenUtils.js";

router.post("/sign-up", validateSignUp, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        // errors: errors.array(),
        message: errors.array().map((err) => err.msg),
      });
    }
    // const isFirstAccount = User.countDocuments() ===0;
    // req.body.role = isFirstAccount ? "admin" : req.body.role;
    const { firstname, lastname, gender, email, cnic, password, role } =
      req.body;
    const user = new User({
      firstname,
      lastname,
      gender,
      email,
      password,
      role,
    });
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    let newUserType;
    if (user.role === "teacher") {
      newUserType = new Teacher({ userId: user._id, cnic });
    } else if (user.role === "employer") {
      newUserType = new UniEmployer({
        universityName: req.body.universityname,
        departmentName: req.body.departmentname,
        userId: user._id,
      });
    }
    await user.save();
    await newUserType.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/sign-in", validateSignIn, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ message: "Incorrect email or password" });
    }
    const token = createJWTToken({ userId: user._id, role: user.role });

    const oneDayTime = 1000 * 60 * 60 * 24; //One day in milliseconds

    // const tenSeconds = 1000 * 10;

    // res.cookie("token", token, {
    //   httpOnly: false,
    //   secure: true,
    //   expires: new Date(Date.now() + oneDayTime),
    //   sameSite: "None",
    // });

    res.status(200).json({
      message: "Log In successful",
      error: false,
      role: user.role,
      isProfileSetup: user.isProfileSetup,
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/sign-out", (req, res) => {
  try {
    res.cookie("token", "signedout", {
      expires: new Date(Date.now()),
    });
    res.status(200).json({ message: "User logged out", error: false });
  } catch (error) {
    console.log(error);
  }
});

export default router;
