const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    
    // ตรวจสอบว่าผู้ใช้นี้มีอยู่แล้วหรือยัง
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await argon2.hash(password);

    // สร้างผู้ใช้ใหม่
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role : 'user',
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ตรวจสอบว่าอีเมลมีในฐานข้อมูลหรือไม่
    const user = await User.findOne({ email });
    if (user) {

      const passwordMacth = await argon2.verify(user.password, password);

      console.log(password)
      console.log(user.password)

      if(passwordMacth){
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({
          message: 'เข้าสู่ระบบสำเร็จ',
          user,
          token,
        });
      } else {
        return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง'});
      }
    } else {
      return res.status(400).json({ message: 'ผู้ใช้ไม่พบ' });
    }
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error });
  }
};



