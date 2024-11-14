import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLanguage } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { LuLogIn } from "react-icons/lu";
import { FaShoppingCart } from "react-icons/fa"; // ไอคอนรถเข็น
import { MdManageSearch } from "react-icons/md";
import CartModal from './CartModal';
import axios from 'axios';

const Navbar = () => { 
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  }; 

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลจำนวนรายการในตะกร้า
    const fetchCart = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          const userId = storedUser._id;
          const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
          setCartCount(response.data.bookings.length); // อัปเดตจำนวนการจองในตะกร้า
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [updateCartCount]); // ทำงานเพียงครั้งเดียวเมื่อ component โหลด

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

   // ฟังก์ชันเปิด Modal
   const openCartModal = () => {
    setCartModalOpen(true);
  };

  // ฟังก์ชันปิด Modal
  const closeCartModal = () => {
    setCartModalOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-6"> 
          <div className="text-2xl font-bold">
            <Link to="/" className="hover:text-gray-300">
              Friendly Resort
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-300">{t('availability')}</Link>
            <Link to="/about" className="hover:text-gray-300">{t('about')}</Link>
            <Link to="/contact" className="hover:text-gray-300">{t('contact')}</Link>
            <Link to="/policies" className="hover:text-gray-300">{t('policies')}</Link>
          </div>
        </div>

        {/* User, Language, and Cart Controls */}
        <div className="flex items-center">

          {/* Cart Icon */}
          <div className="relative flex">
          {user && user.role === 'admin' ? (
            <button onClick={() => window.open('/admin-control/reservations', '_blank')} className='hidden md:flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'>
              <MdManageSearch className='mr-2'/>
              <p>ADMIN CONTROL</p>
            </button>
          ) : null}
            <button onClick={openCartModal} className="ml-4 text-xl mr-4">
              <FaShoppingCart /> 
              {cartCount > 0 && (
                <span className="absolute top-0 right-3 bg-red-500 text-white text-xs rounded-full w-2 h-2 "></span>
              )}
            </button>
          </div>

          {user ? (
            <div className='relative'>
              <button onClick={toggleDropdown} className="hidden md:flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                <MdAccountCircle className="text-lg" />
                <span className="ml-1">{user.name}</span>
              </button>

              {/* Dropdown Menu for Profile */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-gray-700 rounded-lg shadow-lg w-48">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-t-md"
                  >
                    {t('Log out')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              <LuLogIn className='text-lg mr-2'/>
              {t('login')}
            </Link>
          )}

          {/* Icon for Mobile User/Profile */}
          {user ? (
            <MdAccountCircle className="md:hidden text-2xl mx-2" onClick={toggleDropdown} />
          ) : (
            <Link to="/login" className="md:hidden text-2xl mx-2">
              <MdAccountCircle />
            </Link>
          )}

          {/* Language Button */}
          <button
            className="hidden md:flex ml-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md items-center space-x-2"
            onClick={() => changeLanguage(i18n.language === 'en' ? 'th' : 'en')}
          >
            <span>{i18n.language === 'en' ? 'ภาษาไทย' : 'English'}</span>
            <IoLanguage className="text-lg" />
          </button>
          
          {/* Language Icon for Mobile */}
          <button
            className="md:hidden flex items-center text-2xl mx-2"
            onClick={() => changeLanguage(i18n.language === 'en' ? 'th' : 'en')}
          >
            <span className='text-sm mr-1'>{i18n.language === 'en' ? 'TH' : 'EN'}</span>
          </button>

          {/* Hamburger Menu */}
          <button className="md:hidden text-2xl ml-2 mr-2" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <HiX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white flex flex-col items-start space-y-2 px-4 py-2">
          <Link to="/" onClick={toggleMobileMenu} className="hover:text-gray-300">{t('availability')}</Link>
          <Link to="/about" onClick={toggleMobileMenu} className="hover:text-gray-300">{t('about')}</Link>
          <Link to="/contact" onClick={toggleMobileMenu} className="hover:text-gray-300">{t('contact')}</Link>
          <Link to="/policies" onClick={toggleMobileMenu} className="hover:text-gray-300">{t('policies')}</Link>
        </div>
      )}

      <CartModal isOpen={isCartModalOpen} closeModal={closeCartModal} updateCartCount={setCartCount}/>
    </nav>
  );
};

export default Navbar;



