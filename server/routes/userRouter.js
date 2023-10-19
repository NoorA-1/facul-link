import { Router, response } from "express";
const router = Router();
import User from "../models/userModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validationResult } from "express-validator";
import {
  validateChangeName,
  validateChangePassword,
} from "../middlewares/validationMiddleware.js";
import Teacher from "../models/teacherModel.js";
import UniEmployer from "../models/uniEmployerModel.js";

router.get("/current-user", authenticateUser, async (req, res) => {
  try {
    // const user = await User.findOne({ _id: req.user.userId });
    if (req.user.role === "teacher") {
      const user = await Teacher.findOne({
        userId: req.user.userId,
      }).populate("userId");
      return res.status(200).json({ user });
    } else if (req.user.role === "employer") {
      const user = await UniEmployer.findOne({
        userId: req.user.userId,
      }).populate("userId");

      return res.status(200).json({ user });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/change-name",
  authenticateUser,
  validateChangeName,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array().map((err) => err.msg),
        });
      }
      let user = await User.findOne({ _id: req.user.userId });
      const reqBody = req.body;
      if (
        user.firstname === reqBody.firstname &&
        user.lastname === reqBody.lastname
      ) {
        return res.status(304).json({
          message: "Provided first name and last name are same as before.",
        });
      }
      user.firstname = reqBody.firstname;
      user.lastname = reqBody.lastname;
      await user.save();
      return res
        .status(200)
        .json({ message: "Name has been updated", error: false });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/change-password",
  authenticateUser,
  validateChangePassword,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array().map((err) => err.msg),
        });
      }
      const reqBody = req.body;
      let user = await User.findOne({ _id: req.user.userId });
      if (reqBody.newpassword === user.password) {
        return res.status(400).json({
          message: "New password cannot be same as old password",
          error: true,
        });
      } else if (reqBody.currentpassword !== user.password) {
        return res.status(400).json({
          message: "Current password does not match",
          error: true,
        });
      }
      user.password = reqBody.newpassword;
      await user.save();
      return res
        .status(200)
        .json({ message: "Password has been updated", error: false });
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
