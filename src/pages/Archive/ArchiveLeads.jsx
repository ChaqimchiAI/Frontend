import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Spinner } from "react-bootstrap";
import DataTable from "../../components/Ui/DataTable";
import { useArchiveLeads } from "../../data/queries/archive.queries";

const tabFilters = [
  { key: "all",        label: "Barchasi",             icon: "solar:users-group-rounded-broken" },
  { key: "lost",       label: "Rad etilgan",           icon: "ph:x-circle-bold" },
  { key: "registered", label: "O'quvchiga aylangan",  icon: "ph:check-circle-bold" },
];

const statusConfig = {
  lost:       { label: "Rad etilgan",         bg: "bg-danger-subtle",  text: "text-danger",  border: "border-danger-subtle",  icon: "ph:x-circle" },
  registered: { label: "O'quvchiga aylangan", bg: "bg-success-subtle", text: "text-success", border: "border-success-subtle", icon: "ph:check-circle" },
};

const courseColors = [
  "linear-gradient(45deg, #0981c2, #00c8ff)",
  "linear-gradient(45deg, #e91e63, #ff6090)",
  "linear-gradient(45deg, #6f42c1, #a366ff)",
  "linear-gradient(45deg, #198754, #56e39f)",
  "linear-gradient(45deg, #fd7e14, #ffc107)",
];

const ArchiveLeads = () => {
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

  const { data, isLoading, isError } = useArchiveLeads(queryParams);
  const leads      = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const pageCount  = Math.ceil(totalCount / filters.limit);
  const activeTab  = filters.status || "all";

  return (
    <div className="card card-body">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center"
          style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #e91e63, #ff6090)", flexShrink: 0 }}
        >
          <Icon icon="solar:users-group-two-rounded-bold-duotone" width="24" color="#fff" />
        </div>
        <div>
          <h2 className="fw-bold mb-0">Arxiv: Lidlar</h2>
          <p className="text-muted small mb-0">Rad etilgan va o'quvchiga aylangan lidlar tarixi</p>
        </div>
        <div className="ms-auto">
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill">
            <Icon icon="solar:users-group-rounded-broken" className="me-1" />{totalCount} ta lid
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
                  className="nav-link border-0 pb-3 d-flex align-items-center gap-2 fw-medium"
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
      {isError && <div className="alert alert-danger rounded-3">Ma'lumot yuklanishida xatolik yuz berdi.</div>}

      {!isLoading && !isError && (
        <DataTable
          data={leads}
          columns={["№", "Mijoz", "Aloqa", "Kurs / Manba", "Holati", "Qo'shilgan"]}
          onPageChange={(_, v) => setFilters(p => ({ ...p, page: v }))}
          onSearch={(v) => handleFilterChange("search", v)}
          pageCount={pageCount}
          currentPage={filters.page}
        >
          {(currentData) =>
            currentData.map((lead, index) => {
              const cfg = statusConfig[lead.status] || { label: lead.status, bg: "bg-secondary-subtle", text: "text-secondary", border: "border-secondary-subtle", icon: "ph:circle" };
              const colorIdx = (lead.id || index) % courseColors.length;
              return (
                <tr
                  key={lead.id}
                  className="border-bottom"
                  style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(233, 30, 99, 0.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td className="text-muted" style={{ verticalAlign: "middle" }}>
                    {(filters.page - 1) * filters.limit + index + 1}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white"
                        style={{ background: courseColors[colorIdx], width: "40px", height: "40px", flexShrink: 0, fontSize: "15px", fontWeight: "bold" }}
                      >
                        {lead.first_name?.charAt(0)}{lead.last_name?.charAt(0) || ""}
                      </div>
                      <div>
                        <div className="fw-bold">{lead.first_name} {lead.last_name || ""}</div>
                        {lead.parent_name && (
                          <div className="small text-muted">{lead.parent_name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div className="d-flex flex-column">
                      <span className="fw-medium font-monospace">{lead.phone}</span>
                    </div>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div>
                      <span className="badge bg-secondary-subtle text-secondary border rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1">
                        <Icon icon="simple-line-icons:diamond" width="10" />{lead.course_name || "—"}
                      </span>
                      {lead.source_name && (
                        <div className="small text-muted mt-1 d-flex align-items-center gap-1">
                          <Icon icon="solar:link-linear" width="12" />{lead.source_name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div>
                      <span className={`badge ${cfg.bg} ${cfg.text} border ${cfg.border} rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1`}>
                        <Icon icon={cfg.icon} width="12" />{cfg.label}
                      </span>
                      {lead.comment && (
                        <div className="small text-muted mt-1" style={{ maxWidth: "160px", whiteSpace: "normal" }}>
                          {lead.comment}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="small text-muted" style={{ verticalAlign: "middle" }}>
                    <div className="d-flex align-items-center gap-1">
                      <Icon icon="solar:calendar-linear" width="13" />
                      {lead.created_at ? lead.created_at.split("T")[0] : "—"}
                    </div>
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

export default ArchiveLeads;
