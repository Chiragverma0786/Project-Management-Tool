const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "project-management-secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

module.exports = generateToken;