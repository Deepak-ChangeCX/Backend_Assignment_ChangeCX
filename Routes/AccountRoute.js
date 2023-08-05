const express = require("express");
const router = express.Router();
const userController = require("../Controllers/AccountController");

router.post("/registration", userController.registerUser);
router.patch("/verify-otp", userController.verifyOTP);
router.post("/login", userController.loginUser);

module.exports = router;
