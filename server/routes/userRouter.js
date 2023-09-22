import { Router, response } from "express";
const router = Router();
import User from "../models/userModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import Teacher from "../models/teacherModel.js";
import UniEmployer from "../models/uniEmployerModel.js";

router.get("/current-user", authenticateUser, async (req, res) => {
  try {
    // const user = await User.findOne({ _id: req.user.userId });
    if (req.user.role === "teacher") {
      const user = await Teacher.findOne({
        userId: req.user.userId,
      }).populate("userId");
      return res.status(200).json({ user });
    } else if (req.user.role === "employer") {
      const user = await UniEmployer.findOne({
        userId: req.user.userId,
      }).populate("userId");

      return res.status(200).json({ user });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
  }
});

export default router;
