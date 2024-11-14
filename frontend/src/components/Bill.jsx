import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const Bill = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();  // สร้าง instance ของ useNavigate

  const { t } = useTranslation()


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?._id;
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setUser(response.data);

        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const bookingData = {
    guest: user.name,
    amount: user.bookings.reduce((total, booking) => total + (Number(booking.pricePerRoom) * Number(booking.nightCount)), 0),
    checkIn: user.bookings[0].checkInDate,
    checkOut: user.bookings[user.bookings.length - 1].checkOutDate,
    roomTypes: user.bookings.map((booking) => booking.roomType + " - " + booking.bedCount),
    bookingDate: new Date().toISOString().split('T')[0], // วันที่จองเป็นวันที่ปัจจุบัน
    reservationNumber: user.bookingID, // ใช้ bookingID ที่สุ่มขึ้นมา
    paymentMethod: "Cash On",
    status: "Pending"
  };

  const handleDoneClick = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?._id;

      await Promise.all(user.bookings.map((booking) => 
        axios.delete(`http://localhost:5000/api/${userId}/cart/${booking._id}`)
      ));

      navigate('/'); // ไปที่หน้า Home

      const response = await axios.post('http://localhost:5000/api/bookings/create', bookingData);
      console.log('Booking saved:', response.data);

      await Promise.all(user.bookings.map(async (booking) => {
        await axios.patch(`http://localhost:5000/api/rooms/decrement/${booking.roomType}`, {
          decrement: 1
        });
      }))

      Swal.fire({
        icon: 'success',
        title: t('Booking Completed!'),
        text: t('Hope to see you'),
        timer: 2500
      });

    } catch (error) {
      console.error('Error during booking:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center flex-col">
      <div className="bg-white p-8 shadow-lg w-full max-w-lg">
        <div className="flex justify-between">
            <h2 className="text-2xl font-semibold mb-4">Booking Details</h2> 
            <span className='text-2xl font-light text-gray-500'>Friendly Resort</span>
        </div>

        <p className='font-light mb-2'><span className="font-medium" >Booking No. </span>{user.bookingID}</p>
        
        {user.bookings && user.bookings.length > 0 ? (
          user.bookings.map((booking) => (
            <div key={booking._id} className="mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Guest name(s):</span>
                <span className='font-light'>{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Guest numbers:</span>
                <span className='font-light'>{booking.guestCount} guests</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Booking date:</span>
                <span className='font-light'>{new Date(booking.bookDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Stay period:</span>
                <span className='font-light'>
                  {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Room Night(s):</span>
                <span className='font-light'>{booking.nightCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Rooms Type:</span>
                <span className='font-light'>{booking.roomType} {booking.bedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Room rate:</span>
                <span className='font-light'>THB {booking.pricePerRoom.toFixed(2)*booking.nightCount}</span>
              </div>
            </div>
          ))
        ) : (
          <div>No bookings available</div>
        )}

        <div className='mb-6'>
            <p className='font-light'><span className="font-medium" >Total: </span>{new Intl.NumberFormat('th-TH').format(
            user.bookings.reduce((total, booking) => total + (Number(booking.totalAmount) * Number(booking.nightCount)), 0)
            )} THB</p>
            <p className='font-light'><span className="font-medium" >Payment type: </span>Cash On Delivery</p>
            <p className='font-light'><span className="font-medium" >Result: </span>Confirm</p>
        </div>
      </div>
      <div className="bg-white p-2 shadow-lg w-full max-w-md mt-3 flex items-center justify-between rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h3M3 12h3M3 17h3m6 5h3a2 2 0 002-2v-3a2 2 0 00-2-2h-3v-4h6a2 2 0 012 2v7a2 2 0 01-2 2h-7M8 7h.01M8 12h.01M8 17h.01M13 7h.01M13 12h.01M13 17h.01" />
            </svg>
            <span className="text-gray-700 font-medium">Please Capture It</span>
        </div>
        <button 
            onClick={handleDoneClick}  // เมื่อคลิกจะไปหน้า Home
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">
            Confirm booking !
        </button>
      </div>
    </div>
  );
};

export default Bill;


  