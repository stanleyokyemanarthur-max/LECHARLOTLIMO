import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ message: "Not authorized, user not found" });
      return next();
    }

    // fallback: token in body/query (used by some reset flows)
    if (req.body?.token) {
      const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ message: "Not authorized, user not found" });
      return next();
    }

    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (err) {
    console.error("authMiddleware error:", err.message);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Not authorized as admin" });
};
