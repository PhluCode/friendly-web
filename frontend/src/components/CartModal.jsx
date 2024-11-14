import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CartModal = ({ isOpen, closeModal, updateCartCount }) => {
  if (!isOpen) return null; // ถ้า Modal ไม่เปิดก็ไม่แสดงอะไร

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(''); // สถานะการเลือกวิธีชำระเงิน
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false); // สถานะการเปิดปิด dropdown
  const [isReadyToBook, setIsReadyToBook] = useState(false);

  const { t } = useTranslation() 

  const formattedDate = (date) => {
    const options = {
      weekday: 'short', // ย่อชื่อวัน
      day: '2-digit',   // วันในรูปแบบสองหลัก
      month: 'short',   // เดือนในรูปแบบย่อ
      year: '2-digit',  // ปีในรูปแบบสองหลัก
    };

    return new Date(date).toLocaleDateString('en-GB', options);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // ดึง userId จาก localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?._id;

        // ตรวจสอบว่ามี userId อยู่ก่อนที่จะเรียกใช้ API
        if (userId) {
          const response = await axios.get(`${backendUrl}/api/cart/${userId}`);
          setCart(response.data.bookings); // เก็บข้อมูลการจองของผู้ใช้ใน state
          updateCartCount(response.data.bookings.length);
        } else {
          console.error('User ID not found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, updateCartCount]);

  useEffect(() => {
    if (cart.length > 0 && paymentMethod) {
      setIsReadyToBook(true);
    } else {
      setIsReadyToBook(false);
    }
  }, [cart, paymentMethod]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDeleteBooking = async (bookingId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?._id;

      await axios.delete(`${backendUrl}/api/${userId}/cart/${bookingId}`);
      setCart(cart.filter((booking) => booking._id !== bookingId));
      updateCartCount(cart.length - 1); // อัปเดตจำนวนรายการใหม่
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
    setIsPaymentDropdownOpen(false); // ปิด dropdown เมื่อเลือกวิธีชำระเงิน
  };

  const togglePaymentDropdown = () => {
    setIsPaymentDropdownOpen((prev) => !prev); // สลับสถานะการเปิด/ปิด dropdown
  };

  const handleBook = async () => {
    try {

      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?._id;

      const response = await axios.post(`${backendUrl}/api/generate-booking-id/${userId}`);
      const bookingID = response.data;

      console.log(bookingID)

      closeModal(); // ปิด Modal
      navigate('/bill'); // ไปที่หน้า Bill
    } catch (error) {
      console.error('Error during booking:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 text-gray-800">
        <h2 className="text-2xl font-semibold">
            THB {new Intl.NumberFormat('th-TH').format(
            cart.reduce((total, booking) => total + (Number(booking.totalAmount) * Number(booking.nightCount)), 0)
            )} total
        </h2>
          <button onClick={closeModal} className="text-gray-500 text-xl">×</button>
        </div>

        {/* Booking Dates and Details */}
        <div className="mb-4 pb-4 border-b-2">
          {cart?.length > 0 ? (
            <>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 mb-1">
                  {formattedDate(cart[0].checkInDate)} – {formattedDate(cart[0].checkOutDate)}
                </p>
                <p className="text-sm text-gray-600">
                  {cart[0].nightCount > 1 ? `${cart[0].nightCount} ${t("nights")}` : `${cart[0].nightCount} ${t("night")}` } 
                </p>
              </div>
              <p className="text-sm text-gray-600">
                {cart.length > 1 ? `${cart.length} ${t("rooms")}` : `${cart.length} ${t("room")}`}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">{t("No booking available")}</p>
          )}
        </div>

        {/* Booking Details */}
        <div className="mb-4 pb-4">
          {cart.map((booking, index) => (
            <div key={index} className="mb-4 pb-4 border-b-2">
              <div className="flex justify-between">
                <p className="font-medium text-gray-800 mb-2">{booking.roomType} - {booking.bedCount}</p>
                <button onClick={() => handleDeleteBooking(booking._id)} className="text-red-500 hover:text-red-700">
                  <MdDeleteForever className="text-lg" />
                </button>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">
                  {booking.guestCount > 1 ? `${booking.guestCount} ${t("guests")}` : `${booking.guestCount} ${t("guest")}`},
                  {booking.nightCount > 1 ? `${booking.nightCount} ${t("nights")}` : `${booking.nightCount} ${t("night")}`}
                </p>
                <p className="text-sm text-gray-600">THB {new Intl.NumberFormat('th-TH').format(booking.totalAmount.toFixed(0))}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <div className="mb-4">
          <div className="flex justify-between">
            <p className="font-medium text-gray-800">{t("Total")}</p>
            <p className="text-gray-800">
              THB {new Intl.NumberFormat('th-TH').format(
            cart.reduce((total, booking) => total + (Number(booking.totalAmount) * Number(booking.nightCount)), 0)
            )}
            </p>
          </div>
        </div>

        {/* Payment Method Selection (Dropdown) */}
        <div className="mb-4">
          <p className="font-medium text-gray-800 mb-2">{t("Payment Method")}</p>
          <div className="relative">
            <button
              onClick={togglePaymentDropdown}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md w-full text-left"
            >
              {paymentMethod ? paymentMethod : `${t("Select a payment method")}`}
            </button>
            {isPaymentDropdownOpen && (
              <div className="absolute mt-2 w-full bg-white text-gray-700 shadow-lg rounded-md">
                <label className="block px-4 py-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value= {t('Cash On Delivery')}
                    checked={paymentMethod === 'cashOnDelivery'}
                    onChange={handlePaymentChange}
                    className="mr-2"
                  />
                  {t("Cash On Delivery")}
                </label>
                <label className="block px-4 py-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value= {t('QR Payment')}
                    checked={paymentMethod === 'qrPayment'}
                    onChange={handlePaymentChange}
                    className="mr-2"
                  />
                  {t("QR Payment")}
                </label>
                <label className="block px-4 py-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value= {t('MasterCard')}
                    checked={paymentMethod === 'masterCard'}
                    onChange={handlePaymentChange}
                    className="mr-2"
                  />
                  {t("MasterCard")}
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Book Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleBook}
            disabled={!isReadyToBook} // Disable if not ready
            className={`py-2 px-6 rounded-md w-full ${isReadyToBook ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {t("Book")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;


