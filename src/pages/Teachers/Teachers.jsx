import { useState, useEffect } from "react";
import { Spinner, Card, Row, Col, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useTeachersDataFullInfo } from "../../data/queries/teachers.queries";
import { useTheme } from "../../Context/Context";
import DataTable from "../../components/Ui/DataTable";
import Notification from "../../components/Ui/Notification";
import { useNavigate } from "react-router-dom";
import TeacherModal from "./modals/TeacherModal";

const Teachers = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = !theme;
  const { data: teachers, isLoading: gettingTeachersData } = useTeachersDataFullInfo();
  const [newTeacher, setNewTeacher] = useState(false);
  const [notif, setNotif] = useState({ show: false, type: "", message: "" })

  const teachersData = teachers?.results || [];
  const [viewMode, setViewMode] = useState("grid");

  // Avtomatik ravishda 15 tadan oshsa listga o'tkazish
  useEffect(() => {
    if (teachersData.length > 10) {
      setViewMode("list");
    } else {
      setViewMode("grid");
    }
  }, [teachersData.length]);

  if (gettingTeachersData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // List rejimi uchun ustunlar
  const listColumns = ["O'qituvchi", "Telefon", "Guruhlar", "Filiallar", "Qo'shilgan sana", "Amallar"];

  const ViewToggle = (
    <div className="d-flex gap-2 align-items-center mb-3">
      <button
        className="btn btn-sm px-4 py-2"
        style={{ background: "#0085db", color: "#fff" }}
        onClick={() => setNewTeacher(true)}
      >
        <Icon icon="lucide:plus" className="fs-5" />
        Yangi qo'shish
      </button>
      <div className="d-flex p-1 rounded-1 border">
        <button
          className={`btn btn-sm ${viewMode !== 'grid' ? 'text-muted' : 'text-white'}`}
          onClick={() => setViewMode('grid')}
          style={{ background: viewMode === 'grid' ? '#0085db' : 'transparent' }}
        >
          <Icon icon="lucide:layout-grid" className="fs-5" />
        </button>
        <button
          className={`btn btn-sm ${viewMode !== 'list' ? 'text-muted' : 'text-white'}`}
          onClick={() => setViewMode('list')}
          style={{ background: viewMode === 'list' ? '#0085db' : 'transparent' }}
        >
          <Icon icon="lucide:list" className="fs-5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {notif.show && <Notification type={notif.type} message={notif.message} onClose={() => setNotif({ ...notif, show: false })} />}

      {newTeacher && <TeacherModal show={newTeacher} setShow={setNewTeacher} setNotif={setNotif} />}

      <div className="card card-body">
        <div className="d-flex justify-content-between">
          <h4 className="fs-7 d-flex flex-column gap-2">
            O'qituvchilar
            <span className="fs-3 text-muted fw-light ms-1">Jami: {teachers?.count}</span>
          </h4>
          {ViewToggle}
        </div>
        {
          teachersData?.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
              <p>O'qituvchi topilmadi</p>
            </div>
          )
            : viewMode === "grid" ? (
              <Row xs={1} sm={2} lg={3} xl={4} className="g-4 py-4 px-2 m-0">
                {teachersData.map((teacher, index) => (
                  <Col key={index}>
                    <Card
                      className="h-100 border-0 shadow text-center py-4 shadow-hover"
                      style={{
                        backgroundColor: isDark ? "#15263b" : "#ffffff",
                        color: isDark ? "#ffffff" : "#000000",
                        borderRadius: "16px"
                      }}
                    >
                      <Card.Body className="d-flex flex-column align-items-center">
                        <div className="mb-3">
                          {teacher?.photo_url ? (
                            <img
                              src={teacher.photo_url}
                              alt=""
                              className="rounded-circle shadow-sm"
                              style={{ width: "90px", height: "90px", objectFit: "cover", border: "3px solid #0d6efd" }}
                            />
                          ) : (
                            <div
                              className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                              style={{ width: "90px", height: "90px", backgroundColor: "#0d6efd", color: "white", fontSize: "2rem", fontWeight: "bold" }}
                            >
                              {teacher.first_name?.charAt(0) + teacher.last_name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <h6 className="fw-bold mb-1">{teacher.first_name} {teacher.last_name}</h6>
                        <p className="small mb-3" style={{ color: isDark ? "#94a3b8" : "#6c757d" }}>
                          {teacher.course?.name || "Fan yo'q"}
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          className="rounded-pill px-4 shadow-sm fw-semibold"
                          onClick={() => navigate(`/teachers/${index + 1}`)}
                        >
                          Profil
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )
              : (
                <DataTable
                  data={teachersData}
                  columns={viewMode === "list" ? listColumns : []}
                  searchKeys={["first_name", "last_name", "phone"]}
                  theme={isDark}
                >
                  {(currentData) => (
                    currentData.map((teacher, index) => (
                      <tr key={teacher.id} style={{ color: isDark ? "#e2e8f0" : "#000" }} onClick={() => navigate(`/teachers/${index + 1}`)}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3 py-1">
                            {teacher.photo_url ? (
                              <img src={teacher.photo_url} width="40" height="40" className="rounded-circle border object-fit-cover" alt="" />
                            ) : (
                              <div
                                className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px", backgroundColor: "#0d6efd", color: "white", fontSize: "1rem", fontWeight: "bold" }}
                              >
                                {teacher.first_name?.charAt(0) + teacher.last_name?.charAt(0)}
                              </div>
                            )}
                            <span className="fw-semibold">{teacher.first_name} {teacher.last_name}</span>
                          </div>
                        </td>
                        <td>{teacher.phone}</td>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                            {teacher.course?.name}
                          </span>
                        </td>
                        <td></td>
                        <td>
                          <span className={`badge ${teacher.status === 'interested' ? 'bg-info' : 'bg-success'} bg-opacity-10 text-${teacher.status === 'interested' ? 'info' : 'success'} px-3 py-2`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="rounded-3 border me-2 "
                            // style={{ background: "#15263a" }}
                            title="Ko'rish"
                            style={{ background: !theme ? "#15263a" : "#f5f5f5" }}
                          >
                            <Icon icon="lucide:eye" color="#0d6efd" />
                          </button>
                          <button
                            className="rounded-3 border"
                            title="Tahrirlash"
                            style={{ background: !theme ? "#15263a" : "#f5f5f5" }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Icon icon="lucide:edit" color="#fca130" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </DataTable>
              )
        }
      </div>
    </>
  );
};

export default Teachers;