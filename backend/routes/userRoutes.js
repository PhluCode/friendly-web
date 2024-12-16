const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { getUserId } = require('../controllers/ีuserController');

// ดึงข้อมูลผู้ใช้ตาม ID
router.get('/user/:id', getUserId);

module.exports = router;
