// src/pages/Login/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLight, setIsLight] = useState(true); // ← bu bilan boshqaramiz
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://apichaqimchi.pythonanywhere.com/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user_id", data.user.id);
        navigate("/profile");
      } else {
        setError(data.detail || "Username yoki parol noto‘g‘ri");
      }
    } catch {
      setError("Server bilan aloqa yo‘q");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card shadow-lg p-4 p-lg-5 text-center">
        <div className="card-body p-5 p-lg-6 text-center">

          {/* LOGO – endi 100% light va dark rejimda ishlaydi */}
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
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-4 custom-input"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4 text-start">
              <label className="form-label fw-semibold">Parol</label>
              <input
                type="password"
                className="form-control form-control-lg rounded-4 custom-input"
                placeholder="••••••••"
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
