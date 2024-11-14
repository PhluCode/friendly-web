import friendlyhomePic2 from '../assets/S__14049285_0.jpg';
import { useEffect ,useState } from "react";
import RoomCard from './RoomCard';
import axios from 'axios';
import { useTranslation } from 'react-i18next';


function Home({ updateCartCount }) {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");

  const [rooms, setRooms] = useState([]); // สำหรับเก็บข้อมูลห้องพัก
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation()

  useEffect(() => {
    // ดึงข้อมูลห้องพักจาก API
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/rooms`);
        setRooms(response.data); // เก็บข้อมูลห้องพักใน state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

   // ตรวจสอบว่า check-out ต้องหลัง check-in เสมอ
    const handleCheckinChange = (e) => {
      setCheckinDate(e.target.value);
      // ปรับวันที่เช็คเอาท์ให้หลังจากเช็คอิน
      if (checkoutDate && e.target.value >= checkoutDate) {
        setCheckoutDate("");
      }
    };

    const handleCheckoutChange = (e) => {
      setCheckoutDate(e.target.value);
    };

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user._id : null;

  return (
    <div className='mt-10'>
      {/* Hero Image */}
      <div>
        <img 
          src={friendlyhomePic2} 
          className='w-full h-[400px] object-cover' 
          style={{ objectPosition: '50% 80%' }} 
          alt="Friendly Resort"
        />
      </div>

      {/* Booking Form */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">

          {/* Date Pickers - Check-in and Check-out (Horizontal Layout) */}
          <div className="flex space-x-4 mb-4">
            
            {/* Check-in Date */}
            <div className="w-1/2">
              <label htmlFor="checkin-date" className="block text-lg font-medium text-gray-700">
                {t("Check-in Date")}:
              </label>
              <input 
                type="date" 
                id="checkin-date" 
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md" 
                value={checkinDate}
                onChange={handleCheckinChange}
              />
            </div>

            {/* Check-out Date */}
            <div className="w-1/2">
              <label htmlFor="checkout-date" className="block text-lg font-medium text-gray-700">
                {t("Check-out Date")}:
              </label>
              <input 
                type="date" 
                id="checkout-date" 
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md" 
                value={checkoutDate}
                onChange={handleCheckoutChange}
                min={checkinDate} // ให้เลือกวันที่เช็คเอาท์ต้องไม่เก่ากว่าวันที่เช็คอิน
              />
            </div>

          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <RoomCard
            userId={userId}
            key={room.id}
            name={room.name}
            image={room.image}
            sleeps={room.sleeps}
            bed={room.bed}
            price={room.price}
            left={room.left}
            checkInDateVal={checkinDate}
            checkOutDateVal={checkoutDate}
            updateCartCount={updateCartCount} // ส่งฟังก์ชันนี้ไปที่ RoomCard
            detailsRoom={room.details}
          />
        ))}
      </div>
    </div>
  )
}

export default Home;
