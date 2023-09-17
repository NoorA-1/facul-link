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
    let userRole;
    if (user.role === "teacher") {
      userRole = new Teacher({ userId: user._id });
    } else if (user.role === "employer") {
      userRole = new UniEmployer({ userId: user._id });
    }
    await user.save();
    await userRole.save();
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
    res.send("Sign in");
  } catch (error) {
    console.log(error);
  }
});

export default router;
