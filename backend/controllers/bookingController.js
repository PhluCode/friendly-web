const User = require('../models/User');

exports.addToCart = async (req, res) => {
    try {
      const { userId, checkInDate, checkOutDate, bookDate, nightCount, roomCount, roomId, roomType, bedCount, guestCount, pricePerRoom, totalAmount } = req.body;
  
      // ค้นหาผู้ใช้จาก userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // สร้างข้อมูลการจอง
      const booking = {
        checkInDate,
        checkOutDate,
        bookDate,
        nightCount,
        roomCount,
        roomId,
        roomType,
        bedCount,
        guestCount,
        pricePerRoom,
        totalAmount,
      };
  
      // เพิ่มการจองลงใน array ของ bookings ของ User
      user.bookings.push(booking);
  
      // บันทึกข้อมูลการจองลงใน User
      await user.save(); 
  
      res.status(200).json({ message: 'Booking successfully added to user', user });
    } catch (error) {
      res.status(500).json({ message: 'Error saving booking', error });
    }
  }

exports.showCart = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // ค้นหาผู้ใช้และดึงเฉพาะข้อมูลการจอง
      const user = await User.findById(userId).select('bookings');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // ส่งข้อมูลการจองใน response
      res.status(200).json({ bookings: user.bookings });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart data', error });
    }
  }

exports.deCart = async (req, res) => {
    try {
      const { userId, bookingId } = req.params;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // ลบการจองออกจาก cart
      user.bookings = user.bookings.filter((booking) => booking._id.toString() !== bookingId);
      await user.save();
  
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting booking', error });
    }
  }

exports.genbookingID = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // แปลง userId เป็น ObjectId
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const generateBookingID = () => Math.floor(Math.random() * 1000000000000000);

      const isBookingIDExist = async (id) => {
        const existingUser = await User.findOne({ bookingID: id });
        return existingUser !== null;
      };

      do {
        bookingID = generateBookingID();
      } while (await isBookingIDExist(bookingID));
  
      user.bookingID = bookingID;  // อัปเดต bookingID ในเอกสารของผู้ใช้
  
      await user.save();  // บันทึกข้อมูล
  
      res.status(200).json({ bookingID });
    } catch (error) {
      console.error("Error generating booking ID:", error);  // เพิ่มการแสดงข้อความข้อผิดพลาด
      res.status(500).json({ message: 'Error generating booking ID', error: error.message || error });
    }
  }