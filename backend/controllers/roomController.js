const Room = require('../models/Room');

exports.allRooms = async (req, res) => {
    try {
      const rooms = await Room.find();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

exports.updateRoom = async (req, res) => {
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
}

exports.deRoom = async (req, res) => {
    const { roomId } = req.params;
    const { decrement } = req.body;
  
    try {
      // ค้นหาและอัปเดตจำนวนห้องที่เหลือสำหรับ roomId ที่กำหนด
      const updatedRoom = await Room.findOneAndUpdate(
        { _id: roomId }, // ค้นหาจากชื่อประเภทห้อง
        { $inc: { left: -decrement } }, // ลดจำนวนห้องลงตามค่า decrement
        { new: true } // คืนค่าหลังอัปเดต
      );
  
      if (!updatedRoom) {
        return res.status(404).json({ message: 'Room Id not found' });
      }
  
      res.json({
        message: 'Room count updated successfully',
        room: updatedRoom
      });
    } catch (error) {
      console.error('Error updating room count:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }