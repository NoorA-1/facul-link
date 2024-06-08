import { Router } from "express";
import HiringTest from "../models/hiringTestModel.js";
import Teacher from "../models/teacherModel.js";
import UniEmployer from "../models/uniEmployerModel.js";
import User from "../models/userModel.js";
const router = Router();

import dayjs from "dayjs";
import { validationResult } from "express-validator";
import fs from "fs";
import mongoose, { Schema, SchemaTypes } from "mongoose";
import multer from "multer";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import JobApplication from "../models/jobApplicationModel.js";
import Job from "../models/jobModel.js";
import Notifications from "../models/notificationsModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { notifyUserEmit } from "../utils/socketFunctions.js";
import {
  getTotalYearsExperience,
  normalizeString,
  calculateJobScore,
} from "./teacherRouter.js";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = `./temp/uploads/${req.user.userId}`;
    try {
      await fs.promises.mkdir(dir, { recursive: true });
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 100);
    const newFilename = uniquePrefix + "-" + file.originalname;
    cb(null, newFilename);
  },
});
const upload = multer({ storage });

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

router.get("/all-jobs/:num", authenticateUser, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const num = Number(req.params.num);
    const activeEmployers = await UniEmployer.find({ status: "active" }).select(
      "_id"
    );

    const employerIds = activeEmployers.map((user) => user._id);

    const allJobs = await Job.find({
      endDate: { $gte: today },
      createdBy: { $in: employerIds },
    })
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

router.get("/applications/:jobId", authenticateUser, async (req, res) => {
  try {
    const jobId = req.params.jobId;
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

    const job = applications[0]?.jobId;
    if (!job) {
      return res.status(404).send({ message: "Job not found" });
    }

    const maxQualificationsScore = 20;
    const maxExperienceScore = 30;

    //for each teacher profile
    const updatedApplications = [];

    for (const application of applications) {
      const teacher = application.applicantId;
      const qualificationFields = teacher?.qualification.map((e) => ({
        field: e.field.toLowerCase().trim(),
        level: e.level.toLowerCase().trim(),
      }));
      const teacherSkills = normalizeString(teacher?.skills);
      const totalExperienceYears = getTotalYearsExperience(teacher?.experience);

      const { totalScore, maxSkillsScore } = calculateJobScore(
        application.jobId,
        teacherSkills,
        qualificationFields,
        totalExperienceYears
      );

      const percentageScore =
        (totalScore /
          (maxSkillsScore + maxQualificationsScore + maxExperienceScore)) *
        100;

      updatedApplications.push({
        ...application.toObject(),
        matchingScore: percentageScore,
      });
    }

    res.status(200).json(updatedApplications);
  } catch (error) {
    console.log(error);
  }
});

const cleanUpFiles = async (files) => {
  try {
    files.forEach(async (file) => {
      await fs.promises.unlink(file.path);
    });
  } catch (error) {
    console.error("Error cleaning up files:", error);
  }
};

router.put(
  "/review/:applicationId",
  authenticateUser,
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      const reqBody = req.body;

      const employer = await UniEmployer.findOne({
        userId: req.user.userId,
      }).populate("userId");
      const files = req.files;

      const application = await JobApplication.findById(
        req.params.applicationId
      ).populate([
        "applicantId",
        "jobId",
        {
          path: "applicantId",
          populate: {
            path: "userId",
            model: "User",
          },
        },
      ]);

      application.status = reqBody.status;
      application.text = reqBody.text;
      if (reqBody.mode === "in-person" || reqBody.mode === "online") {
        Object.keys(reqBody).forEach((key) => {
          application.interviewDetails[key] = reqBody[key];
        });
      }
      await application.save();

      const pTagStyle = "margin: 0; font-weight: 500;";

      const info = await sendEmail(
        `"${employer.userId.firstname} ${employer.userId.lastname}" <${employer.userId.email}>`,
        reqBody.email,
        reqBody.subject,
        reqBody.text,
        `<p style="white-space: pre;">${reqBody.text}</p> ${
          application.status === "interview"
            ? `<hr/>
            <p style="${pTagStyle} text-transform: capitalize;">Interview Mode: <span style="font-weight: 400">${
                application.interviewDetails.mode
              }</span></p>
            <p style="${pTagStyle}">Date: <span style="font-weight: 400">${dayjs(
                application.interviewDetails.date
              ).format("DD-MM-YYYY")}</span></p>
            <p style="${pTagStyle}">Time: <span style="font-weight: 400">${dayjs(
                application.interviewDetails.time
              ).format("hh:mm A")}</span></p>
            <p style="${pTagStyle}">${
                application.interviewDetails.mode === "online"
                  ? "Meeting Link"
                  : "Location"
              }: <span style="font-weight: 400">${
                application.interviewDetails.mode === "online"
                  ? application.interviewDetails.meetingURL
                  : application.interviewDetails.location
              }</span></p>`
            : ""
        }`,
        files
      );

      const notification = {
        userId: application.applicantId.userId._id,
        title: `The status of your application for ${application.jobId.title} has been updated.`,
        onClickURL: `application-history/${req.params.applicationId}`,
        message: reqBody.text,
      };
      if (application.status === "hired") {
        notification.title = `Congratulations on getting hired for ${application.jobId.title} position. Do you want to add it to your profile?`;
      }

      const newNotification = new Notifications({
        ...notification,
      });

      await newNotification.save();

      notifyUserEmit(application.applicantId.userId._id, newNotification);

      if (application.status === "hired") {
        const job = await Job.findById(application.jobId._id);
        if (job.totalPositions >= 1) {
          job.totalPositions = job.totalPositions - 1;
          await job.save();
        } else {
          return;
        }
      }

      if (files && files.length > 0) {
        await cleanUpFiles(files);
      }

      return res
        .status(200)
        .json({ message: "Candidate status updated successfully" });
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
