import { useState, useEffect } from "react";
import axios from "axios";

function Reservations() {
  const [bookingId, setBookingId] = useState("");
  const [reservationList, setReservationList] = useState([]);
  const [searchError, setSearchError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/bookings/all`);
      setReservationList(response.data);
      setSearchError("");
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setSearchError("Failed to fetch bookings");
    }
  }; // This will run only once when the component mounts

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleSearch = async () => {
    if (!bookingId) {
      fetchAllBookings();
      return;
    }; // ถ้าไม่มี ID ในการค้นหา ให้ยุติฟังก์ชัน

    try {
      const response = await axios.get(`${backendUrl}/api/bookings/find/${bookingId}`);
      setReservationList([response.data]); // แสดงผลการค้นหาที่พบ
      setSearchError(""); // ล้างข้อความผิดพลาดถ้าเจอผลการค้นหา
    } catch (error) {
      console.error("Error searching for booking:", error);
      setSearchError("Booking not found. Please try another ID."); // แสดงข้อความแจ้งเตือนถ้าไม่พบการจอง
    }
  }

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await axios.put(`${backendUrl}/api/bookings/update/${reservationId}`, { status: newStatus });
      setReservationList((prevList) =>
        prevList.map((reservation) =>
          reservation._id === reservationId ? { ...reservation, status: newStatus } : reservation
        )
      );
      setSearchError(""); // Reset error message after successful update
    } catch (error) {
      console.error("Error updating status:", error);
      setSearchError("Failed to update status");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // หรือ 'en-US' หรือรูปแบบอื่นๆ
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search Box */}
      <div className="flex mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 w-64"
          placeholder="Search booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 ml-2"
        >
          Show
        </button>
      </div>

      {/* Display error message if booking not found */}
      {searchError ? 
      (<div className="flex items-center justify-center min-h-screen p-4 text-red-400">
        <div className=""></div>
      </div>) 
      : 
      (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Guest(s)</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Check-in</th>
                <th className="px-4 py-2 border">Check-out</th>
                <th className="px-4 py-2 border w-[250px]">Room type</th>
                <th className="px-4 py-2 border">Booking date</th>
                <th className="px-4 py-2 border">Reservation</th>
                <th className="px-4 py-2 border">Payment</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservationList.map((reservation, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{reservation.guest}</td>
                  <td className="px-4 py-2 border">{reservation.amount}</td>
                  <td className="px-4 py-2 border">{formatDate(reservation.checkIn)}</td>
                  <td className="px-4 py-2 border">{formatDate(reservation.checkOut)}</td>
                  <td className="px-4 py-2 border">
                    {/* Show Room types for multiple rooms */}
                    <ul className="pb-1 border-b-2">
                      {reservation.roomTypes.map((room, idx) => (
                        <li key={idx}>{room}</li>
                      ))}
                    </ul>
                    <p>{reservation.roomTypes.length > 1 ? `${reservation.roomTypes.length} rooms` : `${reservation.roomTypes.length} room`}</p>
                  </td>
                  <td className="px-4 py-2 border">{formatDate(reservation.bookingDate)}</td>
                  <td className="px-4 py-2 border">{reservation.reservationNumber}</td>
                  <td className="px-4 py-2 border">Cash</td>
                  <select
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation._id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reservations;




