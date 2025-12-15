import React from 'react';
import { NavLink } from 'react-router-dom';

const BreadcrumbComponent = ({ currentPage }) => {
  return (
    <div className="mb-3 overflow-hidden position-relative">
      <div className="px-3">
        <h4 className="fs-6 mb-1">{currentPage || "Profile"}</h4>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">

            {/* 1. Home Linki */}
            <li className="breadcrumb-item">
              <NavLink style={{textDecoration: 'none', color: "#A2B3B2"}} to="/index.html">Boshqaruv paneli</NavLink>
            </li>

            {/* 2. Aktiv Sahifa */}
            <li className="breadcrumb-item active" aria-current="page">
              {currentPage || "Hisob"}
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default BreadcrumbComponent;