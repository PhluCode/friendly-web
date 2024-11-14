import { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Reservations from './Reservations';  // หน้าสำหรับแสดงข้อมูลการจอง
import RoomControl from './RoomControl';  // หน้าสำหรับการจัดการห้อง

const AdminControl = () => {
  const [activeTab, setActiveTab] = useState('reservations'); // ใช้เพื่อจัดการการเลือกแท็บใน sidebar

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-56 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Control</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/admin-control/reservations"
              className={`block py-2 px-4 rounded ${activeTab === 'reservations' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              onClick={() => setActiveTab('reservations')}
            >
              Reservations
            </Link>
          </li>
          <li>
            <Link
              to="/admin-control/room"
              className={`block py-2 px-4 rounded ${activeTab === 'room' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              onClick={() => setActiveTab('room')}
            >
              Room
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route path="reservations" element={<Reservations />} />
          <Route path="room" element={<RoomControl />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminControl;

