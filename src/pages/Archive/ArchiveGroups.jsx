import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Spinner } from "react-bootstrap";
import DataTable from "../../components/Ui/DataTable";
import { useArchiveGroups } from "../../data/queries/archive.queries";

const tabFilters = [
  { key: "all",      label: "Barchasi",       icon: "solar:archive-bold-duotone" },
  { key: "finished", label: "Tugallangan",     icon: "ph:check-circle-bold" },
  { key: "paused",   label: "To'xtatilgan",   icon: "ph:pause-circle-bold" },
];

const statusConfig = {
  finished: { label: "Tugallangan", bg: "bg-success-subtle", text: "text-success", border: "border-success-subtle", icon: "ph:check-circle" },
  paused:   { label: "To'xtatilgan", bg: "bg-warning-subtle", text: "text-warning", border: "border-warning-subtle", icon: "ph:pause-circle" },
};

const ArchiveGroups = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, limit: 20, status: "", search: "" });

  const handleTabChange = (key) =>
    setFilters(prev => ({ ...prev, status: key === "all" ? "" : key, page: 1 }));

  const handleFilterChange = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value === "all" ? "" : value, page: 1 }));

  const queryParams = {
    ...(filters.search && { search: filters.search }),
    ...(filters.status && { status: filters.status }),
    page: filters.page,
    limit: filters.limit,
  };

  const { data, isLoading, isError } = useArchiveGroups(queryParams);
  const groups     = data?.results ?? [];
  const totalCount = data?.count  ?? 0;
  const pageCount  = Math.ceil(totalCount / filters.limit);
  const activeTab  = filters.status || "all";

  return (
    <div className="card card-body">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center"
          style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #0981c2, #00c8ff)", flexShrink: 0 }}
        >
          <Icon icon="solar:archive-bold-duotone" width="24" color="#fff" />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Arxiv: Guruhlar</h2>
          <p className="text-muted small mb-0">Yopilgan yoki vaqtincha to'xtatilgan guruhlar tarixi</p>
        </div>
        <div className="ms-auto">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
            <Icon icon="solar:archive-bold-duotone" className="me-1" />{totalCount} ta guruh
          </span>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="mb-4 border-bottom">
        <ul className="nav nav-tabs border-0" style={{ gap: "4px" }}>
          {tabFilters.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <li className="nav-item" key={tab.key}>
                <span
                  onClick={() => handleTabChange(tab.key)}
                  className={`nav-link border-0 pb-3 d-flex align-items-center gap-2 fw-medium`}
                  style={{
                    cursor: "pointer",
                    color: isActive ? "#0981c2" : "",
                    borderBottom: isActive ? "3px solid #00c8ff" : "3px solid transparent",
                    borderRadius: 0,
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                  }}
                >
                  <Icon icon={tab.icon} width="16" />
                  {tab.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {isLoading && <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>}
      {isError && <div className="alert alert-danger rounded-3">Ma'lumot yuklanmadi. Internetni tekshiring.</div>}

      {!isLoading && !isError && (
        <DataTable
          data={groups}
          columns={["№", "Guruh", "O'qituvchi", "O'quv davri", "O'quvchilar", "Holati"]}
          onPageChange={(_, v) => setFilters(p => ({ ...p, page: v }))}
          onEntriesChange={(limit) => setFilters(p => ({ ...p, limit, page: 1 }))}
          onSearch={(v) => handleFilterChange("search", v)}
          pageCount={pageCount}
          currentPage={filters.page}
          entries={filters.limit}
          countOptions={[20, 40, 60, 80, 100]}
          totalCount={totalCount}
        >
          {(currentData) =>
            currentData.map((group, index) => {
              const cfg = statusConfig[group.status] || { label: group.status, bg: "bg-secondary-subtle", text: "text-secondary", border: "border-secondary-subtle", icon: "ph:circle" };
              return (
                <tr
                  key={group.id}
                  className="border-bottom"
                  onClick={() => navigate(`/archive/groups/${group.id}`)}
                  style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0, 200, 255, 0.04)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td className="text-muted" style={{ verticalAlign: "middle" }}>
                    {(filters.page - 1) * filters.limit + index + 1}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white"
                        style={{ background: "linear-gradient(45deg, #6f42c1, #a366ff)", width: "40px", height: "40px", flexShrink: 0, fontSize: "15px", fontWeight: "bold" }}
                      >
                        {group.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold">{group.name}</div>
                        <div className="small text-muted d-flex align-items-center gap-1">
                          <Icon icon="simple-line-icons:diamond" width="12" />
                          {group.course_name || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div className="d-flex align-items-center gap-2">
                      <Icon icon="mage:user" width="16" className="text-muted" />
                      <span>{group.teacher_name || "—"}</span>
                    </div>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div className="small d-flex flex-column">
                      <span className="d-flex align-items-center gap-1 text-success">
                        <Icon icon="solar:calendar-add-linear" width="13" />{group.started_date || "—"}
                      </span>
                      <span className="d-flex align-items-center gap-1 text-danger mt-1">
                        <Icon icon="solar:calendar-remove-linear" width="13" />{group.ended_date || "—"}
                      </span>
                    </div>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1">
                      <Icon icon="radix-icons:people" className="me-1" />{group.students_count} ta
                    </span>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <span className={`badge ${cfg.bg} ${cfg.text} border ${cfg.border} rounded-pill px-3 py-2`}>
                      <Icon icon={cfg.icon} className="me-1" />{cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })
          }
        </DataTable>
      )}
    </div>
  );
};

export default ArchiveGroups;
