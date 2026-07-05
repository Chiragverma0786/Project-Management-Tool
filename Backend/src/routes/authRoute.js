const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.get("/checkUser", AuthController.checkUser);

module.exports = router;