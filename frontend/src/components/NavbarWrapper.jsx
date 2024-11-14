import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const NavbarWrapper = ({ cartCount, updateCartCount }) => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/bill'; // ซ่อน Navbar ถ้าเป็นหน้า Bill

  return showNavbar ? <Navbar cartCount={cartCount} updateCartCount={updateCartCount} /> : null;
};

export default NavbarWrapper;
