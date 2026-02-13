import { useState } from "react";
import { useStudentsData } from "../../data/queries/students.queries";
import { useBillingStats } from "../../data/queries/billing.queries";
import DataTable from "../../components/Ui/DataTable";
import CalendarSelector from "../../components/Ui/CalendarSelector";
import StatusDropdown from "../../components/Ui/StatusFilter";
import NoteOffcanvas from "../../components/Ui/NoteOffcanvas";
import Modal from "../../components/Ui/Modal"
import Notification from "../../components/Ui/Notification";
import { Icon } from "@iconify/react";
import { useTheme } from "../../Context/Context";
import StudentAdd from "./components/StudentAdd";
import { useNavigate } from "react-router-dom";

const statuses = [
  { key: "all", label: "Barcha statuslar" },
  { key: "active", label: "Faol o'quvchilar" },
  { key: "inactive", label: "Nofaol o'quvchilar" },
];

const teachers = [
  { key: "all", label: "Barcha o'qituvchilar" },
  { key: "1", label: "Diyorbek Asatullayev" },
  { key: "2", label: "Ali Valiyev" },
];

const studyDays = [
  { key: "all", label: "Barcha kunlar" },
  { key: "odd", label: "Toq kunlar (Du-Cho-Ju)" },
  { key: "even", label: "Juft kunlar (Se-Pay-Sha)" },
];

const Students = () => {

  const navigate = useNavigate();
  const { theme } = useTheme();

  const [isFilterVisible, setIsFilterVisible] = useState(false); // Filtr ko'rinishini boshqarish
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    teacher_id: "",
    study_day: "",
    start_date: "",
    end_date: "",
    search: "",
  });

  const { data: students, isLoading, error } = useStudentsData(filters);
  const studentsData = students?.results || [];
  
  const [notif, setNotif] = useState({ show: false, message: "", type: "" });

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

  const handleDateRange = (range) => {    
    setFilters(prev => ({
      ...prev,
      start_date: range.start || "",
      end_date: range.end || "",
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

      {
        notif.show && (
          <Notification
            message={notif.message}
            type={notif.type}
            onClose={() => setNotif({ ...notif, show: false })}
          />
        )
      }

      {isAddModalOpen && (
        <Modal
          title="Yangi o'quvchi qo'shish"
          close={setIsAddModalOpen}
          anima={isAddModalOpen}
          width="50%"
          zIndex={100}
        >
          <StudentAdd
            close={setIsAddModalOpen}
            setNotif={setNotif}
          />
        </Modal>
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

        <div
          style={{
            maxHeight: isFilterVisible ? "300px" : "0",
            overflow: isFilterVisible ? "visible" : "hidden",
            transition: "all 0.4s ease-in-out",
            opacity: isFilterVisible ? 1 : 0,
          }}
        >
          <div className="d-flex flex-wrap align-items-center gap-2 p-3 border rounded bg-light-subtle">
            <CalendarSelector onRangeSelect={handleDateRange} filters={filters} placeholder="Yaratilgan sana bo'yicha" />

            {/* Status filtri */}
            <StatusDropdown
              statuses={statuses}
              currentItem={statuses.find(s => s.key === (filters.status || "all"))}
              setCurrentItem={(item) => handleFilterChange("status", item.key)}
            />

            {/* O'qituvchi filtri */}
            <StatusDropdown
              statuses={teachers}
              currentItem={teachers.find(t => t.key === (filters.teacher_id || "all"))}
              setCurrentItem={(item) => handleFilterChange("teacher_id", item.key)}
            />

            {/* Juft/Toq kunlar filtri */}
            <StatusDropdown
              statuses={studyDays}
              currentItem={studyDays.find(d => d.key === (filters.study_day || "all"))}
              setCurrentItem={(item) => handleFilterChange("study_day", item.key)}
            />

            {/* Tozalash tugmasi */}
            {(filters.status || filters.teacher_id || filters.study_day || filters.start_date) && (
              <button
                className="btn btn-link text-decoration-none text-danger d-flex align-items-center gap-1"
                onClick={() => setFilters({ page: 1, limit: 10, status: "", teacher_id: "", study_day: "", start_date: "", end_date: "", search: "" })}
              >
                <Icon icon="mdi:filter-off-outline" width="20" />
                Tozalash
              </button>
            )}
          </div>
        </div>

        <DataTable
          data={studentsData || []}
          totalCount={students?.count}
          columns={["№", "Talaba", "Telefon", "Balans", "To'lov sanasi", "Yaratilgan sana", "Guruh", ""]}
          onPageChange={(e, v) => setFilters(p => ({ ...p, page: v }))}
          onEntriesChange={(l) => setFilters(p => ({ ...p, limit: l, page: 1 }))}
          onSearch={(v) => handleFilterChange("search", v)}
          searchKeys={["first_name", "last_name", "phone"]}
          filter={
            <button
              className="btn btn-sm gap-2 px-3 py-2"
              style={{
                background: isFilterVisible ? "#6c757d" : "#0085db",
                color: "#fff",
                transition: "0.3s"
              }}
              onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
              <Icon icon={isFilterVisible ? "lucide:chevron-up" : "lucide:filter"} width="17" height="17" />
              &nbsp;
              {isFilterVisible ? "Filtrni yopish" : "Filtr"}
            </button>
          }
        >
          {(currentData) =>
            currentData.map((student) => (
              <tr key={student.id} className="border-bottom">
                <td className="text-muted">{student.id}</td>
                <td>
                  <div
                    className="fw-bold cursor-pointer"
                    onClick={() => navigate(`/students/${student.id}`)}
                  >
                    {student.first_name} {student.last_name}
                  </div>
                </td>
                <td className="small">{student.phone}</td>
                <td>
                  <span className={`fw-bold ${parseFloat(student.balance) <= 0 ? 'text-danger' : 'text-success'}`}>
                    {student.balance} UZS
                  </span>
                </td>
                <td>
                  <span>
                    {student.payment_date ?
                      student.payment_date?.split("T")[0].split("-").reverse().join(".") + " | " + student.payment_date?.split("T")[1].slice(0, 5)
                      : "-"}
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
                  <span className={`badge bg-dark-subtle border border-secondary ${!theme ? "text-white" : "text-black"}`}>
                    {student.group?.name || "Guruhsiz"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm"
                    title="Izoh yozish"
                    onClick={() => openNotes(student)}>
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