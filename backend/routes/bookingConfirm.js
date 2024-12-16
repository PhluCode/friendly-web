const express = require('express');
const { addBooking, showBooking, updateStatusBooking, findBooking } = require('../controllers/bookingConfirmController');
const router = express.Router();


// สร้าง API สำหรับบันทึกข้อมูลการจอง
router.post('/create', addBooking);

// สร้าง API สำหรับดึงข้อมูลการจองทั้งหมด
router.get('/all', showBooking);

// API สำหรับอัปเดตสถานะการจอง
router.put("/update/:id", updateStatusBooking);

// สร้าง API สำหรับค้นหาการจองด้วย reservation
router.get('/find/:reservationNumber', findBooking);


module.exports = router;

