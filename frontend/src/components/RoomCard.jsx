import { IoMdPeople } from "react-icons/io";
import { FaBed } from "react-icons/fa";
import { BsFillDoorClosedFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

const RoomCard = ({ userId, name, image, sleeps, bed, price, left, checkInDateVal, checkOutDateVal, updateCartCount, detailsRoom }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [bookingData, setBookingData] = useState({
    userId: userId,
    checkInDate: checkInDateVal,
    checkOutDate: checkOutDateVal,
    bookDate: new Date().toISOString().split('T')[0],
    nightCount: 0,
    roomCount: 1,
    roomType: name,
    bedCount: bed,
    guestCount: sleeps,
    pricePerRoom: price,
    totalAmount: price,
  });

  const { t } = useTranslation()

  useEffect(() => {
    if (checkInDateVal && checkOutDateVal) {
      // แปลงวันที่จาก string เป็น Date object
      const checkInDate = new Date(checkInDateVal);
      const checkOutDate = new Date(checkOutDateVal);
  
      // ตรวจสอบว่าการแปลงเป็น Date สำเร็จ
      if (checkInDate instanceof Date && checkOutDate instanceof Date && !isNaN(checkInDate) && !isNaN(checkOutDate)) {
        const nightCount = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));
        setBookingData((prevData) => ({
          ...prevData,
          checkInDate: checkInDateVal,
          checkOutDate: checkOutDateVal,
          nightCount: nightCount,
        }));
      } else {
        console.error('Invalid date format');
      }
    }
  }, [checkInDateVal, checkOutDateVal, price]);
  
  


   // ฟังก์ชันจัดการการเลือก
   const handleSelect = async () => {
    
    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: t('Please login first!'),
        text: t('You are not logged in.')
      })
    } else if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      Swal.fire({
        icon: 'warning',
        title: t('Missing Dates'),
        text: t('Please select both check-in and check-out dates before booking!'),
      });
      return;
    } else {
      Swal.fire({
        icon: 'success',
        title: t('Added to Cart'),
        text: t('Check your booking on Cart Icon!'),
        timer: 1500
      });
    }

    try {
      // ส่งข้อมูลการจองไปยัง Backend
      const response = await axios.post(`${backendUrl}/api/book`, bookingData);
      console.log('Booking Success:', response.data);
      // ทำอะไรเพิ่มเติมหลังจากจองห้องสำเร็จ เช่น ปิด Modal หรือแสดงข้อความสำเร็จ
      updateCartCount((prevCount) => prevCount + 1); // เพิ่มจำนวนการจองในตะกร้า
    } catch (error) {
      console.error('Error Booking Room:', error);
    }
  };

  return (
    <div className="w-5/6 max-w-sm md:max-w-md lg:max-w-lg rounded-lg overflow-hidden shadow-lg border mx-auto bg-white">
      {/* Image Section */}
      <div className="relative">
        <img
          src={`http://localhost:5000${image}`}
          alt="Room Picture"
          className="w-full h-48 object-cover"
        />
        <h2 className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-lg p-2">
          {name}
        </h2>
      </div>

      {/* Room Details */}
      <div className="p-4">
        <ul className="text-sm text-gray-600">
          <li className="flex items-center">
            <span role="img" aria-label="Sleeps"><IoMdPeople className="mr-2"/></span> {t("Sleeps")} {sleeps}
          </li>
          <li className="flex items-center">
            <span role="img" aria-label="Bed"><FaBed className="mr-2"/></span> {bed}
          </li>
          <li className="flex items-center pb-2 border-b-2">
            <span role="img" aria-label="Door"><BsFillDoorClosedFill className="mr-2"/></span>{t("rooms left")} {left} 
          </li>
          <ul className="flex flex-col pt-2">
            {detailsRoom.reduce((rows, detail, index) => {
              if (index % 2 === 0) rows.push([]); // เริ่มแถวใหม่ทุกๆ 2 รายการ
              rows[rows.length - 1].push(detail);
              return rows;
            }, []).map((row, rowIndex) => (
              <li key={rowIndex} className="flex flex-row items-center space-x-4">
                {row.map((detail, detailIndex) => (
                  <span key={detailIndex} className="before:content-['•'] before:mr-2">
                    {t(detail)}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </ul>
      </div>

      {/* Price Section */}
      <div className="border-t p-4">
        <div className="flex justify-between items-center">
            <p className="text-lg font-bold">THB {price}</p>
            <button onClick={handleSelect}className="p-2 bg-blue-600 hover:bg-blue-400 text-white rounded">
              {t("Select")}
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
