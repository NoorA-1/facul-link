import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

router.get("/stats", authenticateUser, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const userCount = await User.countDocuments();
      res.status(200).json({ userCount });
    } else {
      res.status(401).json({ message: "Unauthorized Access. Not Admin." });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
