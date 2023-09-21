import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

router.get("/current-user", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
});

export default router;
