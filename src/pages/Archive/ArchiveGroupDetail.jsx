import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Nav, Tab, Spinner, Dropdown } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useTheme } from "../../Context/Context";
import Back from "../../components/Ui/Back";
import { useNotification } from "../../Context/NotificationContext";
import dayjs from "dayjs";

import AttendenceTable from "../Groups/Components/AttendenceTable";
import Schedule from "../Groups/Components/Schedule";
import GroupBillingTable from "../Groups/Components/GroupBillingTable";
import ArchiveAddStudentModal from "./ArchiveAddStudentModal";

import { useArchiveGroup, useArchiveGroupStudents, usePatchArchiveGroupStatus } from "../../data/queries/archive.queries";
import { useGroupFinanceReport } from "../../data/queries/billing.queries";

/* ─────────────────────────────────────────────
   Faqat o'qish uchun o'quvchilar jadvali
   (status dropdown va trash icon yo'q)
───────────────────────────────────────────── */
const ArchiveStudentsTable = ({ students }) => {
  const navigate = useNavigate();

  const statusStyle = (s) => {
    if (s === "active")   return { bg: "#10b981", label: "Faol" };
    if (s === "frozen")   return { bg: "#3b82f6", label: "Muzlatilgan" };
    if (s === "finished") return { bg: "#9ea5ac", label: "Tugatgan" };
    if (s === "left")     return { bg: "#ef4444", label: "Chiqib ketgan" };
    return { bg: "gray", label: "Noma'lum" };
  };

  if (!students?.length) {
    return (
      <p className="text-center text-muted py-4 mt-3">
        Bu guruhda o'quvchilar yo'q yoki ma'lumot yuklanmadi.
      </p>
    );
  }

  return (
    <table className="table table-striped table-hover mt-4 align-middle">
      <thead>
        <tr>
          <th>№</th>
          <th>Ism Familiya</th>
          <th>Telefon</th>
          <th>Qo'shilgan sana</th>
          <th>Holat</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, index) => {
          const st = statusStyle(student?.status);
          return (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td
                className="cursor-pointer text-primary fw-medium"
                onClick={() => navigate(`/archive/students/${student.student_id}`)}
              >
                {student.first_name} {student.last_name}
              </td>
              <td>{student.phone}</td>
              <td>{student.joined_date?.split("-").reverse().join(".")}</td>
              <td>
                <span
                  className="px-3 py-1 rounded-3 text-white fs-6"
                  style={{ background: st.bg, display: "inline-block" }}
                >
                  {st.label}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

/* ─────────────────────────────────────────────
   Asosiy ArchiveGroupDetail sahifasi
───────────────────────────────────────────── */
const ArchiveGroupDetail = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { setNotif } = useNotification();

  const [activeTab, setActiveTab] = useState("students");
  const [financeMonth, setFinanceMonth] = useState(dayjs().format("YYYY-MM"));
  const [showAddStudent, setShowAddStudent] = useState(false);

  const { data: currentGroup, isLoading: groupLoading } = useArchiveGroup(id);
  const { data: studentsData } = useArchiveGroupStudents(id);
  const { data: financeData, isLoading: financeLoading } = useGroupFinanceReport(id, financeMonth);
  const { mutate: patchStatus, isPending: patchingStatus } = usePatchArchiveGroupStatus();

  const handleStatusChange = (newStatus) => {
    patchStatus({ id, status: newStatus }, {
      onSuccess: () => setNotif({ show: true, type: "success", message: "Status o'zgardi" }),
      onError: (err) => setNotif({ show: true, type: "error", message: err?.response?.data?.message || "Xatolik" })
    });
  };

  const schedule_items = currentGroup?.schedule_items;
  const t = schedule_items?.active?.at(-1) || schedule_items?.history?.at(-1);

  const TABS = [
    { key: "students",   label: "O'quvchilar", icon: "radix-icons:people" },
    { key: "attendence", label: "Davomat",      icon: "lucide:clipboard-list" },
    { key: "schedule",   label: "Jadval",       icon: "ion:calendar-outline" },
    { key: "finance",    label: "Moliya",       icon: "solar:wallet-money-bold" },
  ];

  if (groupLoading) {
    return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div>
      <Back go="/archive/groups" />

      {/* Header */}
      <div className="d-flex w-100 justify-content-between align-items-start mb-4">
        <div className="d-flex align-items-start gap-2">
          <span
            style={{ width: "45px", height: "45px", color: "#05c9ff", borderRadius: "8px", background: "#00a0ea25", flexShrink: 0 }}
            className="d-flex align-items-center justify-content-center"
          >
            <Icon icon="famicons:book-outline" width="25" height="25" />
          </span>
          <div>
            <h3 className="lh-1 d-flex align-items-center gap-3 mb-1">
              {currentGroup?.name}
              
              <Dropdown>
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  size="sm" 
                  className="d-flex align-items-center gap-2"
                  disabled={patchingStatus}
                >
                  {patchingStatus && <Spinner animation="border" size="sm" />}
                  {currentGroup?.status === "finished" ? "Tugallangan" : currentGroup?.status === "paused" ? "To'xtatilgan" : currentGroup?.status}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleStatusChange("active")}>Faol (Arxivdan chiqarish)</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange("paused")}>To'xtatilgan</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleStatusChange("finished")}>Tugallangan</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </h3>
            <span className="text-muted small">Arxivlangan guruh ko'rinishi</span>
          </div>
        </div>
        
        {/* Qo'shish */}
        <div>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowAddStudent(true)}>
            <Icon icon="lucide:user-plus" width="18" /> O'quvchi qo'shish
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="d-flex pt-2 pb-4 justify-content-between align-items-center gap-3">
        <div className="card card-hover px-4 border py-4" style={{ width: "25%" }}>
          <span className="fs-6 text-muted">
            <Icon icon="mage:user" width="18" className="me-1" /> O'qituvchi
          </span>
          <h6 className="fs-5 mt-2 text-capitalize mb-0">
            {t ? `${t.teacher.first_name} ${t.teacher.last_name}` : "—"}
          </h6>
        </div>
        <div className="card card-hover px-4 border py-4" style={{ width: "25%" }}>
          <span className="fs-6 text-muted">
            <Icon icon="radix-icons:people" width="18" className="me-1" /> O'quvchilar
          </span>
          <h6 className="fs-5 mt-2 mb-0">{currentGroup?.students_count ?? "—"} ta</h6>
        </div>
        <div className="card card-hover px-4 border py-4" style={{ width: "25%" }}>
          <span className="fs-6 text-muted">
            <Icon icon="lucide:calendar" width="18" className="me-1" /> Davomiylik
          </span>
          <h6 className="fs-6 mt-2 mb-0">
            {currentGroup?.started_date || "—"} | {currentGroup?.ended_date || "—"}
          </h6>
        </div>
        <div className="card card-hover px-4 border py-4" style={{ width: "25%" }}>
          <span className="fs-6 text-muted">
            <Icon icon="simple-line-icons:diamond" width="16" className="me-1" /> Kurs
          </span>
          <h6 className="fs-5 mt-2 mb-0">{currentGroup?.course_name || "—"}</h6>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <div
          style={{ padding: "8px", background: theme ? "#f1f1f1" : "#111c2d", borderRadius: "8px", width: "fit-content" }}
          className="mb-3"
        >
          <Nav variant="pills" className="gap-1">
            {TABS.map(({ key, label, icon }) => (
              <Nav.Item key={key}>
                <Nav.Link
                  eventKey={key}
                  style={{
                    cursor: "pointer",
                    background: activeTab === key && !theme ? "#15263a"
                              : activeTab === key && theme  ? "#fff"
                              : "transparent",
                    color: activeTab === key && !theme ? "#fff"
                          : theme ? "#000"
                          : "#fff",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  <Icon icon={icon} width="15" height="15" className="me-2" />
                  {label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        <Tab.Content>
          {/* O'quvchilar */}
          <Tab.Pane eventKey="students">
            <Card>
              <Card.Body>
                <h5 className="fs-4 fw-medium">
                  <Icon icon="radix-icons:people" width="20" color="#00c8ff" className="me-2" />
                  O'quvchilar ro'yxati
                </h5>
                <ArchiveStudentsTable students={studentsData} />
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Davomat */}
          <Tab.Pane eventKey="attendence">
            <Card>
              <Card.Body>
                <h5 className="fs-4 fw-medium mb-3">
                  <Icon icon="lucide:clipboard-list" width="20" color="#00c8ff" className="me-2" />
                  Davomat jadvali
                </h5>
                <AttendenceTable
                  setNotif={setNotif}
                  studentsData={studentsData}
                  schedule_items={schedule_items?.active}
                />
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Jadval */}
          <Tab.Pane eventKey="schedule">
            <Card>
              <Card.Body>
                <h5 className="fs-4 fw-medium mb-3">
                  <Icon icon="ion:calendar-outline" width="20" color="#00c8ff" className="me-2" />
                  Dars jadvali
                </h5>
                <Schedule schedule_items={schedule_items} setChange_items={() => {}} />
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Moliya */}
          <Tab.Pane eventKey="finance">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fs-4 fw-medium mb-0">
                    <Icon icon="solar:bill-list-bold" width="20" color="#00c8ff" className="me-2" />
                    Guruh billing hisoboti
                  </h5>
                  <div className="d-flex gap-2 align-items-center">
                    <span className="small opacity-75">Hisob oyi:</span>
                    <input
                      type="month"
                      className={`form-control form-control-sm ${!theme ? "bg-dark text-white border-secondary" : ""}`}
                      value={financeMonth}
                      onChange={(e) => setFinanceMonth(e.target.value)}
                      style={{ width: "160px", borderRadius: "8px" }}
                    />
                  </div>
                </div>
                {financeLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <GroupBillingTable financeData={financeData} theme={theme} />
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {showAddStudent && (
        <ArchiveAddStudentModal 
           showModal={showAddStudent} 
           setShowModal={setShowAddStudent}
           setNotif={setNotif}
           groupId={id}
        />
      )}
    </div>
  );
};

export default ArchiveGroupDetail;
