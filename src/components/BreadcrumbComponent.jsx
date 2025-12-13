import React from 'react';
import { NavLink } from 'react-router-dom'; // Agar React Router ishlatayotgan bo'lsangiz
import { IconChevronRight } from '@tabler/icons-react'; // Ixtiyoriy: Divider sifatida ishlatish uchun

const BreadcrumbComponent = ({ currentPage }) => {
  return (
    <div className="mb-3 overflow-hidden position-relative">
      <div className="px-3">
        <h4 className="fs-6 mb-0">{currentPage || "Profile"}</h4>
        
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            
            {/* 1. Home Linki */}
            <li className="breadcrumb-item">
              <NavLink to="/index.html">Home</NavLink>
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