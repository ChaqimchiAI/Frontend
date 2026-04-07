import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import DataTable from "../../components/Ui/DataTable";
import { Icon } from "@iconify/react";
import StatusDropdown from "../../components/Ui/StatusFilter";
import { useArchiveStudents } from "../../data/queries/archive.queries";
import StudentGroupsModal from "./Components/StudentGroupsModal";

const tabList = [
  { key: "all",      label: "Barchasi",       icon: "solar:users-group-rounded-broken",         color: "primary" },
  { key: "left",     label: "Tark etganlar",  icon: "material-symbols:door-open-outline",        color: "danger"  },
  { key: "frozen",   label: "Muzlatilganlar", icon: "material-symbols:ac-unit",                  color: "warning" },
  { key: "finished", label: "Tugallanganlar", icon: "material-symbols:check-circle-outline",     color: "success" },
  { key: "no_group", label: "Guruhsiz",       icon: "solar:user-minus-rounded-broken",           color: "secondary" },
];

const colorMap = {
  primary:   { bg: "#e8f4ff", border: "#b6d9ff", text: "#0981c2",  activeBg: "#0981c2",  activeText: "#fff" },
  danger:    { bg: "#fff0f0", border: "#ffc0c0", text: "#c0392b",  activeBg: "#c0392b",  activeText: "#fff" },
  warning:   { bg: "#fff8e6", border: "#ffe4a0", text: "#9a6200",  activeBg: "#e6a817",  activeText: "#fff" },
  success:   { bg: "#edfff4", border: "#b4f0cb", text: "#1a7a42",  activeBg: "#198754",  activeText: "#fff" },
  secondary: { bg: "#f3f4f6", border: "#d1d5db", text: "#4b5563",  activeBg: "#4b5563",  activeText: "#fff" },
};

