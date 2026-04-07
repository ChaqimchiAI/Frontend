import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import DataTable from "../../components/Ui/DataTable";
import StatusDropdown from "../../components/Ui/StatusFilter";
import { useTheme } from "../../Context/Context";

const mockArchivedGroups = [
  { id: 1, name: "Frontend G1", course_name: "Frontend", status: "Yopilgan", start_date: "2024-01-10", end_date: "2024-09-10", students_count: 15, teacher: "Alisher Aliyev", rating: 4.8 },
  { id: 2, name: "Backend G3", course_name: "Python Backend", status: "To'xtatilgan", start_date: "2024-02-15", end_date: "2024-04-20", students_count: 8, teacher: "Sardor Karimov", rating: 4.2 },
  { id: 3, name: "Dizayn G2", course_name: "UI/UX", status: "Muzlatilgan", start_date: "2024-11-05", end_date: "2025-02-05", students_count: 12, teacher: "Malika opa", rating: 4.9 },
];

const statuses = [
  { key: "all", label: "Hammasi" },
  { key: "Yopilgan", label: "Yopilgan" },
  { key: "To'xtatilgan", label: "To'xtatilgan" },
  { key: "Muzlatilgan", label: "Muzlatilgan" },
];

const ArchiveGroups = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" ? "" : value,
      page: 1
    }));
  };

  const filteredData = mockArchivedGroups.filter(
    (g) => (filters.status === "" || g.status === filters.status) &&
           (filters.search === "" ||
            g.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            g.course_name.toLowerCase().includes(filters.search.toLowerCase()))
  );

  return (
    <div className="card card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Arxiv: Guruhlar</h2>
          <p className="text-muted small mt-1">Yopilgan yoki vaqtincha to'xtatilgan guruhlar tarixi</p>
        </div>
      </div>

      <DataTable
        data={filteredData}
        columns={["№", "Guruh nomi", "Kurs / O'qituvchi", "O'qish davri", "O'quvchilar soni", "Status", "Harakatlar"]}
        onPageChange={(e, v) => setFilters(p => ({ ...p, page: v }))}
        onSearch={(v) => handleFilterChange("search", v)}
        // we map it internally, so we don't pass searchKeys to standard datatable for direct filtering on initial load. Since it is mocked we do pre-filter and pass directly
        filter={
          <StatusDropdown
            statuses={statuses}
            currentItem={
              statuses.find(s => s.key === (filters.status === "" ? "all" : filters.status)) || statuses[0]
            }
            setCurrentItem={(item) =>
              handleFilterChange("status", item.key === "all" ? "" : item.key)
            }
            style={{ width: "160px", padding: "9px" }}
          />
        }
      >
        {(currentData) =>
          currentData.map((group, index) => (
            <tr
              key={group.id}
              className="border-bottom"
              onClick={() => navigate(`/archive/groups/${group.id}`)}
              style={{ cursor: "pointer" }}
            >
              <td className="text-muted">{(filters.page - 1) * filters.limit + index + 1}</td>
              <td>
                <div className="fw-bold">{group.name}</div>
              </td>
              <td>
                <div className="fw-medium">{group.course_name}</div>
                <div className="small text-muted">{group.teacher}</div>
              </td>
              <td className="small">{group.start_date} - {group.end_date}</td>
              <td className="fw-bold">{group.students_count} ta</td>
              <td>
                <span className={`badge ${
                  group.status === "Yopilgan" ? "bg-danger" :
                  group.status === "Muzlatilgan" ? "bg-info" : "bg-warning text-dark"
                } border`}>
                  {group.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-light border"
                  title="Detallar"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/archive/groups/${group.id}`)
                  }}
                >
                  Ko'rish
                </button>
              </td>
            </tr>
          ))
        }
      </DataTable>
    </div>
  );
};

export default ArchiveGroups;
