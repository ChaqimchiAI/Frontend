import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { IconX } from "@tabler/icons-react";
import "./Menu.css";
import { useState } from "react";


const Menu = ({ employee, toggleTheme, togglebar, setMedia }) => {
  const [menegment, setMenegment] = useState(false)
  const [mouseMove, setMouseMove] = useState(false)
  const navigate = useNavigate();

  return (
    <aside
      id="aside-menu-toggle"
      className={`left-sidebar with-vertical ${!togglebar ? "sidebar-hover" : ""} d-flex flex-column justify-content-between pb-3`}
      onMouseMove={() => setMouseMove(true)}
      onMouseLeave={() => {
        setMouseMove(false);
        if (!togglebar) setMenegment(false);
      }}
    >
      <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <Link className="text-nowrap logo-img" to="/">
            {togglebar || mouseMove ? toggleTheme ? <img
              src="/logo-light.svg"
              className="dark-logo"
              alt="Logo-Dark"
              width={180}
              style={{ display: "flex" }}
            /> : <img
              src="/logo-dark.svg"
              className="light-logo"
              width={180}
              alt="Logo-light"
              style={{ display: "flex" }}
            /> : <img src="/favicon.png"
              className="index-mini-logo"
              alt="Logo-light"
              width={180}
              style={{ display: "flex" }} />}
          </Link>
          <span
            id="mobile-close-sidebar"
            className="sidebartoggler ms-auto text-decoration-none fs-5"
          >
            <IconX className="menu-xmark" onClick={() => setMedia(false)} size={20} />
          </span>
        </div>

        <div className="scroll-sidebar simplebar-scrollable-y" data-simplebar="init" style={{ flex: "1 1 auto", height: "100%", overflow: "hidden" }}>
          <div className="simplebar-wrapper" style={{ margin: "0px -16px", height: "100%" }}>
            <div className="simplebar-mask" style={{ position: "absolute", inset: 0 }}>
              <div
                className="simplebar-content-wrapper"
                role="region"
                aria-label="scrollable content"
                style={{ height: "100%", overflow: "hidden scroll" }}
              >
                <div className="simplebar-content" style={{ padding: "0px 16px" }}>
                  <nav className="sidebar-nav">
                    <ul id="sidebarnav">

                      <li className="sidebar-item">
                        <NavLink
                          className="sidebar-link primary-hover-bg"
                          to="/"
                          aria-expanded="false"
                        >
                          <span className="aside-icon p-2 bg-primary-subtle rounded-1">
                            <Icon icon="solar:screencast-2-line-duotone" className="fs-5" />
                          </span>
                          {togglebar || mouseMove ? <span className="hide-menu ps-1">Dashboard</span> : ''}
                        </NavLink>
                      </li>

                      <li className="sidebar-item">
                        <NavLink
                          to="/groups"
                          className={`sidebar-link info-hover-bg`}
                        >
                          <span className="aside-icon p-2 bg-info-subtle rounded-1">
                            <Icon icon="mingcute:group-2-line" className="fs-6" />
                          </span>
                          {togglebar || mouseMove ? <span className="hide-menu ps-1">Guruhlar</span> : ""}
                        </NavLink>
                      </li>

                      <li className="sidebar-item">
                        <NavLink
                          to="/students"
                          className={`sidebar-link danger-hover-bg`}
                        >
                          <span className="aside-icon p-2 bg-danger-subtle rounded-1">
                            <Icon icon="solar:square-academic-cap-line-duotone" className="fs-6" />
                          </span>
                          {togglebar || mouseMove ? <span className="hide-menu ps-1">O'quvchilar</span> : ""}
                        </NavLink>
                      </li>

                      <li className="sidebar-item">
                        <NavLink
                          to="/debtors"
                          className={`sidebar-link danger-hover-bg`}
                        >
                          <span className="aside-icon p-2 bg-danger-subtle rounded-1">
                            <Icon icon="ph:warning-duotone" className="fs-6" />
                          </span>
                          {togglebar || mouseMove ? <span className="hide-menu ps-1">Qarzdorlar</span> : ""}
                        </NavLink>
                      </li>

                      <li className="sidebar-item">
                        <NavLink
                          to="/leads"
                          className={`sidebar-link warning-hover-bg`}
                        >
                          <span className="aside-icon p-2 bg-warning-subtle rounded-1">
                            <Icon icon="mdi:user-plus-outline" className="fs-6" />
                          </span>
                          {togglebar || mouseMove ? <span className="hide-menu ps-1">Leads</span> : ""}
                        </NavLink>
                      </li>

                      <li className="sidebar-item">
                        <NavLink
                          className="sidebar-link indigo-hover-bg"
                          to="/statistics"
                          aria-expanded="false"
                        >
                          <span className="aside-icon p-2 bg-indigo-subtle rounded-1">
                            <Icon icon="solar:chart-2-bold-duotone" className="fs-6" />
                          </span>
                          {togglebar || mouseMove ? <span className="hide-menu ps-1">Statistika</span> : ''}
                        </NavLink>
                      </li>

                      <li className="sidebar-item">
                        <NavLink
                          className="sidebar-link success-hover-bg"
                          to="/attendance"
                          aria-expanded="false"
                        >
                          <span className="aside-icon p-2 bg-info-subtle rounded-1">
                            <Icon icon="solar:file-check-line-duotone" className="fs-6" />
                          </span>
                          {togglebar || mouseMove ? <span className="hide-menu ps-1">Davomat</span> : ''}
                        </NavLink>
                      </li>

                      <li className="sidebar-item">
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            setMenegment(!menegment)
                          }}
                          className={`sidebar-link warning-hover-bg ${togglebar || mouseMove || menegment ? 'has-arrow' : ""}`}
                          aria-expanded={menegment}
                        >
                          <span className="aside-icon p-2 bg-warning-subtle rounded-1">
                            <Icon icon="lucide:layout-dashboard" className="fs-6" />
                          </span>
                          {togglebar || mouseMove ? <span className="hide-menu ps-1">Boshqaruv</span> : ''}
                        </span>

                        {menegment && (
                          <ul>
                            <li className="sidebar-item px-lg-13">
                              <Link to="/teachers" className="sidebar-link">
                                <span className="hide-menu">Ustozlar</span>
                              </Link>
                            </li>
                            <li className="sidebar-item px-lg-13">
                              <Link to="/rooms" className="sidebar-link">
                                <span className="hide-menu">Xonalar</span>
                              </Link>
                            </li>
                            <li className="sidebar-item px-lg-13">
                              <Link to="/courses" className="sidebar-link">
                                <span className="hide-menu">Kurslar</span>
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {togglebar || mouseMove ? <div className="fixed-profile mx-3">
        <div className="card bg-primary-subtle mb-0 shadow-none">
          <div className="card-body py-3 px-2">
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div
                className="d-flex align-items-center gap-3 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <img
                  src={employee?.photo_url || "/user-1.jpg"}
                  style={{ borderRadius: "100%", width: "50px", height: "50px", objectFit: "cover" }}
                  alt="user"
                />
                <div>
                  <h5 className="mb-1">{employee?.first_name}</h5>
                  <p className="mb-0 text-capitalize">{employee?.role}</p>
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
                onClick={(e) => e.stopPropagation()}
              >
                <Icon
                  icon="solar:logout-line-duotone"
                  width={30}
                  height={30}
                />
              </NavLink>

            </div>
          </div>
        </div>
      </div> : ""}
    </aside>
  );
};

export default Menu;