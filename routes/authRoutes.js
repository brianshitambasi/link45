const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const { 
  registerUser, 
  loginUser, 
  getMe, 
  getUserProfile, 
  updateUserProfile, 
  changePassword 
} = require("../controllers/authController");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", auth, getMe);
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;