const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// GET: ดึงข้อมูลห้องพักทั้งหมด
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/rooms/update/:id", async (req, res) => {
  const { id } = req.params;
  const { price, left } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, { price, left }, { new: true });
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Failed to update room" });
  }
});

// Route สำหรับลดจำนวนห้องที่เหลือ
router.patch('/rooms/decrement/:roomType', async (req, res) => {
  const { roomType } = req.params;
  const { decrement } = req.body;

  try {
    // ค้นหาและอัปเดตจำนวนห้องที่เหลือสำหรับ roomType ที่กำหนด
    const updatedRoom = await Room.findOneAndUpdate(
      { name: roomType }, // ค้นหาจากชื่อประเภทห้อง
      { $inc: { left: -decrement } }, // ลดจำนวนห้องลงตามค่า decrement
      { new: true } // คืนค่าหลังอัปเดต
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room type not found' });
    }

    res.json({
      message: 'Room count updated successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Error updating room count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
