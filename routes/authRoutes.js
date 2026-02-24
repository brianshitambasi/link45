const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  changePassword,
} = require("../controllers/authController");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/me", auth, getMe);
router.put("/profile", auth, updateUserProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;