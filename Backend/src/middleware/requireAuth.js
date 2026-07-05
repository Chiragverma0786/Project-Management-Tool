const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/AppError");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("No token provided", 401));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "project-management-secret"
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError("Invalid or expired token", 401));
    }

    next(error);
  }
};

module.exports = requireAuth;
