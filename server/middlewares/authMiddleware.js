import { verifyJWTToken } from "../utils/tokenUtils.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // if (!token) {
    //   return res
    //     .status(401)
    //     .json({ message: "Authentication failed, token not found" });
    // }

    const { userId, role } = verifyJWTToken(token);
    req.user = { userId, role };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed, token not found" });
  }
};
