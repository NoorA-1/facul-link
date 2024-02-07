import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import Teacher from "../models/teacherModel.js";
import UniEmployer from "../models/uniEmployerModel.js";
import HiringTest from "../models/hiringTestModel.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validationResult } from "express-validator";
import fs from "fs";
import multer from "multer";
import path from "path";

router.get("/get-hiring-tests", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "employer") {
      const allTests = await HiringTest.find({ createdBy: req.user.userId });
      res.status(200).json(allTests);
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
      const test = await HiringTest.findById(req.params.id);
      res.status(200).json(test);
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
      const existingTest = await HiringTest.findOne({
        createdBy: req.user.userId,
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
        createdBy: req.user.userId,
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

export default router;