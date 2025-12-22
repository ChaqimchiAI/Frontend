import Header from '../components/Header/Header'
import Menu from '../components/Menu/Menu'
import { useState , useEffect } from 'react';
import './Layout.css'
import { Outlet } from 'react-router-dom';
import axios from "axios";

const Layout = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  let [toggleTheme , setToggleTheme] = useState(() => {
    let saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : true;
  });

  let [togglebar , setTogglebar] = useState(() => {
    let saved = localStorage.getItem("sidebar");
    return saved ? JSON.parse(saved) : true;
  });

  let [showbar , setShowbar] = useState(false);
  let [media , setMedia] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://apichaqimchi.pythonanywhere.com/api/v1/staff/${employee.id}//", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setEmployee(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(toggleTheme));
    let html = document.documentElement;
    html.setAttribute("data-bs-theme", toggleTheme ? "light" : "dark");
  }, [toggleTheme]);


  useEffect(() => {
    localStorage.setItem("sidebar", JSON.stringify(togglebar));
    let body = document.body;
    togglebar
      ? body.removeAttribute("data-sidebartype")
      : body.setAttribute("data-sidebartype", "mini-sidebar");
  }, [togglebar]);

  if (loading) return <div>Loading...</div>;

  return (
    <div id='main-wrapper' className={`site-layout ${media ? "show-sidebar" : ""}`}>
      <aside className="index-menu">
        {/* user ma’lumotlarini Menu ga yuboramiz */}
        <Menu 
          employee={employee}
          toggleTheme={toggleTheme} 
          togglebar={togglebar} 
          setMedia={setMedia} 
        />
      </aside>

      <main className="layout-content">
        {/* user ma’lumotlarini Header ga yuboramiz */}
        <Header 
          employee={employee}
          toggleTheme={toggleTheme} 
          setToggleTheme={setToggleTheme}
          setTogglebar={setTogglebar} 
          setShowbar={setShowbar} 
          setMedia={setMedia} 
        />

        <Outlet />
      </main>
    </div>
  )
}

export default Layout;
