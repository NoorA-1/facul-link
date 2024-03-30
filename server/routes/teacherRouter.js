import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validationResult } from "express-validator";
import mongoose, { Schema, SchemaTypes } from "mongoose";
import Job from "../models/jobModel.js";

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

export default router;
