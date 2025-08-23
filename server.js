require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// User Schema & Model (ตรงกับฟอร์ม React)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // ใช้ email เป็น unique key
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickname: { type: String, required: true },
  phone: { type: String, required: true },
});

// ป้องกัน duplicate email ด้วย plugin หรือ index
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

// Register API
app.post("/register", async (req, res) => {
  try {
    console.log("Received body:", req.body); // ตรวจสอบข้อมูลจาก React

    const { email, password, firstName, lastName, nickname, phone } = req.body;

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email นี้ถูกใช้งานแล้ว" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      nickname,
      phone,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "frontend", "build")));

// ใช้ fallback สำหรับ React Router
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
