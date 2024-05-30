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
import Job from "../models/jobModel.js";
import Notifications from "../models/notificationsModel.js";
import {
  notifyUserEmit,
  updateNotificationEmit,
} from "../utils/socketFunctions.js";

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
  "/teacher-profile/:id",
  authenticateUser,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let userInfo = { ...req.body };
      const userId = req.params.id;
      if (req.user.role === "teacher" || req.user.role === "admin") {
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
          userId,
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
            gender: userInfo.gender,
            email: userInfo.email,
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

router.get("/notifications", authenticateUser, async (req, res) => {
  try {
    const notifications = await Notifications.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
  }
});

router.put("/notifications/:id", authenticateUser, async (req, res) => {
  try {
    const id = req.params.id;
    const reqBody = req.body;

    let notification = await Notifications.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "No notification found" });
    }

    Object.keys(reqBody).forEach((key) => {
      notification[key] = reqBody[key];
    });

    await notification.save();

    updateNotificationEmit(req.user.userId, notification);

    return res
      .status(200)
      .json({ message: "Notification updated successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/search-jobs/filters", authenticateUser, async (req, res) => {
  try {
    const skillsPipeline = [
      { $unwind: "$skills" },
      { $group: { _id: null, skillsList: { $addToSet: "$skills" } } },
    ];

    const universityPipeline = [
      {
        $lookup: {
          from: "uniemployer",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      {
        $group: {
          _id: null,
          universitiesList: { $addToSet: "$createdBy.universityName" },
        },
      },
    ];

    const [skillsResult, universityResult] = await Promise.all([
      Job.aggregate(skillsPipeline),
      Job.aggregate(universityPipeline),
    ]);

    const skillsList = skillsResult[0] ? skillsResult[0].skillsList : [];
    const universitiesList = universityResult[0]
      ? universityResult[0].universitiesList
      : [];

    res.status(200).json({
      skillsList,
      universitiesList,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/teacher/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.params.id;
    const teacher = await Teacher.findOne({ userId }).populate("userId");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    return res.status(200).json(teacher);
  } catch (error) {
    console.log(error);
  }
});

router.get("/search-jobs", authenticateUser, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      title,
      skills = [],
      experience,
      degree,
      universityName,
    } = req.query;
    const skip = (page - 1) * limit;

    const skillsArray = Array.isArray(skills) ? skills : [skills];
    const trimmedSkillsArray = skillsArray.map((skill) => skill.trim());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        $lookup: {
          from: "uniemployer",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
    ];

    const matchConditions = {
      endDate: { $gte: today },
      "createdBy.status": "active",
    };
    if (title) matchConditions.title = { $regex: title, $options: "i" };

    if (universityName)
      matchConditions["createdBy.universityName"] = {
        $regex: universityName,
        $options: "i",
      };

    if (degree) {
      matchConditions["requiredQualification.degree"] = degree;
    }

    if (experience) {
      matchConditions.requiredExperience = parseInt(experience);
    }

    if (trimmedSkillsArray.length > 0) {
      matchConditions.skills = { $in: trimmedSkillsArray };
    }

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip }, { $limit: limit });

    const jobs = await Job.aggregate(pipeline);

    const countPipeline = [...pipeline];
    countPipeline.splice(-2, 2);
    countPipeline.push({ $count: "total" });

    const countResult = await Job.aggregate(countPipeline);

    const totalJobs = countResult.length > 0 ? countResult[0].total : 0;

    res.status(200).json({
      jobs,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
export default router;
