import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [updatedRooms, setUpdatedRooms] = useState({});

  // ดึงข้อมูลห้องพักทั้งหมดจาก API
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // อัปเดตข้อมูลที่เปลี่ยนใน input ของแต่ละห้อง
  const handleInputChange = (roomId, field, value) => {
    setUpdatedRooms((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: value,
      },
    }));
  };

  // ฟังก์ชันอัปเดตราคาและจำนวนห้องที่เหลือเมื่อกดปุ่ม Update
  const handleUpdate = async (roomId) => {
    try {
      const updatedData = updatedRooms[roomId];
      if (!updatedData) return; // ไม่มีการเปลี่ยนแปลงข้อมูล

      await axios.put(`http://localhost:5000/api/rooms/update/${roomId}`, updatedData);
      fetchRooms(); // รีเฟรชข้อมูลห้องหลังจากการอัปเดต

      Swal.fire({
        title: "Room updated successfully!",
        text: "^_^!",
        icon: "success"
      });

      // ลบข้อมูลที่เก็บใน updatedRooms เมื่ออัปเดตเสร็จ
      setUpdatedRooms((prev) => {
        const newUpdatedRooms = { ...prev };
        delete newUpdatedRooms[roomId];
        return newUpdatedRooms;
      });
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Rooms</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Room Name</th>
              <th className="px-4 py-2 border">Bed</th>
              <th className="px-4 py-2 border">Sleeps</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Rooms Left</th>
              <th className="px-4 py-2 border">Details</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id}>
                <td className="px-4 py-2 border">{room.name}</td>
                <td className="px-4 py-2 border">{room.bed}</td>
                <td className="px-4 py-2 border">{room.sleeps}</td>
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={updatedRooms[room._id]?.price || room.price}
                    onChange={(e) => handleInputChange(room._id, "price", e.target.value)}
                    className="border border-gray-300 p-2 w-32"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    type="number"
                    value={updatedRooms[room._id]?.left || room.left}
                    onChange={(e) => handleInputChange(room._id, "left", e.target.value)}
                    className="border border-gray-300 p-2 w-32"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <ul>
                    {room.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleUpdate(room._id)}
                    className="bg-blue-500 text-white p-2"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Room;
