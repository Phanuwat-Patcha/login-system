require('dotenv').config(); // โหลดค่า .env
const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// 🔹 ให้ server อ่าน JSON body จาก Postman
app.use(express.json());

// 🔹 เชื่อม MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}
connectDB();

// 🔹 สร้าง Schema + Model สำหรับเก็บข้อมูลตัวอย่าง
const TestSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const TestModel = mongoose.model('Test', TestSchema);

// 🔹 Route GET ตรวจสอบ server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// 🔹 Route GET ดึงข้อมูลทั้งหมดจาก MongoDB
app.get('/tests', async (req, res) => {
  try {
    const data = await TestModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Route POST สำหรับยิงข้อมูลเข้า MongoDB
app.post('/tests', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newEntry = new TestModel({ name, email });
    await newEntry.save();
    res.status(201).json({ message: 'Data saved!', data: newEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
