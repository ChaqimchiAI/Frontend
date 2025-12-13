import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      try {
        await axios.post(
          "http://apichaqimchi.pythonanywhere.com/api/v1/user/logout/",
          { refresh: refreshToken || "" },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center text-lg font-medium">
      Chiqilmoqda...
    </div>
  );
}
