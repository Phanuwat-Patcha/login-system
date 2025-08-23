require('dotenv').config(); // โหลดค่า .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// ✅ เปิด CORS ให้ Frontend เรียกได้
app.use(cors());

// ✅ อ่าน JSON body
app.use(express.json());

// ✅ เชื่อม MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}
connectDB();

// ✅ สร้าง Schema + Model สำหรับ User
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickname: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

// ✅ Route ตรวจสอบ server
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// ✅ Route สมัครสมาชิก
app.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, nickname, phone } = req.body;

    // เช็คว่าข้อมูลครบไหม
    if (!email || !password || !firstName || !lastName || !nickname || !phone) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน!' });
    }

    // ป้องกัน email ซ้ำ
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้ไปแล้ว!' });
    }

    // สร้าง user ใหม่
    const newUser = new UserModel({
      email,
      password,   // ❗ตอนนี้เก็บแบบ plain-text (ควรใช้ bcrypt ในอนาคต)
      firstName,
      lastName,
      nickname,
      phone,
    });

    await newUser.save();

    res.status(201).json({ message: '✅ สมัครสมาชิกสำเร็จ!', data: newUser });
  } catch (error) {
    res.status(500).json({ error: '❌ เกิดข้อผิดพลาดในการสมัครสมาชิก', details: error.message });
  }
});

// ✅ Route GET users (debug)
app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