const ArchiveStudents = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ page: 1, limit: 20, is_active: "", search: "" });
  const [modalStudentId, setModalStudentId] = useState(null);
  const activeTab = filters.group_status || "all";

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" ? "" : value,
      page: 1
    }));
  };

  const handleTabChange = (key) => {
    setFilters(prev => ({ ...prev, group_status: key === "all" ? "" : key, page: 1 }));
  };

  const queryParams = {
    ...(filters.search    && { search: filters.search }),
    ...(filters.is_active && { is_active: filters.is_active }),
    ...(filters.group_status && { group_status: filters.group_status }),
    page: filters.page,
    limit: filters.limit,
  };

  const { data, isLoading, isError } = useArchiveStudents(queryParams);

  const students   = data?.results ?? [];
  const totalCount = data?.count  ?? 0;
  const pageCount  = Math.ceil(totalCount / filters.limit);

  return (
    <div className="card card-body">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center"
          style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #0981c2, #00c8ff)", flexShrink: 0 }}
        >
          <Icon icon="solar:users-group-rounded-bold-duotone" width="24" color="#fff" />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Arxiv: O'quvchilar</h2>
          <p className="text-muted small mb-0">Markazni tark etgan, bitirgan yoki muzlatilgan o'quvchilar</p>
        </div>
        <div className="ms-auto">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
            <Icon icon="solar:users-group-rounded-broken" className="me-1" />{totalCount} ta o'quvchi
          </span>
        </div>
      </div>

      {/* Pill Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {tabList.map((tab) => {
          const c = colorMap[tab.color];
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="btn d-flex align-items-center gap-2 fw-medium"
              style={{
                background:   isActive ? c.activeBg : c.bg,
                color:        isActive ? c.activeText : c.text,
                border:       `1.5px solid ${isActive ? c.activeBg : c.border}`,
                borderRadius: "50px",
                fontSize:     "13px",
                padding:      "6px 16px",
                transition:   "all 0.2s ease",
                boxShadow:    isActive ? `0 2px 8px ${c.activeBg}55` : "none",
              }}
            >
              <Icon icon={tab.icon} width="16" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading && <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>}
      
      {isError && <div className="alert alert-danger">Ma'lumot yuklanishida xatolik yuz berdi.</div>}

      {!isLoading && !isError && (
        <DataTable
          data={students}
          columns={["№", "O'quvchi / Filial", "Aloqa", "Guruhlar statistikasi", "Balans", "Holati"]}
          onPageChange={(_, v) => setFilters(p => ({ ...p, page: v }))}
          onSearch={(v) => handleFilterChange("search", v)}
          pageCount={pageCount}
          currentPage={filters.page}
        >
          {(currentData) =>
            currentData.map((student, index) => (
              <tr
                key={student.id}
                className="border-bottom"
                onClick={() => navigate(`/archive/students/${student.id}`)}
                style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 200, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td className="text-muted" style={{ verticalAlign: 'middle' }}>{(filters.page - 1) * filters.limit + index + 1}</td>
                <td style={{ verticalAlign: 'middle' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                         style={{ background: "linear-gradient(45deg, #0981c2, #00c8ff)", width: "42px", height: "42px", flexShrink: 0, fontSize: "16px", fontWeight: "bold" }}>
                      {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                    </div>
                    <div>
                      <div className="fw-bold fs-6">{student.first_name} {student.last_name}</div>
                      <div className="small text-muted d-flex align-items-center gap-1">
                        <Icon icon="fluent:building-24-regular" width="14" />
                        {student.branch_name || "—"}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <div className="d-flex flex-column">
                    <span className="fw-medium font-monospace">{student.phone}</span>
                    <span className="small text-muted d-flex align-items-center gap-1" title="Qo'shilgan sana">
                      <Icon icon="solar:calendar-linear" width="14" />
                      {student.created_at ? student.created_at.split("T")[0] : "—"}
                    </span>
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <div 
                    className="d-flex flex-wrap gap-2" 
                    onClick={(e) => { e.stopPropagation(); setModalStudentId(student.id); }}
                    style={{ cursor: 'pointer' }}
                  >
                    {student.active_groups_count > 0 && <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill hover-scale"><Icon icon="ph:student" className="me-1"/> Faol: {student.active_groups_count}</span>}
                    {student.finished_groups_count > 0 && <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill hover-scale"><Icon icon="ph:check-circle" className="me-1"/> Bitirgan: {student.finished_groups_count}</span>}
                    {student.frozen_groups_count > 0 && <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 rounded-pill hover-scale"><Icon icon="ph:snowflake" className="me-1"/> Muzlatgan: {student.frozen_groups_count}</span>}
                    {student.left_groups_count > 0 && <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill hover-scale"><Icon icon="ph:door-open" className="me-1"/> Tark etgan: {student.left_groups_count}</span>}
                    {(student.active_groups_count === 0 && student.finished_groups_count === 0 && student.frozen_groups_count === 0 && student.left_groups_count === 0) && <span className="text-muted small">—</span>}
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  {student.balance < 0 ? (
                    <span className="text-danger fw-bold d-flex align-items-center gap-1"><Icon icon="solar:wallet-money-broken" width="18"/> {Number(student.balance).toLocaleString()} UZS</span>
                  ) : student.balance > 0 ? (
                    <span className="text-success fw-bold d-flex align-items-center gap-1"><Icon icon="solar:wallet-money-broken" width="18"/> +{Number(student.balance).toLocaleString()} UZS</span>
                  ) : (
                    <span className="text-muted fw-bold d-flex align-items-center gap-1"><Icon icon="solar:wallet-money-broken" width="18"/> 0 UZS</span>
                  )}
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <span className={`badge ${student.is_active ? "bg-success" : "bg-danger"} rounded-pill px-3 py-2 border`}>
                    {student.is_active ? "Faol" : "Nofaol"}
                  </span>
                </td>
              </tr>
            ))
          }
        </DataTable>
      )}

      {/* Guruhlarni ko'rsatuvchi modal */}
      <StudentGroupsModal 
        show={!!modalStudentId} 
        onHide={() => setModalStudentId(null)} 
        studentId={modalStudentId} 
      />
    </div>
  );
};

export default ArchiveStudents;
