const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/AppError");
const generateToken = require("../utils/tokenGeneration");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new AppError("Email and password are required", 400);

    const user = await User.findOne({ email });

    if (!user)
      throw new AppError("Invalid email or password", 401);

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      throw new AppError("Invalid email or password", 401);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("User already exists with this email", 409);
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    next(error);
  }
};

exports.checkUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "project-management-secret"
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError("Invalid or expired token", 401));
    }

    next(error);
  }
};