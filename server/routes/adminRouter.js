import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import HiringTest from "../models/hiringTestModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import mongoose from "mongoose";
import UniEmployer from "../models/uniEmployerModel.js";
import Job from "../models/jobModel.js";
import JobApplication from "../models/jobApplicationModel.js";
import { LogError } from "concurrently";
import Teacher from "../models/teacherModel.js";
import Notifications from "../models/notificationsModel.js";

router.get("/stats", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      let userCount = await User.aggregate([
        {
          $match: {
            role: { $ne: "admin" },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);
      let testCount = await HiringTest.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      let jobCount = await Job.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      let applicationCount = await JobApplication.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
      const totalJobs = await Job.countDocuments();
      const totalTests = await HiringTest.countDocuments();
      const totalApplications = await JobApplication.countDocuments();
      res.status(200).json({
        userCount,
        testCount,
        jobCount,
        applicationCount,
        totalUsers,
        totalTests,
        totalJobs,
        totalApplications,
      });
    } else {
      res.status(401).json({ message: "Unauthorized Access. Not Admin." });
    }
  } catch (error) {
    console.log(error);
  }
});

//get all jobs
router.get("/jobs", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const allJobs = await Job.find().populate([
        "hiringTest",
        "createdBy",
        {
          path: "createdBy",
          populate: {
            path: "userId",
            model: "User",
          },
        },
      ]);
      return res.status(200).json(allJobs);
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/jobs/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const jobInfo = { ...req.body };
      let hiringTestId = null;
      if (jobInfo.hiringTest !== "") {
        hiringTestId = jobInfo.hiringTest;
      }
      jobInfo.requiredExperience = Number(jobInfo.requiredExperience);

      const job = await Job.findById(id);
      if (job) {
        Object.keys(jobInfo).forEach((key) => {
          if (key === "hiringTest") {
            job[key] = hiringTestId;
          } else {
            job[key] = jobInfo[key];
          }
        });
        await job.save();
        return res.status(200).json({ message: "Job updated" });
      } else {
        return res.status(404).json({ message: "Job not found" });
      }
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-job/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const deleteJob = await Job.findByIdAndDelete(id);
      if (deleteJob) {
        await JobApplication.deleteMany({ jobId: id });
        return res.status(200).json({ message: "Job deleted successfully" });
      } else {
        return res.status(404).json({ message: "Job not found" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-hiring-tests", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const allTests = await HiringTest.find();
      return res.status(200).json(allTests);
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/teachers", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const allTeachers = await Teacher.find().populate("userId");
      return res.status(200).json(allTeachers);
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/teacher/:id", authenticateUser, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const teacher = await Teacher.findOne({ userId: req.params.id });
    if (teacher) {
      await User.findByIdAndDelete(req.params.id);
      await Teacher.findByIdAndDelete(teacher._id);
      await JobApplication.deleteMany({ applicantId: teacher._id });
      await Notifications.deleteMany({ userId: req.params.id });
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

//get all employers
router.get("/employers", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const users = await UniEmployer.find().populate("userId");
      res.status(200).json(users);
    } else {
      res.status(401).json({ message: "Unauthorized Access. Not Admin." });
    }
  } catch (error) {
    console.log(error);
  }
});

//get single employer
router.get("/employer/:id", authenticateUser, async (req, res) => {
  try {
    if (
      req.user.role === "admin" ||
      req.user.role === "teacher" ||
      req.user.role === "employer"
    ) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const user = await UniEmployer.findOne({
        userId: req.params.id,
      }).populate("userId");
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "Employer not found" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized Access. Not Admin." });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/employer/:id", authenticateUser, async (req, res) => {
  try {
    const userInfo = { ...req.body };
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    let user = await UniEmployer.findOne({
      userId: req.params.id,
    });
    userInfo.departmentName = userInfo.departmentname;
    console.log(userInfo);
    await UniEmployer.findOneAndUpdate({ userId: user.userId }, userInfo);
    await User.findOneAndUpdate({ _id: user.userId }, userInfo);
    res.status(200).json({ message: "Employer has been updated" });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/employer/:id", authenticateUser, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const employer = await UniEmployer.findOne({ userId: req.params.id });
    if (employer) {
      await User.findByIdAndDelete(req.params.id);
      await UniEmployer.findByIdAndDelete(employer._id);

      const jobs = await Job.find({ createdBy: employer._id }).select("_id");
      const jobIds = jobs.map((job) => job._id);
      await Job.deleteMany({ createdBy: employer._id });
      await HiringTest.deleteMany({ createdBy: employer._id });
      await JobApplication.deleteMany({ jobId: { $in: jobIds } });
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
