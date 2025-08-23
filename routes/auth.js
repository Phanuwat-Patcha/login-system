const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Validate ฟังก์ชันง่ายๆ
const isValidUsername = (s) => /^[a-z0-9_.-]{3,30}$/.test(s);

router.post("/register", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "username and password are required" });

    username = String(username).trim().toLowerCase();
    if (!isValidUsername(username))
      return res.status(400).json({ message: "Invalid username format" });
    if (String(password).length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existed = await User.findOne({ username });
    if (existed)
      return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "username and password are required" });

    username = String(username).trim().toLowerCase();

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      message: "Login success",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
