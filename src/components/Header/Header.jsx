import "./Header.css";
import { Icon } from "@iconify/react";
import { Link, NavLink } from "react-router-dom";

const Header = ({ employee, toggleTheme, setToggleTheme, setTogglebar, setShowbar, setMedia }) => {

  const handleToggle = () => {
    let html = document.documentElement;
    setToggleTheme(!toggleTheme);
    if (toggleTheme) {
      html.setAttribute('data-bs-theme', "dark")
    } else {
      html.setAttribute('data-bs-theme', "light")
    }
  }
  const handleBar = () => {
    setMedia(true)
    let body = document.body;

    setTogglebar((prev) => {
      let newValue = !prev;

      if (newValue) {
        body.setAttribute('data-sidebartype', 'full');
      } else {
        body.setAttribute('data-sidebartype', 'mini-sidebar');
        setShowbar(true);
      }

      return newValue;
    });
  };
  const HandleMedia = () => {
    document.body.setAttribute('data-sidebartype', 'full');
    setTogglebar(true);
  }
  return (
    <header className="topbar sticky-top">
      <div className="with-vertical">
        <nav className="navbar position-relative navbar-expand-lg p-0">
          <li
            className="nav-item nav-icon-hover-bg rounded-circle"
            onClick={() => { handleBar(), setMedia(false) }}
          >
            <a
              className="nav-link sidebartoggler desktop-menu"
              id="headerCollapse"
              href="javascript:void(0)"
            >
              <Icon icon="solar:list-bold-duotone" className="fs-7" />
            </a>
            <a
              className="nav-link sidebartoggler mobile-menu"
              id="headerCollapse"
              href="javascript:void(0)"
            >
              <Icon icon="solar:list-bold-duotone" onClick={HandleMedia} className="fs-7" />
            </a>
          </li>

          <ul className="navbar-nav quick-links d-none d-lg-flex align-items-center">
            <li className="nav-item dropdown-hover d-none d-lg-block me-2">
              <Link
                to="/chats"
                className="nav-link header__blank-link"
              >
                Chat
              </Link>
            </li>
          </ul>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <div className="d-flex align-items-center justify-content-between">
              <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                <li
                  className="nav-item nav-icon-hover-bg rounded-circle"
                  onClick={handleToggle}
                >
                  {toggleTheme
                    ? <span
                      className="nav-link moon dark-layout"
                      style={{ display: "flex" }}
                    >
                      <Icon
                        icon="solar:moon-line-duotone"
                        className="moon"
                        style={{ display: "flex", fontSize: "22px" }}
                      />
                    </span>
                    : <span
                      className="nav-link sun light-layout"
                      style={{ display: "flex" }}
                    >
                      <Icon
                        icon="solar:sun-2-line-duotone"
                        className="sun"
                        style={{ display: "flex", fontSize: "22px" }}
                      />
                    </span>
                  }
                </li>

                <li className="nav-item dropdown">
                  <span
                    className="nav-link position-relative ms-6"
                    id="drop1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center flex-shrink-0">
                      <div className="user-profile me-sm-3 me-2 position-relative">
                        <img
                          src={employee?.photo_url || "/user-1.jpg"}
                          style={{ borderRadius: "100%", width: "40px", height: "40px", objectFit: "cover" }}
                          alt="user-img"
                        />
                      </div>
                      <span className="d-sm-none d-block">
                        <Icon icon="solar:alt-arrow-down-line-duotone" />
                      </span>
                      <div className="d-none d-sm-block">
                        <h6 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '2px' }} className={`profile-name ${toggleTheme ? 'text-black' : 'text-white'}`}>{employee?.first_name} {employee?.last_name}</h6>
                        <p style={{ fontSize: "15px" }} className="lh-base mb-0 text-capitalize profile-subtext">
                          {employee?.role || "-"}
                        </p>
                      </div>
                    </div>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
