const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guest: {
    type: String, // รายชื่อผู้เข้าพัก (สามารถเปลี่ยนเป็น array ของ object ตามต้องการ)
    required: true
  },
  amount: {
    type: Number, // จำนวนเงินที่ต้องชำระ
    required: true
  },
  checkIn: {
    type: Date, // วันที่เช็คอิน
    required: true
  },
  checkOut: {
    type: Date, // วันที่เช็คเอาท์
    required: true
  },
  roomTypes: {
    type: [{ 
      type: String,
      required: true
    }],
    required: true
  },
  bookingDate: {
    type: Date, // วันที่ทำการจอง
    default: Date.now
  },
  reservationNumber: {
    type: Number,
    required: true 
  },
  paymentMethod: {
    type: String, // วิธีการชำระเงิน
    required: true
  },
  status: {
    type: String, // สถานะการจอง
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Booking', bookingSchema);

