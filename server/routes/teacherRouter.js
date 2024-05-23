import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validationResult } from "express-validator";
import mongoose, { Schema, SchemaTypes } from "mongoose";
import Job from "../models/jobModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import JobApplication from "../models/jobApplicationModel.js";
import HiringTest from "../models/hiringTestModel.js";
import stringSimilarity from "string-similarity";

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

    const teacher = await Teacher.findOne({ userId: req.user.userId });

    const totalJobsCount = await Job.find({
      endDate: { $gte: today },
    }).countDocuments();

    const totalApplicationsCount = await JobApplication.countDocuments({
      applicantId: teacher._id,
    });

    return res.status(200).json({ totalJobsCount, totalApplicationsCount });
  } catch (error) {
    console.log(error);
  }
});

router.get("/all-bookmarks", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "teacher") {
      const teacher = await Teacher.findOne({
        userId: req.user.userId,
      }).populate([
        "bookmarks",
        {
          path: "bookmarks",
          populate: {
            path: "createdBy",
            model: "UniEmployer",
          },
        },
      ]);

      return res.status(200).json({ bookmarks: teacher.bookmarks });
    }
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
          // status: "pending",
        });
        let filePath;
        const dir = `public\\uploads\\${req.user.userId}\\job-application\\${req.body.jobId}`;

        if (req.file) {
          filePath = req.file.path;
          newApplication.resumeFile = filePath;
        } else if (applicationInfo.resumeFile) {
          newApplication.resumeFile =
            dir + applicationInfo.resumeFile.split("\\documents")[1];
        }

        await newApplication.save();

        //copy the file in application directory if profile resume is used
        if (!req.file && applicationInfo.resumeFile) {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          try {
            fs.copyFileSync(
              applicationInfo.resumeFile,
              newApplication.resumeFile
            );
          } catch (copyErr) {
            console.error("Error copying file:", copyErr);
            return res.status(500).json({ message: "Failed to copy file." });
          }
        }
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

router.get("/job-applications", authenticateUser, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.userId });
    const applications = await JobApplication.find({
      applicantId: teacher._id,
    }).populate([
      "jobId",
      {
        path: "jobId",
        populate: {
          path: "createdBy",
          model: "UniEmployer",
        },
      },
    ]);

    if (!applications) {
      return res.status(404).json({ message: "No applications found" });
    }

    return res.status(200).json(applications);
  } catch (error) {
    console.log(error);
  }
});

router.get("/job-application/:id", authenticateUser, async (req, res) => {
  try {
    const applicationId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const application = await JobApplication.findById(applicationId).populate([
      "jobId",
      {
        path: "jobId",
        populate: {
          path: "createdBy",
          model: "UniEmployer",
        },
      },
    ]);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json(application);
  } catch (error) {
    console.log(error);
  }
});

