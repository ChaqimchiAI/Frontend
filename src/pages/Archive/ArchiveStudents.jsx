import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import DataTable from "../../components/Ui/DataTable";
import StatusDropdown from "../../components/Ui/StatusFilter";
import { useTheme } from "../../Context/Context";

const mockArchivedStudents = [
  { id: 1, full_name: "Azizbek O'lmasov", phone: "+998 90 123 45 67", group: "Frontend G1", reason: "Bitirgan", date: "2025-09-10", attendance: 95, debt: 0 },
  { id: 2, full_name: "Shahnoza Valieva", phone: "+998 93 123 45 67", group: "Backend G3", reason: "Ketib qolgan", date: "2025-04-10", attendance: 40, debt: 150000 },
  { id: 3, full_name: "Umidjon Qodirov", phone: "+998 99 123 45 67", group: "Dizayn G2", reason: "Mablag' yetishmovchiligi", date: "2025-01-20", attendance: 60, debt: 0 },
  { id: 4, full_name: "Malika Askarova", phone: "+998 88 567 89 01", group: "SMM G5", reason: "Bitirgan", date: "2024-12-15", attendance: 100, debt: 0 },
];

const statuses = [
  { key: "all", label: "Barcha sabablar" },
  { key: "Bitirgan", label: "Bitirgan" },
  { key: "Ketib qolgan", label: "Ketib qolgan" },
  { key: "Mablag' yetishmovchiligi", label: "Mablag' yetishmovchiligi" },
];

const ArchiveStudents = () => {
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

  const filteredData = mockArchivedStudents.filter(
    (s) => (filters.reason === "" || s.reason === filters.reason) &&
           (filters.search === "" ||
            s.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
            s.group.toLowerCase().includes(filters.search.toLowerCase()) ||
            s.phone.includes(filters.search))
  );

  return (
    <div className="card card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Arxiv: O'quvchilar</h2>
          <p className="text-muted small mt-1">Markazni tark etgan yoki bitirgan o'quvchilar tarixi</p>
        </div>
      </div>

      <DataTable
        data={filteredData}
        columns={["№", "O'quvchi", "Aloqa", "Oxirgi darsi", "Davomat", "Qarzdorlik", "Sabab & Sana"]}
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
          currentData.map((student, index) => (
            <tr
              key={student.id}
              className="border-bottom"
              onClick={() => navigate(`/archive/students/${student.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td className="text-muted">{(filters.page - 1) * filters.limit + index + 1}</td>
              <td>
                <div className="fw-bold">{student.full_name}</div>
              </td>
              <td className="small">{student.phone}</td>
              <td>
                <div className="fw-medium">{student.group}</div>
              </td>
              <td>
                <span className={`fw-bold ${student.attendance >= 80 ? 'text-success' : student.attendance >= 50 ? 'text-warning' : 'text-danger'}`}>
                   {student.attendance}%
                </span>
              </td>
              <td>
                {student.debt > 0 ? (
                  <span className="text-danger fw-bold">{student.debt} UZS</span>
                ) : (
                  <span className="text-success fw-bold">Yo'q</span>
                )}
              </td>
              <td>
                <span className={`badge ${
                  student.reason === "Bitirgan" ? "bg-success" :
                  student.reason === "Ketib qolgan" ? "bg-danger" : "bg-warning text-dark"
                } border d-block mb-1`} style={{ width: 'fit-content' }}>
                  {student.reason}
                </span>
                <span className="small text-muted">{student.date}</span>
              </td>
            </tr>
          ))
        }
      </DataTable>
    </div>
  );
};

export default ArchiveStudents;
