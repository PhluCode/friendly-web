import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";  // นำเข้า SweetAlert2
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      // ส่งคำขอ POST ไปยัง API สำหรับการเข้าสู่ระบบ
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.user.role === "admin") {
        Swal.fire({
          title: t('Welcome Admin!'),
          text: t('You have admin access.'),
          icon: 'success',
          confirmButtonText: t('Confirm'),
          timer: 1500
        });

        window.open('/admin-control/reservations', '_blank')
      } else {
        Swal.fire({
          title: t('Login Successful!'),
          text: t('Welcome to the system'),
          icon: 'success',
          confirmButtonText: t('Confirm'),
          timer: 1500
        }).then(() => {
          setTimeout(() => {
              window.location.reload();
          }, 500); 
        })

        navigate('/')
      }

      // คุณสามารถเก็บข้อมูลผู้ใช้หรือ Token ที่ได้จากการเข้าสู่ระบบ
      // เช่นการเก็บใน localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);

      // รีเซ็ตฟอร์ม
      setEmail('');
      setPassword('');

      console.log("Password sent to server:", password);

    } catch (err) {
      // หากมีข้อผิดพลาด
      console.error(err);

      Swal.fire({
        title: t('An error occurred!'),
        text: err.response ? t(err.response.data.message) : t('Unable to register. Please try again.'),
        icon: 'error',
        confirmButtonText: t('Confirm')
      });

      console.log("Password sent to server:", password);

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-700">{t('Login')}</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-600">{t('Email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-gray-600">{t('Password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t("Confirm")}
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-600">{t('Do not have en account yet?')} </span>
          <button
            onClick={() => navigate('/register')}
            className="text-blue-500 hover:text-blue-700"
          >
            {t('Register')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;