router.get(
  "/job-application/test-status/:id",
  authenticateUser,
  async (req, res) => {
    try {
      const jobId = req.params.id;
      const userId = req.user.userId;
      const applicantId = await Teacher.findOne({ userId });
      const jobApplication = await JobApplication.findOne({
        jobId,
        applicantId,
      });

      if (!jobApplication) {
        return res
          .status(200)
          .json({ message: "Job application not found", notFound: true });
      }

      return res.status(200).json({
        status: jobApplication.test.status,
        jobStatus: jobApplication.status,
        notFound: false,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get(
  "/job-application/hiring-test/:id",
  authenticateUser,
  async (req, res) => {
    try {
      const jobId = req.params.id;
      const jobData = await Job.findById(jobId).populate("hiringTest");
      if (!jobData) {
        return res.status(404).json({ message: "Not found" });
      }
      return res.status(200).json(jobData);
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/job-application/start-test/:jobId",
  authenticateUser,
  async (req, res) => {
    try {
      const { jobId } = req.params;
      const applicant = await Teacher.findOne({ userId: req.user.userId });
      const jobData = await Job.findById(jobId).populate("hiringTest");
      const jobApplication = await JobApplication.findOne({
        jobId,
        applicantId: applicant._id,
      });

      if (!jobApplication) {
        return res.status(404).json({ message: "Job application not found" });
      }
      if (jobApplication.test.status === "pending") {
        jobApplication.test.status = "in progress";
        jobApplication.test.startTime = Date.now();
        jobApplication.test.endTime = new Date(
          Date.now() + jobData.hiringTest.duration * 60000
        );

        await jobApplication.save();

        return res.status(200).json({
          message: "Test started",
          testStatus: jobApplication.test.status,
          startTime: jobApplication.test.startTime,
          endTime: jobApplication.test.endTime,
        });
      } else {
        return res.status(200).json({
          message: "Test already in progress",
          testStatus: jobApplication.test.status,
          startTime: jobApplication.test.startTime,
          endTime: jobApplication.test.endTime,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/job-application/submit-test/:jobId",
  authenticateUser,
  async (req, res) => {
    try {
      const { jobId } = req.params;
      const testData = { ...req.body };
      const applicant = await Teacher.findOne({ userId: req.user.userId });
      // const jobData = await Job.findById(jobId).populate("hiringTest");
      const jobApplication = await JobApplication.findOne({
        jobId,
        applicantId: applicant._id,
      });

      if (!jobApplication) {
        return res.status(404).json({ message: "Job application not found" });
      }

      const provisionalCompletedTime = new Date(testData.completedTime);
      const endTime = new Date(jobApplication.test.endTime);
      const timeDifference = (provisionalCompletedTime - endTime) / 60000;

      const completedTime =
        timeDifference > 1 ? endTime : provisionalCompletedTime;

      await JobApplication.findOneAndUpdate(
        { _id: jobApplication._id, "test.status": "in progress" },
        {
          "test.status": "completed",
          status: "applied",
          "test.correctAnswers": testData.correctAnswers,
          "test.wrongAnswers": testData.wrongAnswers,
          "test.score": testData.score,
          "test.completedTime.time": completedTime,
          "test.completedTime.isTimeUp": testData.isTimeUp,
        },
        { new: true }
      );

      const lateEntry = timeDifference > 1;

      return res.status(200).json({
        message: "Test successfully completed",
        lateEntry: lateEntry,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get(
  "/job-application/time-sync/:jobId",
  authenticateUser,
  async (req, res) => {
    try {
      const { jobId } = req.params;
      const teacher = await Teacher.findOne({ userId: req.user.userId });
      const applicant = await JobApplication.findOne({
        jobId,
        applicantId: teacher._id,
      });

      if (!applicant) {
        return res.status(404).json({ message: "Job application not found." });
      }

      const endTime = new Date(applicant.test.endTime);
      const currentTime = new Date();
      const remainingTimeInSeconds = Math.max(
        0,
        Math.floor((endTime - currentTime) / 1000)
      );

      return res.status(200).json({
        remainingTime: remainingTimeInSeconds,
        message: "Remaining time fetched successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const getTotalYearsExperience = (experiences) => {
  const currentDate = new Date();
  return experiences.reduce((total, exp) => {
    const startDate = new Date(exp.date.startDate);
    const endDate = exp.date.endDate ? new Date(exp.date.endDate) : currentDate;
    const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
    return total + years;
  }, 0);
};

const normalizeString = (array) =>
  array.map((string) => string.toLowerCase().trim());

const calculateJobScore = (
  job,
  teacherSkills,
  qualificationFields,
  totalExperienceYears
) => {
  const normalizedJobSkills = normalizeString(job.skills);
  const normalizedJobQualificationFields = normalizeString(
    job.requiredQualification.field.map((q) => q)
  );

  const skillsScore = normalizedJobSkills.reduce((score, jobSkill) => {
    const bestMatch = stringSimilarity.findBestMatch(
      jobSkill,
      teacherSkills
    ).bestMatch;

    return score + (bestMatch.rating >= 0.7 ? 10 : 0);
  }, 0);

  const qualificationDegreeScore = qualificationFields.some(
    (q) => q.level === job.requiredQualification.degree.toLowerCase()
  )
    ? 10
    : 0;

  const qualificationFieldScore = qualificationFields.some((q) =>
    normalizedJobQualificationFields.includes(q.field)
  )
    ? 10
    : 0;

  const qualificationsScore =
    qualificationFieldScore + qualificationDegreeScore;

  const experienceScore =
    job.requiredExperience <= totalExperienceYears ? 30 : 0;

  console.log(
    job.title +
      ", q: " +
      qualificationsScore +
      ", e:" +
      experienceScore +
      ", skills: " +
      skillsScore
  );

  const totalScore = skillsScore + qualificationsScore + experienceScore;
  const maxSkillsScore = normalizedJobSkills.length * 10;

  return {
    totalScore,
    maxSkillsScore,
  };
};

router.get("/recommend-jobs", authenticateUser, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const teacher = await Teacher.findOne({ userId: req.user.userId });
    if (!teacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    const qualificationFields = teacher.qualification.map((e) => ({
      field: e.field.toLowerCase().trim(),
      level: e.level.toLowerCase().trim(),
    }));
    const teacherSkills = normalizeString(teacher.skills);
    const totalExperienceYears = getTotalYearsExperience(teacher.experience);

    const maxQualificationsScore = 20;
    const maxExperienceScore = 30;

    const jobs = await Job.aggregate([
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
        $lookup: {
          from: "user",
          localField: "createdBy.userId",
          foreignField: "_id",
          as: "createdBy.userId",
        },
      },
      { $unwind: "$createdBy.userId" },
      {
        $match: {
          "createdBy.status": "active",
          endDate: { $gte: today },
        },
      },
      {
        $project: {
          title: 1,
          skills: 1,
          requiredQualification: 1,
          requiredExperience: 1,
          location: 1,
          createdBy: 1,
          createdAt: 1,
          endDate: 1,
        },
      },
    ]);

    const scoredJobs = jobs.map((job) => {
      const { totalScore, maxSkillsScore } = calculateJobScore(
        job,
        teacherSkills,
        qualificationFields,
        totalExperienceYears
      );

      const maxPossibleScore =
        maxSkillsScore + maxQualificationsScore + maxExperienceScore;

      return {
        ...job,
        score: totalScore,
        percentageScore: (totalScore / maxPossibleScore) * 100,
      };
    });

    const topJobs = scoredJobs.sort((a, b) => b.score - a.score).slice(0, 3);

    res.status(200).json(topJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//old
// router.get("/recommend-jobs", authenticateUser, async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const teacher = await Teacher.findOne({ userId: req.user.userId });
//     if (!teacher) {
//       return res.status(404).send({ message: "Teacher not found" });
//     }
//     const qualificationFields = teacher.qualification.map((e) =>
//       e.field.toLowerCase().trim()
//     );
//     const teacherSkills = teacher.skills.map((skill) =>
//       skill.toLowerCase().trim()
//     );
//     const totalExperienceYears = getTotalYearsExperience(teacher.experience);

//     const maxSkillsScore = teacherSkills.length * 50;
//     const maxQualificationsScore = qualificationFields.length * 20;
//     const maxExperienceScore = 30;

//     const maxPossibleScore =
//       maxSkillsScore + maxQualificationsScore + maxExperienceScore;

//     const jobs = await Job.aggregate([
//       {
//         $lookup: {
//           from: "uniemployer",
//           localField: "createdBy",
//           foreignField: "_id",
//           as: "createdBy",
//         },
//       },
//       {
//         $unwind: {
//           path: "$createdBy",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $lookup: {
//           from: "user",
//           localField: "createdBy.userId",
//           foreignField: "_id",
//           as: "createdBy.userId",
//         },
//       },
//       {
//         $unwind: {
//           path: "$createdBy.userId",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $match: {
//           "createdBy.status": "active",
//           endDate: {
//             $gte: today,
//           },
//         },
//       },
//       {
//         $addFields: {
//           normalizedSkills: {
//             $map: {
//               input: "$skills",
//               as: "skill",
//               in: { $toLower: { $trim: { input: "$$skill" } } },
//             },
//           },
//           normalizedQualificationFields: {
//             $map: {
//               input: "$requiredQualification.field",
//               as: "field",
//               in: { $toLower: { $trim: { input: "$$field" } } },
//             },
//           },
//         },
//       },
//       {
//         $addFields: {
//           score: {
//             $add: [
//               {
//                 $multiply: [
//                   {
//                     $size: {
//                       $setIntersection: ["$normalizedSkills", teacherSkills],
//                     },
//                   },
//                   50,
//                 ],
//               },
//               {
//                 $cond: {
//                   if: {
//                     $gt: [
//                       {
//                         $size: {
//                           $setIntersection: [
//                             "$normalizedQualificationFields",
//                             qualificationFields,
//                           ],
//                         },
//                       },
//                       0,
//                     ],
//                   },
//                   then: 20,
//                   else: 0,
//                 },
//               },
//               {
//                 $cond: {
//                   if: { $gte: ["$requiredExperience", totalExperienceYears] },
//                   then: 30,
//                   else: 0,
//                 },
//               },
//             ],
//           },
//         },
//       },
//       {
//         $addFields: {
//           percentageScore: {
//             $multiply: [
//               {
//                 $divide: ["$score", maxPossibleScore],
//               },
//               100,
//             ],
//           },
//         },
//       },
//       { $match: { score: { $gte: 0 } } },
//       { $sort: { score: -1 } },
//       { $limit: 3 },
//     ]);

//     res.status(200).json(jobs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });
export default router;
