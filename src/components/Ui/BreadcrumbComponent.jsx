import { Icon } from '@iconify/react';
import { NavLink, useNavigate } from 'react-router-dom'; // Agar React Router ishlatayotgan bo'lsangiz

const BreadcrumbComponent = ({ currentPage }) => {

  const navigate = useNavigate()

  return (
    <div className="mb-3 overflow-hidden position-relative">
      <div className="Bread px-3 w-30">
        <div className="d-flex align-content-center">
          <h4 className="fs-6">{currentPage || "Profile"}</h4>

          {/* Oldingi sahifaga qaytish */}
          <button
            className="button-hover btn btn-sm btn-link text-decoration-none d-flex justify-content-center align-content-center gap-1 fs-2"
            onClick={() => navigate(-1)}
          >
            <Icon icon="lets-icons:back" width="17" height="17" />
            <span>
              Orqaga
            </span>
          </button>
        </div>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">

            {/* 1. Home Linki */}
            <li className="breadcrumb-item">
              <NavLink to="/">Home</NavLink>
            </li>

            {/* 2. Aktiv Sahifa */}
            <li className="breadcrumb-item active" aria-current="page">
              {currentPage || "Profile"}
            </li>

          </ol>
        </nav>
      </div>
    </div>
  );
};

export default BreadcrumbComponent;