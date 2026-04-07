import { useState } from "react";
import { useStudentsData } from "../../data/queries/students.queries";
import DataTable from "../../components/Ui/DataTable";
import StatusDropdown from "../../components/Ui/StatusFilter";
import NoteOffcanvas from "../../components/Ui/NoteOffcanvas";
import { useNotification } from "../../Context/NotificationContext";
import { Icon } from "@iconify/react";
import { useTheme } from "../../Context/Context";
import StudentAdd from "./components/StudentAdd";
import { useNavigate } from "react-router-dom";

const statuses = [
  { key: "all", label: "Hammasi" },
  { key: false, label: "To'langan" },
  { key: true, label: "Qarzdor" },
];

const Students = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { setNotif } = useNotification();

  // 1. LocalStorage'dan limitni olish (agar bo'sh bo'lsa 10)
  const [filters, setFilters] = useState({
    page: 1,
    limit: Number(localStorage.getItem("studentLimit")) || 10,
    has_debt: "",
    start_date: "",
    end_date: "",
    search: "",
    is_active: true,
  });

  const { data: students, isLoading, error } = useStudentsData(filters);
  const studentsData = students?.results || [];

  const [showNotes, setShowNotes] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});

  /* --- Handlers --- */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" ? "" : value,
      page: 1
    }));
  };

  // 2. Limit o'zgarganda LocalStorage'ga saqlash funksiyasi
  const handleEntriesChange = (newLimit) => {
    localStorage.setItem("studentLimit", newLimit); // Xotiraga yozish
    setFilters(prev => ({
      ...prev,
      limit: newLimit,
      page: 1
    }));
  };

  const openNotes = (student) => {
    setSelectedStudent(student);
    setShowNotes(true);
  };

  if (error) return <div className="p-4 text-danger">Ma'lumot yuklashda xatolik!</div>;

  return (
    <>
      {isAddModalOpen && (
        <StudentAdd
          open={isAddModalOpen}
          close={setIsAddModalOpen}
          setNotif={setNotif}
        />
      )}

      <div className="card card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-0">O'quvchilar ro'yxati</h2>
            <p className="text-muted small mt-1">Filtrlar yordamida o'quvchilarni tezkor topishingiz mumkin</p>
          </div>
          <button
            className="btn btn-sm gap-2 px-4 py-2"
            style={{ background: "#0085db", color: "#fff" }}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Icon icon="qlementine-icons:plus-16" width="16" height="16" />
            &nbsp;
            Yangi o'quvchi
          </button>
        </div>

        <DataTable
          data={studentsData || []}
          totalCount={students?.count}
          columns={["№", "Talaba", "Telefon", "Balans", "Yaratilgan sana", "Guruh", ""]}
          onPageChange={(e, v) => setFilters(p => ({ ...p, page: v }))}
          // 3. DataTable ichidagi o'zgarishni handlerga ulaymiz
          onEntriesChange={handleEntriesChange}
          onSearch={(v) => handleFilterChange("search", v)}
          searchKeys={["first_name", "last_name", "phone"]}
          filter={
            <StatusDropdown
              statuses={statuses}
              // Agar filters.has_debt bo'sh bo'lsa, "all" kalitli statusni qidiramiz
              currentItem={
                statuses.find(s => s.key === (filters.has_debt === "" ? "all" : filters.has_debt)) || statuses[0]
              }
              setCurrentItem={(item) =>
                // Agar "all" tanlansa, filtrni bo'sh ("") yuboramiz, aks holda o'zini
                handleFilterChange("has_debt", item.key === "all" ? "" : item.key)
              }
              style={{ width: "110px", padding: "9px" }}
            />
          }
        >
          {(currentData) =>
            currentData.map((student, index) => (
              <tr
                key={student.id}
                className="border-bottom"
                onClick={() => navigate(`/students/${student.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td className="text-muted">{(filters.page - 1) * filters.limit + index + 1}</td>
                <td>
                  <div className="fw-bold">
                    {student.first_name} {student.last_name}
                  </div>
                </td>
                <td className="small">{student.phone}</td>
                <td>
                  <span className={`fw-bold ${parseFloat(student.balance) < 0 ? 'text-danger' : 'text-success'}`}>
                    {student.balance} UZS
                  </span>
                </td>
                <td>
                  <span>{
                    student.created_at ?
                      student.created_at.split("T")[0].split("-").reverse().join(".") + " | " + student.created_at.split("T")[1].slice(0, 5)
                      : "-"}
                  </span>
                </td>
                <td>
                  {student.groups?.length > 1 ? (
                    <span className={`badge bg-dark-subtle border border-secondary ${!theme ? "text-white" : "text-black"}`}>
                      {student.groups?.length} ta guruh
                    </span>
                  ) : (
                    <span className={`badge bg-dark-subtle border border-secondary ${!theme ? "text-white" : "text-black"}`}>
                      {student.groups?.map(g => g.group_name).join(", ") || "Guruhsiz"}
                    </span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm"
                    title="Izoh yozish"
                    onClick={(e) => {
                      e.stopPropagation();
                      openNotes(student)
                    }}>
                    <Icon
                      icon="ph:chat-centered-light"
                      width="20"
                      height="20"
                      className={`cursor-pointer ${!theme ? "hover-white" : ""}`}
                    />
                  </button>
                </td>
              </tr>
            ))
          }
        </DataTable>

        <NoteOffcanvas
          show={showNotes}
          handleClose={() => setShowNotes(false)}
          student={selectedStudent}
        />
      </div>
    </>
  );
};

export default Students;