require('dotenv').config(); // โหลดค่า .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ เพิ่ม CORS

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// ✅ เปิด CORS
app.use(cors());

// ✅ ให้ server อ่าน JSON body จาก Postman / Frontend
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

// ✅ สร้าง Schema + Model
const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});
const TestModel = mongoose.model('Test', TestSchema);

// ✅ Route GET ตรวจสอบ server
app.get('/', (req, res) => {
  res.send('🚀 Server is running!');
});

// ✅ Route GET ดึงข้อมูลทั้งหมด
app.get('/tests', async (req, res) => {
  try {
    const data = await TestModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
});

// ✅ Route POST เพิ่มข้อมูลใหม่
app.post('/tests', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required!' });
    }

    const newEntry = new TestModel({ name, email });
    await newEntry.save();

    res.status(201).json({ message: '✅ Data saved successfully!', data: newEntry });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
