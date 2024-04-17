import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import UniEmployer from "../models/uniEmployerModel.js";
import HiringTest from "../models/hiringTestModel.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validationResult } from "express-validator";
import mongoose, { Schema, SchemaTypes } from "mongoose";
import Job from "../models/jobModel.js";
import JobApplication from "../models/jobApplicationModel.js";
import { sendEmail } from "../utils/sendEmail.js";

router.get("/stats", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
      const employerData = await UniEmployer.findOne({
        userId: req.user.userId,
      });
      const totalJobsCount = await Job.countDocuments({
        createdBy: employerData._id,
      });
      const totalTestsCount = await HiringTest.countDocuments({
        createdBy: employerData._id,
      });
      const totalApplicationsCount = await JobApplication.aggregate([
        {
          $lookup: {
            from: "job",
            localField: "jobId",
            foreignField: "_id",
            as: "jobDetails",
          },
        },
        {
          $unwind: "$jobDetails",
        },
        {
          $match: {
            "jobDetails.createdBy": employerData._id,
          },
        },
        {
          $count: "totalApplications",
        },
      ]);

      const applicationCount =
        totalApplicationsCount.length > 0
          ? totalApplicationsCount[0].totalApplications
          : 0;

      return res.status(200).json({
        totalJobsCount,
        totalTestsCount,
        totalApplicationsCount: applicationCount,
      });
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-hiring-tests", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
      const employerData = await UniEmployer.findOne({
        userId: req.user.userId,
      });
      const allTests = await HiringTest.find({ createdBy: employerData._id });
      return res.status(200).json(allTests);
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-hiring-test/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const test = await HiringTest.findById(req.params.id);
      return res.status(200).json(test);
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Test not found" });
  }
});

router.post("/add-hiring-test", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
      let { title, duration, shuffleQuestions, questions } = req.body;
      duration = Number(duration);
      const employerData = await UniEmployer.findOne({
        userId: req.user.userId,
      });

      const existingTest = await HiringTest.findOne({
        createdBy: employerData._id,
        title: title,
      }).collation({ locale: "en", strength: 2 });

      if (existingTest) {
        return res
          .status(400)
          .json({ message: "A test with this title already exists." });
      }

      const newTest = new HiringTest({
        title,
        duration,
        shuffleQuestions,
        questions,
        createdBy: employerData._id,
      });

      await newTest.save();
      return res.status(200).json({ message: "Test added successfully" });
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/edit-hiring-test/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
      let { title, duration, shuffleQuestions, questions } = req.body;
      duration = Number(duration);
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const test = await HiringTest.findById(req.params.id);

      if (test) {
        test.title = title;
        test.duration = duration;
        test.shuffleQuestions = shuffleQuestions;
        test.questions = questions;
        await test.save();
        return res.status(200).json({ message: "Test edited successfully" });
      }

      return res.status(400).json({ message: "This test does not exists." });
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-hiring-test/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const deleteTest = await HiringTest.findByIdAndDelete(id);
      if (deleteTest) {
        await Job.updateMany(
          { hiringTest: id },
          { $set: { hiringTest: null, isTestEnabled: false } }
        );
        return res.status(200).json({ message: "Test deleted successfully" });
      } else {
        return res.status(404).json({ message: "Test not found" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/post-job", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
      const jobInfo = { ...req.body };
      let hiringTestId = null;
      if (jobInfo.hiringTest !== "") {
        hiringTestId = jobInfo.hiringTest;
      }
      jobInfo.requiredExperience = Number(jobInfo.requiredExperience);
      const employerData = await UniEmployer.findOne({
        userId: req.user.userId,
      });

      const newJob = new Job({
        ...jobInfo,
        hiringTest: hiringTestId,
        createdBy: employerData._id,
      });
      newJob.save();
      return res.status(200).json({ message: "Job saved successfully" });
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/jobs", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
      const employerData = await UniEmployer.findOne({
        userId: req.user.userId,
      });
      const allJobs = await Job.find({ createdBy: employerData._id }).populate(
        "hiringTest"
      );
      return res.status(200).json(allJobs);
    } else {
      return res.status(404).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/jobs/:id", authenticateUser, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const job = await Job.findById(id).populate([
      "hiringTest",
      {
        path: "createdBy",
        populate: {
          path: "userId",
          model: "User",
        },
      },
    ]);
    if (job) {
      return res.status(200).json(job);
    } else {
      return res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/jobs/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
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
    if (req.user.role === "employer") {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const deleteJob = await Job.findByIdAndDelete(id);
      if (deleteJob) {
        return res.status(200).json({ message: "Job deleted successfully" });
      } else {
        return res.status(404).json({ message: "Job not found" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/all-jobs/:num", authenticateUser, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const num = Number(req.params.num);

    const allJobs = await Job.find({ endDate: { $gte: today } })
      .sort({ createdAt: -1 })
      .limit(num)
      .populate("createdBy");

    return res.status(200).json(allJobs);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.get("/applications", authenticateUser, async (req, res) => {
  try {
    const employer = await UniEmployer.findOne({ userId: req.user.userId });
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    const jobIds = await Job.find({ createdBy: employer._id }).distinct("_id");

    const applications = [];
    for (const jobId of jobIds) {
      const application = await JobApplication.findOne({
        jobId: jobId,
      }).populate({
        path: "jobId",
        populate: {
          path: "hiringTest",
          model: "HiringTest",
        },
      });
      if (application) {
        applications.push(application);
      }
    }
    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
  }
});

router.get("/applications/:id", authenticateUser, async (req, res) => {
  try {
    const jobId = req.params.id;
    const applications = await JobApplication.find({
      jobId,
    }).populate([
      "jobId",
      "applicantId",
      {
        path: "applicantId",
        populate: {
          path: "userId",
          model: "User",
        },
      },
      {
        path: "jobId",
        populate: {
          path: "createdBy",
          model: "UniEmployer",
          populate: {
            path: "userId",
            model: "User",
          },
        },
      },
      {
        path: "jobId",
        populate: {
          path: "hiringTest",
          model: "HiringTest",
        },
      },
    ]);
    res.status(200).json(applications);
  } catch (error) {
    console.log(error);
  }
});

router.post("/notify", authenticateUser, async (req, res) => {
  try {
    const reqBody = req.body;
    const employer = await UniEmployer.findOne({
      userId: req.user.userId,
    }).populate("userId");
    const info = await sendEmail(
      `"${employer.userId.firstname} ${employer.userId.lastname}" <${employer.userId.email}>`,
      reqBody.email,
      reqBody.subject,
      reqBody.text
      // `<p>${reqBody.text}</p>`
    );

    return res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.log(error);
  }
});

export default router;
