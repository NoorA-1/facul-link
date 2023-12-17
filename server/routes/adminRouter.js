import { Router } from "express";
const router = Router();
import User from "../models/userModel.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

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
      const totalUsers = await User.countDocuments();
      res.status(200).json({ userCount, totalUsers });
    } else {
      res.status(401).json({ message: "Unauthorized Access. Not Admin." });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
