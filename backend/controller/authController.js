const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const hashUtils = require("../utils/hash");
const tokenUtils = require("../utils/token");

/**
 * Register user
 */
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  // 1️⃣ Validate input
  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
   
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await hashUtils.hashPassword(password);

    // 4️⃣ Create user (✔ CORRECT KEYS)
    const newUser = await User.createUser({
      id: uuidv4(),
      email,
      hashedPassword, // ✅ FIXED
      role,
    });

    // 5️⃣ Generate token
    const token = tokenUtils.generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await hashUtils.comparePassword(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.first_login) {
      return res.status(403).json({
        message: "Change password required",
        firstLogin: true,
        userId: user.id,
      });
    }

    const token = tokenUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.json({ token, role: user.role });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const hashedPassword = await hashUtils.hashPassword(newPassword);
    await User.updatePassword(userId, hashedPassword);

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
