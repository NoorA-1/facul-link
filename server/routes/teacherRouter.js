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

export default router;
