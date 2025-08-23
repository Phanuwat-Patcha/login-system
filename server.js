require('dotenv').config(); // โหลดค่า .env
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ฟังก์ชันเชื่อม MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // ถ้าเชื่อมไม่สำเร็จ ให้ปิดโปรแกรม
  }
}

// เรียกเชื่อมต่อ DB
connectDB();

// สร้าง server พื้นฐาน
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
