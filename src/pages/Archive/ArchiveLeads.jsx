import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import DataTable from "../../components/Ui/DataTable";
import StatusDropdown from "../../components/Ui/StatusFilter";
import { useTheme } from "../../Context/Context";

const mockArchivedLeads = [
  { id: 1, full_name: "Tohir Usmonov", phone: "+998 90 444 33 22", course: "Frontend", status: "Rad etilgan", reason: "Qimmatlik qildi", created_at: "2025-01-10" },
  { id: 2, full_name: "Dildora Qosimova", phone: "+998 94 555 44 33", course: "UI/UX", status: "Rad etilgan", reason: "Boshqa joyga ketdi", created_at: "2024-11-20" },
  { id: 3, full_name: "Olim Olimov", phone: "+998 99 111 22 33", course: "Backend", status: "Rad etilgan", reason: "Telefonni ko'tarmadi", created_at: "2024-12-05" },
];

const statuses = [
  { key: "all", label: "Barcha sabablar" },
  { key: "Qimmatlik qildi", label: "Qimmatlik qildi" },
  { key: "Boshqa joyga ketdi", label: "Boshqa joyga ketdi" },
  { key: "Telefonni ko'tarmadi", label: "Telefonni ko'tarmadi" },
];

const ArchiveLeads = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    reason: "",
    search: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" ? "" : value,
      page: 1
    }));
  };

  const filteredData = mockArchivedLeads.filter(
    (l) => (filters.reason === "" || l.reason === filters.reason) &&
           (filters.search === "" ||
            l.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            l.phone.includes(filters.search))
  );

  return (
    <div className="card card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Arxiv: Lidlar</h2>
          <p className="text-muted small mt-1">Rad etilgan lidlar va ularning sabablari</p>
        </div>
        <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 px-3">
          <Icon icon="solar:trash-bin-trash-bold" width="16" /> Avto-tozalash (3+ yil)
        </button>
      </div>

      <DataTable
        data={filteredData}
        columns={["№", "Mijoz", "Aloqa", "Qiziqish", "Rad etish sababi", "Qo'shilgan sana"]}
        onPageChange={(e, v) => setFilters(p => ({ ...p, page: v }))}
        onSearch={(v) => handleFilterChange("search", v)}
        filter={
          <StatusDropdown
            statuses={statuses}
            currentItem={
              statuses.find(s => s.key === (filters.reason === "" ? "all" : filters.reason)) || statuses[0]
            }
            setCurrentItem={(item) =>
              handleFilterChange("reason", item.key === "all" ? "" : item.key)
            }
            style={{ width: "220px", padding: "9px" }}
          />
        }
      >
        {(currentData) =>
          currentData.map((lead, index) => (
            <tr
              key={lead.id}
              className="border-bottom"
              onClick={() => navigate(`/archive/leads/${lead.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td className="text-muted">{(filters.page - 1) * filters.limit + index + 1}</td>
              <td>
                <div className="fw-bold">{lead.full_name}</div>
              </td>
              <td className="small">{lead.phone}</td>
              <td>
                <span className="badge bg-secondary text-white border">{lead.course}</span>
              </td>
              <td>
                <span className={`badge ${
                  lead.reason === "Qimmatlik qildi" ? "bg-warning text-dark" :
                  lead.reason === "Boshqa joyga ketdi" ? "bg-danger text-white" : "bg-info text-dark"
                } border`}>
                  {lead.reason}
                </span>
              </td>
              <td>
                <span className="small text-muted">{lead.created_at}</span>
              </td>
            </tr>
          ))
        }
      </DataTable>
    </div>
  );
};

export default ArchiveLeads;
