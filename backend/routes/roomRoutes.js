const express = require('express');
const { allRooms, updateRoom, deRoom } = require('../controllers/roomController');
const router = express.Router();


// GET: ดึงข้อมูลห้องพักทั้งหมด
router.get('/rooms', allRooms);

// ปุ่ม confirm update ราคาและห้องที่เหลือ
router.put("/rooms/update/:id", updateRoom);

// Route สำหรับลดจำนวนห้องที่เหลือ
router.patch('/rooms/decrement/:roomId', deRoom);


module.exports = router;
