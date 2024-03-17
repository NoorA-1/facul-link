import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import HiringTest from "../models/hiringTestModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import mongoose from "mongoose";
import UniEmployer from "../models/uniEmployerModel.js";
import Job from "../models/jobModel.js";

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
      const totalUsers = await User.countDocuments();
      const totalTests = await HiringTest.countDocuments();
      res.status(200).json({ userCount, testCount, totalUsers, totalTests });
    } else {
      res.status(401).json({ message: "Unauthorized Access. Not Admin." });
    }
  } catch (error) {
    console.log(error);
  }
});

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

router.get("/employer/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
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
      await Job.deleteMany({ createdBy: employer._id });
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
