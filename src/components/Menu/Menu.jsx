import { Link, NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { IconX } from "@tabler/icons-react";
import "./Menu.css";
import { useState } from "react";


const Menu = ({ employee, toggleTheme, togglebar, setMedia }) => {
  const [exam, setExam] = useState(false);

  return (
    <aside id="aside-menu-toggle" className="left-sidebar with-vertical">
      <div className="brand-logo d-flex align-items-center justify-content-between">
        <Link className="text-nowrap logo-img" to="/">
          {togglebar ? toggleTheme ? <img
            src="/logo-light.svg"
            className="dark-logo"
            alt="Logo-Dark"
            style={{ display: "flex" }}
          /> : <img
            src="/logo-dark.svg"
            className="light-logo"
            alt="Logo-light"
            style={{ display: "flex" }}
          /> : <img src="/favicon.png"
            className="index-mini-logo"
            alt="Logo-light"
            width={40} height={40}
            style={{ display: "flex" }} />}
        </Link>
        <a
          href="#"
          id="mobile-close-sidebar"
          className="sidebartoggler ms-auto text-decoration-none fs-5"
        >
          <IconX className="menu-xmark" onClick={() => setMedia(false)} size={20} />
        </a>
      </div>

      <div className="scroll-sidebar simplebar-scrollable-y" data-simplebar="init">
        <div className="simplebar-wrapper" style={{ margin: "0px -16px" }}>
          <div className="simplebar-mask">
            <div
              className="simplebar-content-wrapper"
              role="region"
              aria-label="scrollable content"
              style={{ height: "100%", overflow: "auto" }}
            >
              <div className="simplebar-content" style={{ padding: "0px 16px" }}>
                <nav className="sidebar-nav">
                  <ul id="sidebarnav" className="mb-0">

                    <li className="nav-small-cap">
                      <Icon
                        icon="solar:menu-dots-bold-duotone"
                        className="nav-small-cap-icon fs-5"
                      />
                      {togglebar
                        ? <span className="hide-menu">Bosh sahifa</span>
                        : <Icon
                          icon="mdi:dots-horizontal"
                          width="28"
                          height="28"
                          style={{ marginLeft: '3px', cursor: 'pointer', color: '#808090' }}
                        />
                      }
                    </li>

                    <li className="sidebar-item">
                      <NavLink
                        className="sidebar-link primary-hover-bg"
                        to="/"
                        aria-expanded="false"
                      >
                        <span className="aside-icon p-2 bg-primary-subtle rounded-1">
                          <Icon icon="solar:screencast-2-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Boshqaruv paneli</span> : ''}
                      </NavLink>
                    </li>

                    <li className="sidebar-item">
                      <NavLink
                        className="sidebar-link info-hover-bg"
                        to="/profile"
                        aria-expanded="false"
                      >
                        <span className="aside-icon p-2 bg-info-subtle rounded-1">
                          <Icon icon="solar:user-circle-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Hisob</span> : ''}
                      </NavLink>
                    </li>

                    <li className="sidebar-item">
                      <NavLink
                        className="sidebar-link info-hover-bg"
                        to="/calendar"
                        aria-expanded="false"
                      >
                        <span className="aside-icon p-2 bg-info-subtle rounded-1">
                          <Icon icon="solar:calendar-add-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Kalendar</span> : ''}
                      </NavLink>
                    </li>

                    <li className="sidebar-item">
                      <NavLink
                        className="sidebar-link success-hover-bg"
                        to="/todo"
                        aria-expanded="false"
                      >
                        <span className="aside-icon p-2 bg-success-subtle rounded-1">
                          <Icon icon="solar:window-frame-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Kanban</span> : ''}
                      </NavLink>
                    </li>

                    <li className="sidebar-item">
                      <NavLink
                        className="sidebar-link secondary-hover-bg"
                        to="/notes"
                        aria-expanded="false"
                      >
                        <span className="aside-icon p-2 bg-secondary-subtle rounded-1">
                          <Icon icon="solar:notification-unread-lines-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Izohlar</span> : ''}
                      </NavLink>
                    </li>

                    <li className="nav-small-cap mt-3">
                      <Icon
                        icon="solar:menu-dots-bold-duotone"
                        className="nav-small-cap-icon fs-5"
                      />
                      {togglebar
                        ? <span className="hide-menu">Maktab sahifalari</span>
                        : <Icon
                          icon="mdi:dots-horizontal"
                          width="28"
                          height="28"
                          style={{ marginLeft: '3px', cursor: 'pointer', color: '#808090' }}
                        />
                      }
                    </li>

                    <li className="sidebar-item">
                      <NavLink
                        to="/teachers"
                        className={`sidebar-link success-hover-bg d-flex align-items-center`}
                      >
                        <span className="aside-icon p-2 bg-success-subtle rounded-1">
                          <Icon icon="solar:lightbulb-bolt-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Ustozlar</span> : ''}
                      </NavLink>
                    </li>

                    <li className="sidebar-item">
                      <NavLink
                        to="/students"
                        className={`sidebar-link danger-hover-bg`}
                      >
                        <span className="aside-icon p-2 bg-danger-subtle rounded-1">
                          <Icon icon="solar:square-academic-cap-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Talabalar</span> : ""}
                      </NavLink>
                    </li>

                    <li className="sidebar-item">
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          setExam(!exam)
                        }}
                        className={`sidebar-link warning-hover-bg ${togglebar ? 'has-arrow' : ""}`}
                        aria-expanded={exam}
                      >
                        <span className="aside-icon p-2 bg-warning-subtle rounded-1">
                          <Icon icon="solar:file-text-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Imtihon</span> : ''}
                      </a>

                      {exam &&
                        <ul className="first-level">
                          <li className="sidebar-item px-lg-13">
                            <Link to="/exam/schedule" className="sidebar-link">
                              <span className="hide-menu">Imtihon jadvali</span>
                            </Link>
                          </li>
                          <li className="sidebar-item px-lg-13">
                            <Link to="/exam/result" className="sidebar-link">
                              <span className="hide-menu">Imtihon natijasi</span>
                            </Link>
                          </li>
                        </ul>
                      }
                    </li>

                    <li className="sidebar-item">
                      <NavLink
                        className="sidebar-link indigo-hover-bg"
                        to="/lessons"
                        aria-expanded="false"
                      >
                        <span className="aside-icon p-2 bg-indigo-subtle rounded-1">
                          <Icon icon="solar:planet-3-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Darslar</span> : ''}
                      </NavLink>
                    </li>

                    <li className="sidebar-item">
                      <NavLink
                        className="sidebar-link info-hover-bg"
                        to="/attendance"
                        aria-expanded="false"
                      >
                        <span className="aside-icon p-2 bg-info-subtle rounded-1">
                          <Icon icon="solar:file-check-line-duotone" className="fs-5" />
                        </span>
                        {togglebar ? <span className="hide-menu ps-1">Davomat</span> : ''}
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {togglebar && <div className="fixed-profile mx-3 mt-3">
        <div className="card bg-primary-subtle mb-0 shadow-none">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={employee?.photo_url || "/user-1.jpg"}
                  width="45"
                  height="45"
                  className="img-fluid rounded-circle"
                  alt="user"
                />
                <div>
                  <h5 className="mb-1">{employee?.first_name}</h5>
                  <p className="mb-0">{employee?.title}</p>
                </div>
              </div>

              <NavLink
                to="/logout"
                style={{
                  color: 'red',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Icon
                  icon="solar:logout-line-duotone"
                  style={{ fontSize: '20px' }}
                />
              </NavLink>

            </div>
          </div>
        </div>
      </div>}
    </aside>
  );
};

export default Menu;