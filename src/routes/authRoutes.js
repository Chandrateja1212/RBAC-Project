const express = require("express");
const { register, login, logout, loginLimiter } = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Public routes with rate limiting on login
router.post("/register", register);
router.post("/login", loginLimiter, login); // Apply rate limiting to login

// Protected route
router.post("/logout", verifyToken, logout);

module.exports = router;