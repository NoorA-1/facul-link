import { Router, response } from "express";
const router = Router();
import User from "../models/userModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validationResult } from "express-validator";
import {
  validateChangeEmail,
  validateChangePassword,
} from "../middlewares/validationMiddleware.js";
import Teacher from "../models/teacherModel.js";
import UniEmployer from "../models/uniEmployerModel.js";
import fs from "fs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let dir = `./public/uploads/${req.user.userId}`;
    try {
      if (file.fieldname === "resumeFile") {
        dir = path.join(dir, "/documents");
      } else if (
        file.fieldname === "profileImage" ||
        file.fieldname === "universityLogo"
      ) {
        dir = path.join(dir, "/images");
      }
      await fs.promises.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + "-" + file.originalname);
    cb(null, file.originalname);
  },
});
//middleware instance of multer
const upload = multer({ storage });

router.get("/current-user", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (user) {
      if (req.user.role === "teacher") {
        const user = await Teacher.findOne({
          userId: req.user.userId,
        }).populate("userId");

        if (!fs.existsSync(user.profileImage)) {
          await Teacher.updateOne(
            { userId: req.user.userId },
            { profileImage: null }
          );
          user.profileImage = null;
        }
        if (!fs.existsSync(user.resumeFile)) {
          await Teacher.updateOne(
            { userId: req.user.userId },
            { resumeFile: null }
          );
          user.resumeFile = null;
        }

        return res.status(200).json({ user });
      } else if (req.user.role === "employer") {
        const user = await UniEmployer.findOne({
          userId: req.user.userId,
        }).populate("userId");

        if (!fs.existsSync(user.profileImage)) {
          await UniEmployer.updateOne(
            { userId: req.user.userId },
            { profileImage: null }
          );
          user.profileImage = null;
        }

        if (!fs.existsSync(user.universityLogo)) {
          await UniEmployer.updateOne(
            { userId: req.user.userId },
            { universityLogo: null }
          );
          user.universityLogo = null;
        }

        return res.status(200).json({ user });
      } else if (req.user.role === "admin") {
        const user = await User.findOne({ _id: req.user.userId });
        return res.status(200).json({ user });
      }
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/change-email",
  authenticateUser,
  validateChangeEmail,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array().map((err) => err.msg),
        });
      }
      const reqBody = req.body;
      //To check if another user with email already exists
      const checkUser = await User.findOne({
        email: reqBody.email,
        _id: { $ne: req.user.userId },
      });
      if (checkUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
      //Get only current user
      let user = await User.findOne({ _id: req.user.userId });
      if (user.email === reqBody.email) {
        return res
          .status(304)
          .json({ message: "User with this email already exists" });
      }
      user.email = reqBody.email;
      await user.save();
      return res
        .status(200)
        .json({ message: "Email has been updated", error: false });
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
      if (
        reqBody.currentpassword == user.password &&
        reqBody.newpassword === user.password
      ) {
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

router.put(
  "/teacher-profile",
  authenticateUser,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let userInfo = { ...req.body };
      if (req.user.role === "teacher") {
        console.log(req.files.profileImage);
        console.log(req.files.resumeFile);

        //File format validation
        const imageFormatCheck =
          req.files.profileImage &&
          !req.files.profileImage[0].mimetype.startsWith("image/")
            ? "Wrong image format"
            : null;

        const resumeFormatCheck =
          req.files.resumeFile &&
          req.files.resumeFile[0].mimetype !== "application/pdf"
            ? "Resume is not PDF format"
            : null;

        if (Boolean(imageFormatCheck) || Boolean(resumeFormatCheck)) {
          if (imageFormatCheck) {
            await fs.promises.unlink(
              path.resolve(req.files.profileImage[0].path)
            );
          }
          if (resumeFormatCheck) {
            await fs.promises.unlink(
              path.resolve(req.files.resumeFile[0].path)
            );
          }
          return res
            .status(400)
            .send({ error: { imageFormatCheck, resumeFormatCheck } });
        }
        let user = await Teacher.findOne({
          userId: req.user.userId,
        });

        //if record has file and file exists else new file
        if (req.files.profileImage) {
          if (
            user.profileImage &&
            fs.existsSync(user.profileImage) &&
            user.profileImage !== req.files.profileImage[0].path
          ) {
            await fs.promises.unlink(path.resolve(user.profileImage));
          }
          userInfo.profileImage = req.files.profileImage[0].path;
        }
        if (req.files.resumeFile) {
          if (user.resumeFile && fs.existsSync(user.resumeFile)) {
            await fs.promises.unlink(path.resolve(user.resumeFile));
          }
          userInfo.resumeFile = req.files.resumeFile[0].path;
        }
        // userInfo.qualification = [{ ...userInfo.qualification }];
        if (typeof userInfo.qualification === "string") {
          userInfo.qualification = JSON.parse(userInfo.qualification);
        }
        if (typeof userInfo.experience === "string") {
          userInfo.experience = JSON.parse(userInfo.experience);
        }
        if (typeof userInfo.skills === "string") {
          userInfo.skills = JSON.parse(userInfo.skills);
        }
        await Teacher.findOneAndUpdate({ userId: user.userId }, userInfo);
        await User.findOneAndUpdate(
          { _id: user.userId },
          {
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            isProfileSetup: true,
          }
        );
        return res
          .status(200)
          .json({ message: "Profile updated successfully", error: false });
      }
      return res.status(404).json({ message: "User not found" });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/employer-profile",
  authenticateUser,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "universityLogo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let userInfo = { ...req.body };
      console.log(userInfo);

      if (req.user.role === "employer") {
        //File format validation
        const imageFormatCheck =
          req.files.profileImage &&
          !req.files.profileImage[0].mimetype.startsWith("image/")
            ? "Wrong image format"
            : null;

        const universityLogoFormatCheck =
          req.files.universityLogo &&
          !req.files.universityLogo[0].mimetype.startsWith("image/")
            ? "Wrong image format"
            : null;

        if (Boolean(imageFormatCheck) || Boolean(universityLogoFormatCheck)) {
          if (imageFormatCheck) {
            await fs.promises.unlink(
              path.resolve(req.files.profileImage[0].path)
            );
          }
          if (universityLogoFormatCheck) {
            await fs.promises.unlink(
              path.resolve(req.files.universityLogo[0].path)
            );
          }
          return res
            .status(400)
            .send({ error: { imageFormatCheck, universityLogoFormatCheck } });
        }
        let user = await UniEmployer.findOne({
          userId: req.user.userId,
        });

        //if record has file and file exists else new file
        if (req.files.profileImage) {
          if (
            user.profileImage &&
            fs.existsSync(user.profileImage) &&
            user.profileImage !== req.files.profileImage[0].path
          ) {
            await fs.promises.unlink(path.resolve(user.profileImage));
          }
          userInfo.profileImage = req.files.profileImage[0].path;
        }
        if (req.files.universityLogo) {
          if (
            user.universityLogo &&
            fs.existsSync(user.universityLogo) &&
            user.universityLogo !== req.files.universityLogo[0].path
          ) {
            await fs.promises.unlink(path.resolve(user.universityLogo));
          }
          userInfo.universityLogo = req.files.universityLogo[0].path;
        }

        await UniEmployer.findOneAndUpdate({ userId: user.userId }, userInfo);
        await User.findOneAndUpdate(
          { _id: user.userId },
          {
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            isProfileSetup: true,
          }
        );
        return res
          .status(200)
          .json({ message: "Profile updated successfully", error: false });
      }
      return res.status(404).json({ message: "User not found" });
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
