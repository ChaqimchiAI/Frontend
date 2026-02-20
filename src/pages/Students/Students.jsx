import { useState } from "react";
import { useStudentsData } from "../../data/queries/students.queries";
import DataTable from "../../components/Ui/DataTable";
import StatusDropdown from "../../components/Ui/StatusFilter";
import NoteOffcanvas from "../../components/Ui/NoteOffcanvas";
import Notification from "../../components/Ui/Notification";
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

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    has_debt: false,
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
          onEntriesChange={(l) => setFilters(p => ({ ...p, limit: l, page: 1 }))}
          onSearch={(v) => handleFilterChange("search", v)}
          searchKeys={["first_name", "last_name", "phone"]}
          filter={
            <StatusDropdown
              statuses={statuses}
              currentItem={statuses.find(s => s.key === (filters.has_debt === "" ? "all" : filters.has_debt))}
              setCurrentItem={(item) => handleFilterChange("has_debt", item.key)}
              style={{ width: "110px" }}
            />
          }
        >
          {(currentData) =>
            currentData.map((student, index) => (
              <tr
                key={student.id}
                className="border-bottom"
                onClick={() => navigate(`/students/${student.id}`)}
              >
                <td className="text-muted">{index + 1}</td>
                <td>
                  <div
                    className="fw-bold cursor-pointer"
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
                  <span>{
                    student.created_at ?
                      student.created_at.split("T")[0].split("-").reverse().join(".") + " | " + student.created_at.split("T")[1].slice(0, 5)
                      : "-"}
                  </span>
                </td>
                <td>
                  {student.groups?.length > 1 ? (
                    <span className={`badge bg-dark-subtle border border-secondary ${!theme ? "text-white" : "text-black"}`}>
                      {student.groups?.length || "Guruhsiz"}
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