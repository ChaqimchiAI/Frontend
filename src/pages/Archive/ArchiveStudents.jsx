import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import DataTable from "../../components/Ui/DataTable";
import { Icon } from "@iconify/react";
import StatusDropdown from "../../components/Ui/StatusFilter";
import { useArchiveStudents } from "../../data/queries/archive.queries";
import StudentGroupsModal from "./Components/StudentGroupsModal";

const statuses = [
  { key: "all",   label: "Barchasi" },
  { key: "true",  label: "Faol" },
  { key: "false", label: "Nofaol" },
];

const ArchiveStudents = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ page: 1, limit: 20, is_active: "false", search: "" });
  const [modalStudentId, setModalStudentId] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" ? "" : value,
      page: 1
    }));
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Arxiv: O'quvchilar</h2>
          <p className="text-muted small mt-1">Markazni tark etgan yoki bitirgan o'quvchilar tarixi</p>
        </div>
      </div>

      <div className="mb-4 border-bottom">
        <ul className="nav nav-tabs border-0" style={{ gap: "20px" }}>
          {[
            { key: "all", label: "Barchasi", icon: "radix-icons:people" },
            { key: "left", label: "Tark etganlar", icon: "material-symbols:door-open-outline" },
            { key: "frozen", label: "Muzlatilganlar", icon: "material-symbols:ac-unit" },
            { key: "finished", label: "Tugallanganlar", icon: "material-symbols:check-circle-outline" },
          ].map((tab) => (
            <li className="nav-item" key={tab.key} style={{ cursor: "pointer" }}>
              <span
                className={`nav-link border-0 pb-3 fs-6 d-flex align-items-center gap-2 ${
                  (filters.group_status || "all") === tab.key ? "text-primary fw-bold" : "text-muted"
                }`}
                style={{
                  borderBottom: (filters.group_status || "all") === tab.key ? "3px solid #00c8ff !important" : "3px solid transparent !important",
                  borderRadius: 0,
                  transition: "all 0.3s ease"
                }}
                onClick={() => handleFilterChange("group_status", tab.key)}
              >
                <Icon icon={tab.icon} width="18" />
                {tab.label}
              </span>
            </li>
          ))}
        </ul>
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
          filter={
            <StatusDropdown
              statuses={statuses}
              currentItem={statuses.find(s => s.key === (filters.is_active === "" ? "all" : filters.is_active)) || statuses[0]}
              setCurrentItem={(item) => handleFilterChange("is_active", item.key)}
              style={{ width: "160px", padding: "9px" }}
            />
          }
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
