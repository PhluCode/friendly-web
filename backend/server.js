const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bookingRoutes = require('./routes/booking'); // ใช้ route ที่สร้าง
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingConfirmRoute = require('./routes/bookingConfirm');


const app = express();
const PORT = process.env.PORT || 5000;

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json()); // Middleware สำหรับรับข้อมูล JSON
app.use(express.static('roompic'));
app.use('/api', bookingRoutes); // ใช้ route ที่สร้างสำหรับการจอง
app.use('/api/auth', authRoutes);
app.use('/api', roomRoutes);
app.use('/api', userRoutes);
app.use('/api/bookings', bookingConfirmRoute);

// เริ่มต้นเซิร์ฟเวอร์เพียงครั้งเดียว
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

 

