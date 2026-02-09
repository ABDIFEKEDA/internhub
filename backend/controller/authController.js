const uuid = require("uuid");
const User = require("../models/userModel");
const hashUtils = require("../utils/hash");
const tokenUtils = require("../utils/token");

/**
 * Register user (self-register)
 */
exports.register = async function registerUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  try {
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const encryptedPassword = await hashUtils.hashPassword(password);

    // 3. Create user
    const newUser = await User.createUser({
      id: uuid.v4(),
      email: email,
      hashedPassword: encryptedPassword,
      role: role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser.email,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login user
 */
exports.login = async function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // 1. Get user from DB
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const passwordMatch = await hashUtils.comparePassword(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. First login check
    if (user.first_login === true) {
      return res.status(403).json({
        message: "Change password required",
        firstLogin: true,
        userId: user.id,
      });
    }

    // 4. Generate JWT
    const jwtToken = tokenUtils.generateToken(user);

    return res.json({
      token: jwtToken,
      role: user.role,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Change password
 */
exports.changePassword = async function changeUserPassword(req, res) {
  const userId = req.body.userId;
  const newPassword = req.body.newPassword;

  try {
    const encryptedPassword = await hashUtils.hashPassword(newPassword);

    await User.updatePassword(userId, encryptedPassword);

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
