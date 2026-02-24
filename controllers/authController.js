const { User } = require("../models/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { notificationController } = require("./notificationController"); // Optional

// ========================
// Register Admin
// ========================
const registerUser = async (req, res) => {
  try {
    let { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password || !phone || !address || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    role = role.toLowerCase();
    if (role !== "admin") {
      return res.status(400).json({ message: "Only admin registration allowed" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, phone, address, role });
    await user.save();

    // Send welcome notifications
    if (notificationController?.createNotification) {
      await notificationController.createNotification(
        user._id,
        "Welcome Admin! 🎉",
        `Hi ${name}, thank you for joining as an admin.`,
        "system",
        null,
        "/admin/dashboard",
        "medium"
      );
    }

    res.status(201).json({
      message: "Admin registered successfully",
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role }
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Login Admin
// ========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "admin") return res.status(403).json({ message: "Only admins can log in" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Invalid password" });

    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "12h" });

    if (notificationController?.createNotification) {
      await notificationController.createNotification(
        user._id,
        "Login Alert 🔐",
        `You logged in at ${new Date().toLocaleString()}.`,
        "system",
        null,
        "/admin/security",
        "high"
      );
    }

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role }
    });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ========================
// Get Current Admin (Me)
// ========================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Get Admin Profile
// ========================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("getUserProfile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Update Admin Profile
// ========================
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: name || user.name, phone: phone || user.phone, address: address || user.address },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Change Admin Password
// ========================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Current and new password required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUserProfile,
  updateUserProfile,
  changePassword
};