const User = require('../models/User');

exports.getUserId = async (req, res) => {
    try {
      const userId = req.params.id; // ดึง id จาก URL params
      const user = await User.findById(userId); // ใช้ Mongoose ในการค้นหาผู้ใช้ตาม ID
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' }); // หากไม่พบ user
      }
  
      res.status(200).json(user); // ส่งข้อมูล user กลับไป
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user data' });
    }
}