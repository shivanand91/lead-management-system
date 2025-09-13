import jwt from "jsonwebtoken";
import Token from "../models/token.model.js";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    // No token provided
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Check token in DB
    const dbToken = await Token.findOne({ token, userId: decoded.id });
    if (!dbToken) {
      return res.status(401).json({ message: "Token expired or revoked" });
    }

    // Optional: check token expiry if you store expiresAt in DB
    if (dbToken.expiresAt && dbToken.expiresAt < new Date()) {
      await Token.deleteOne({ _id: dbToken._id }); // cleanup expired token
      return res.status(401).json({ message: "Token expired, please login again" });
    }

    // Get user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(500).json({ message: "Server error in authentication" });
  }
};

export default protect;
