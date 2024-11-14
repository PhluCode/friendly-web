// Map.js
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  useEffect(() => {
    const map = L.map("map").setView([9.67509982831695, 100.06330799870166], 13); // กำหนดพิกัดเริ่มต้น

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map);

    L.marker([9.67509982831695, 100.06330799870166]).addTo(map) // เพิ่ม Marker
      .bindPopup("A sample marker.")
      .openPopup();
  }, []);

  return <div
    id="map"
    className="w-full h-96 rounded-lg shadow-lg sticky" // ใช้ sticky และ top-16 เพื่อให้แผนที่ไม่ทับ Navbar
  ></div>;
};

export default Map;
