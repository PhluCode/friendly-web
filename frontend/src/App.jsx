import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './i18n'; 
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import NavbarWrapper from './components/NavbarWrapper';
import About from './components/About';
import Policies from './components/Policies';
import Contact from './components/Contact';
import Bill from './components/Bill';
import { useState } from 'react';
import AdminControl from './components/AdminControl';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <Router>
      <AppWithRouter cartCount={cartCount} updateCartCount={updateCartCount} />
    </Router>
  )
}

function AppWithRouter({ cartCount, updateCartCount }) {
  const location = useLocation();

  return (
    <div className="App relative">
      {/* แสดง NavbarWrapper เฉพาะเมื่อไม่ใช่หน้า /admin-control */}
      {location.pathname.startsWith('/admin-control') === false && (
        <NavbarWrapper cartCount={cartCount} updateCartCount={updateCartCount} />
      )}
      
      <div className="bg-blue-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home updateCartCount={updateCartCount} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/bill' element={<Bill />} />
          {/* หน้าสำหรับ admin */}
          <Route path="/admin-control/*" element={<AdminControl />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;



