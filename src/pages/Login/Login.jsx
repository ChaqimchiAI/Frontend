// src/pages/Login/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/Ui/Input"
import "./Login.css";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLight, setIsLight] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);


  // Har safar localStorage o‘zgarsa – theme ni yangilaymiz
  useEffect(() => {
    const checkTheme = () => {
      const saved = localStorage.getItem("theme");
      const light = saved ? JSON.parse(saved) : true;
      setIsLight(light);
      document.documentElement.setAttribute("data-bs-theme", light ? "light" : "dark");
    };

    checkTheme(); // birinchi marta

    // localStorage o‘zgarsa – avto yangilansin (masalan, boshqa sahifada theme o‘zgartirsa)
    window.addEventListener("storage", checkTheme);

    return () => window.removeEventListener("storage", checkTheme);
  }, []);


  // login qilish funksiyasi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginPayload = {
      username: username,
      password: password 
    };

    try {
      const res = await axios({
        method: 'post',
        url: 'https://erpbackend.pythonanywhere.com/api/v1/auth/login/',
        data: loginPayload,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Serverdan javob:", res);

      if (res.data.data && res.data.data.access) {
        localStorage.setItem("access_token", res.data.data.access);
        localStorage.setItem("refresh_token", res.data.data.refresh);
        window.location.reload()
      }
    } catch (err) {
      console.log("Xato tafsiloti", err.response?.data);

      if (err.response?.status === 500) {
        setError("Serverda xatolik");
      } else {
        setError(err.response?.data?.detail || "Login yoki parol noto'g'ri");
      }
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="login-wrapper">
      <div className="login-card shadow-lg p-4 p-lg-5 text-center">
        <div className="card-body p-5 p-lg-6 text-center">

          <div className="text-center mb-5">
            <div className="logo-container">
              <img
                src="/logo-light.svg"
                alt="Chaqimchi AI"
                className="login-logo-img"
                style={{ display: isLight ? "block" : "none" }}
              />
              <img
                src="/logo-dark.svg"
                alt="Chaqimchi AI"
                className="login-logo-img"
                style={{ display: !isLight ? "block" : "none" }}
              />
            </div>

          </div>

          {/* Xato */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-start">
              <Input
                label="Login"
                placeholder="Login.."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4 text-start">
              <Input
                label="Parol"
                type="password"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember">Eslab qolish</label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 rounded-4 fw-bold d-flex justify-content-center align-items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Kirish jarayonida...
                </>
              ) : (
                "Kirish"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
