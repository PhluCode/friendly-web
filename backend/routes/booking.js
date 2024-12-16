const express = require('express');
const { addToCart, showCart, deCart, genbookingID } = require('../controllers/bookingController');
const router = express.Router();

// เพิ่มการจองลงใน cart
router.post('/book', addToCart);

// แสดงข้อมูลการจองใน cart
router.get('/cart/:userId', showCart);

// ลบการจองใน cart
router.delete('/:userId/cart/:bookingId', deCart);

// gen booking ID
router.post('/generate-booking-id/:userId', genbookingID);
  
  

module.exports = router;

