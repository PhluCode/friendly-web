import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // สร้าง instance ของ useNavigate

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
          // ส่งคำขอ POST ไปยัง API สำหรับการสมัครสมาชิก
          const response = await axios.post(`${backendUrl}/api/auth/register`, {
            name,
            email,
            password,
          });
    
          // หากสมัครสำเร็จ
          console.log(response.data);
          Swal.fire({
            title: t('Register Successful!'),
            text: t('You can now log in.'),
            icon: 'success',
            confirmButtonText: t('Confirm'),
            timer: 1500
          });
    
          // ทำการรีเซ็ตฟอร์ม
          setName('');
          setEmail('');
          setPassword('');

          navigate('/login');

        } catch (err) {
          // หากมีข้อผิดพลาด
          console.error(err);
    
          Swal.fire({
            title: t('An error occurred!'),
            text: err.response ? err.response.data.message : t('Unable to register. Please try again.'),
            icon: 'error',
            confirmButtonText: t('Confirm')
          });
        }
      };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-extrabold text-center text-gray-700">{t('Register')}</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('Name')}</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                </div>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('Email')}</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                </div>
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('Password')}</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                </div>
                <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                {t('Confirm')}
                </button>
            </form>
            </div>
        </div>
      );
};

export default Register;