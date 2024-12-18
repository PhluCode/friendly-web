const Booking = require('../models/Booking'); // Import Booking model

exports.addBooking = async (req, res) => {
    try {
      const {
        guest,
        amount,
        checkIn,
        checkOut,
        roomTypes,
        bookingDate,
        reservationNumber,
        paymentMethod,
        status
      } = req.body;
  
      const newBooking = new Booking({
        guest,
        amount,
        checkIn,
        checkOut,
        roomTypes,
        bookingDate,
        reservationNumber,
        paymentMethod,
        status
      });
  
      const savedBooking = await newBooking.save();
      res.status(201).json({ message: 'Booking created successfully', booking: savedBooking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  }

exports.showBooking = async (req, res) => {
    try {
      const bookings = await Booking.find().sort({ bookingDate: -1 });
      res.status(200).json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
  }

exports.updateStatusBooking = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // รับค่า status จาก body
  
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
  
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true } // ส่งคืนข้อมูลที่ถูกอัปเดต
      );
  
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      res.json(updatedBooking); // ส่งคืนข้อมูลการจองที่อัปเดตแล้ว
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  }

exports.findBooking = async (req, res) => {
    try {
      const reservationNumber = req.params.reservationNumber; // รับ reservationNumber จาก URL parameter
  
      const booking = await Booking.findOne({ reservationNumber }); // ค้นหาการจองโดย reservationNumber
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' }); // ถ้าหากไม่พบการจอง
      }
  
      res.status(200).json(booking); // ส่งข้อมูลการจองที่พบ
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
  }