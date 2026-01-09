// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = hali tekshirilyapti

  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");
      // Token bor va bo‘sh emasmi?
      setIsLoggedIn(!!token && token !== "null" && token !== "undefined");
    } catch (err) {
      console.error("Token o‘qishda xatolik:", err);
      setIsLoggedIn(false);
    }
  }, []);

  // Hali tekshirish jarayonida → hech narsa ko‘rsatmaymiz (yoki loading)
  if (isLoggedIn === null) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  // // Token yo‘q → login ga
  // if (!isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  // Token bor → ichki sahifani ko‘rsat
  return <Outlet />;
};

export default ProtectedRoute;