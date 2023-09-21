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
      return res.status(400).json({ errors: errors.array() });
    }
    // const isFirstAccount = User.countDocuments() ===0;
    // req.body.role = isFirstAccount ? "admin" : req.body.role;
    const { firstname, lastname, gender, email, password, role } = req.body;
    const user = new User({
      firstname,
      lastname,
      gender,
      email,
      password,
      role,
    });
    let newUserType;
    if (user.role === "teacher") {
      newUserType = new Teacher({ userId: user._id });
    } else if (user.role === "employer") {
      newUserType = new UniEmployer({ userId: user._id });
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
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = createJWTToken({ userId: user._id, role: user.role });

    const oneDayTime = 1000 * 60 * 60 * 24; //One day in milliseconds

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDayTime),
    });

    res.status(200).json({ message: "Log In successful", error: false });
  } catch (error) {
    console.log(error);
  }
});

router.get("/sign-out", (req, res) => {
  try {
    res.cookie("token", "loguout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(200).json({ message: "User logged out", error: false });
  } catch (error) {
    console.log(error);
  }
});

export default router;
