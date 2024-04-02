import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validationResult } from "express-validator";
import mongoose, { Schema, SchemaTypes } from "mongoose";
import Job from "../models/jobModel.js";
import fs from "fs";
import multer from "multer";
import path from "path";
import JobApplication from "../models/jobApplicationModel.js";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let dir = `./public/uploads/${req.user.userId}`;
    const jobId = req.body.jobId;
    try {
      if (file.fieldname === "newResumeFile") {
        dir = path.join(dir, `/job-application/${jobId}`);
      }
      await fs.promises.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: async (req, file, cb) => {
    const dir = `./public/uploads/${req.user.userId}/job-application/${req.body.jobId}`;

    try {
      const files = await fs.promises.readdir(dir);
      for (const file of files) {
        await fs.promises.unlink(path.join(dir, file));
      }
      cb(null, file.originalname);
    } catch (error) {
      console.log("Error managing existing files:", error);
      cb(error);
    }
  },
});
const upload = multer({ storage });

router.get("/stats", authenticateUser, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalJobsCount = await Job.find({
      endDate: { $gte: today },
    }).countDocuments();
    return res.status(200).json(totalJobsCount);
  } catch (error) {
    console.log(error);
  }
});

router.post("/bookmark/:jobId", authenticateUser, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const teacher = await Teacher.findOne({ userId: req.user.userId });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.bookmarks.includes(jobId)) {
      return res.status(400).json({ message: "Job already bookmarked" });
    }

    teacher.bookmarks.push(jobId);

    await teacher.save();

    res.status(200).json({ message: "Job bookmarked successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/bookmark/:jobId", authenticateUser, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const teacher = await Teacher.findOne({ userId: req.user.userId });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const index = teacher.bookmarks.indexOf(jobId);
    if (index === -1) {
      return res.status(400).json({ message: "Job is not bookmarked" });
    }

    teacher.bookmarks.splice(index, 1);

    await teacher.save();

    res.status(200).json({ message: "Job unbookmarked successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/job-application",
  authenticateUser,
  upload.single("newResumeFile"),
  async (req, res) => {
    try {
      let applicationInfo = { ...req.body };
      if (req.user.role === "teacher") {
        applicationInfo.test = JSON.parse(applicationInfo.test);
        let newApplication = new JobApplication({
          ...applicationInfo,
        });
        let filePath;

        if (req.file) {
          filePath = req.file.path;
          newApplication.resumeFile = filePath;
        }

        await newApplication.save();
        return res
          .status(200)
          .json({ message: "Job application submitted successfully" });
      } else {
        return res.status(404).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
