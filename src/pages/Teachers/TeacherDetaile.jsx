import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button, Spinner, Table } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useTheme } from "../../Context/Context";
import { useDeleteTeacher, useTeacher } from "../../data/queries/teachers.queries";
import TeacherModal from "./modals/TeacherModal";
import Notification from "../../components/Ui/Notification";
import Modal from "../../components/Ui/Modal";

const TeacherDetail = () => {
  const { id } = useParams();

  const { data: teacher, isLoading: getting, isError } = useTeacher(id);

  const { mutate: deleteTeacher, isPending: deleting } = useDeleteTeacher()

  const [editTeacher, setEditTeacher] = useState(false);
  const [deleteTeacHer, setDeleteTeacher] = useState(false);
  const [notif, setNotif] = useState({ show: false, type: "", message: "" });

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = !theme;

  if (getting) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <p>Ma'lumot topilmadi</p>
      </div>
    );
  }

  const styles = {
    cardBg: isDark ? "#15263a" : "#ffffff",
    textColor: isDark ? "#f8fafc" : "#15263a",
    mutedText: isDark ? "#94a3b8" : "#64748b",
    borderColor: isDark ? "#334155" : "#e2e8f0",
    pageBg: isDark ? "#0f172a" : "#f8fafc"
  };

  const delateTeacher = () => {
    deleteTeacher(
      id,
      {
        onSuccess: () => {
          setDeleteTeacher(false);
          setNotif({ show: true, type: "deleted", message: "O'qituvchi o'chirildi" });
          navigate("/teachers");
        },
        onError: (err) => {
          console.error(err)
          setNotif({ show: true, type: "error", message: "O'qituvchi o'chirilmadi" });
        }
      }
    )
  };

  return (
    <>

      {notif.show && <Notification type={notif.type} message={notif.message} onClose={() => setNotif({ ...notif, show: false })} />}

      {editTeacher && <TeacherModal show={editTeacher} setShow={setEditTeacher} setNotif={setNotif} editData={teacher} />}

      {deleteTeacHer && (
        <Modal
          title="O'qituvchini o'chirish"
          close={setDeleteTeacher}
          anima={deleteTeacHer}
          width="30%"
          zIndex={100}
        >
          <p className="fs-4 mt-2">
            {teacher?.first_name} ni rostdan ham o'chirmoqchimisiz?
          </p>
          <div className="d-flex justify-content-end gap-3 mt-3">
            <button
              className="btn btn-sm text-black py-2 px-4"
              style={{ background: "#c5c5c5" }}
              onClick={() => setDeleteTeacher(false)}
            >
              Orqaga
            </button>
            <button
              className="btn btn-sm text-white py-2 px-4"
              style={{ background: "#cd3232" }}
              onClick={delateTeacher}
            >
              {deleting ? <Spinner animation="border" size="sm" /> : "Ha"}
            </button>
          </div>
        </Modal>
      )}

      <Container fluid className="card card-body" style={{ minHeight: "100vh" }}>

        {/* Back Button & Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <Button
            variant="light"
            onClick={() => navigate(-1)}
            className="rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: styles.cardBg, color: styles.textColor, border: `1px solid ${styles.borderColor}` }}
          >
            <Icon icon="lucide:arrow-left" className="fs-4" />
          </Button>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: styles.textColor }}>O'qituvchi Profili</h4>
            <small style={{ color: styles.mutedText }}>ID: #{id || "3"}</small>
          </div>
        </div>

        <Row className="g-4">
          {/* LEFT SIDE: Profile Card */}
          <Col lg={4} xl={3}>
            <Card className="shadow-md text-center py-4 px-3" style={{ background: styles.cardBg }}>
              <div className="position-relative d-inline-block mx-auto mb-3">
                {teacher.photo_url ? (
                  <img
                    src={teacher.photo_url}
                    alt="Profile"
                    className="rounded-circle border border-4 border-primary shadow-sm"
                    style={{ width: "130px", height: "130px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle border border-4 border-primary shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: "130px", height: "130px", backgroundColor: styles.cardBg }}
                  >
                    <span
                      className="fs-8 text-uppercase"
                      style={{ color: styles.mutedText }}
                    >
                      {teacher.first_name?.charAt(0) + teacher.last_name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <h5 className="fw-bold mb-1" style={{ color: styles.textColor }}>{teacher.first_name} {teacher.last_name}</h5>
              <p className="small mb-3" style={{ color: styles.mutedText }}>O'qituvchi</p>

              <div className="d-flex justify-content-center gap-2 mb-4">
                <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                  {teacher.status}
                </Badge>
                <Badge bg="info" className="bg-opacity-10 text-info px-3 py-2 rounded-pill">
                  Farg'ona filiali
                </Badge>
              </div>

              <hr style={{ borderColor: styles.borderColor }} />

              <div className="text-start mt-3">
                <div className="mb-3 d-flex align-items-center gap-3">
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <Icon icon="lucide:phone" />
                  </div>
                  <div>
                    <small className="d-block text-muted" style={{ fontSize: "11px" }}>Telefon</small>
                    <span className="fw-medium small" style={{ color: styles.textColor }}>{teacher.phone}</span>
                  </div>
                </div>
                <div className="mb-3 d-flex align-items-center gap-3">
                  <div className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger">
                    <Icon icon="lucide:mail" />
                  </div>
                  <div className="text-truncate">
                    <small className="d-block text-muted" style={{ fontSize: "11px" }}>Email</small>
                    <span className="fw-medium small text-truncate d-block" style={{ color: styles.textColor }}>{teacher.email}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                    <Icon icon="lucide:map-pin" />
                  </div>
                  <div>
                    <small className="d-block text-muted" style={{ fontSize: "11px" }}>Manzil</small>
                    <span className="fw-medium small" style={{ color: styles.textColor }}>{teacher.address}</span>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button
                  className="btn px-4 py-2 w-100 mt-4 hover-btn"
                  style={{ background: "#cd323220", border: "2px solid #cd3232", color: "#cd3232" }}
                  onClick={() => setDeleteTeacher(true)}
                >
                  O'chirish
                </button>
                <button
                  className="btn px-4 py-2 w-100 mt-4 text-white"
                  style={{ background: "#0085db" }}
                  onClick={() => setEditTeacher(true)}
                >
                  Tahrirlash
                </button>
              </div>
            </Card>
          </Col>

          {/* RIGHT SIDE: Detailed Info & Stats */}
          <Col lg={8} xl={9}>
            <Row className="g-4">
              {/* Stats row */}
              <Col md={4}>
                <Card className="border-0 shadow-sm p-3" style={{ backgroundColor: styles.cardBg, borderRadius: "20px" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-4 bg-info bg-opacity-10 text-info">
                      <Icon icon="lucide:briefcase" className="fs-5" />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold" style={{ color: styles.textColor }}>{teacher.experience_duration}</h6>
                      <small style={{ color: styles.mutedText }}>Ish tajribasi</small>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm p-3" style={{ backgroundColor: styles.cardBg, borderRadius: "20px" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                      <Icon icon="lucide:calendar-check" className="fs-5" />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold" style={{ color: styles.textColor }}>{teacher.hire_date}</h6>
                      <small style={{ color: styles.mutedText }}>Ishga kirgan</small>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm p-3" style={{ backgroundColor: styles.cardBg, borderRadius: "20px" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                      <Icon icon="lucide:cake" className="fs-6" />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold" style={{ color: styles.textColor }}>{teacher.date_of_birth}</h6>
                      <small style={{ color: styles.mutedText }}>Tug'ilgan sana</small>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* General Info Tabs/Sections */}
              <Col md={12}>
                <Card className="border-0 shadow-sm p-4" style={{ backgroundColor: styles.cardBg, borderRadius: "24px" }}>
                  <h5 className="fw-bold mb-4" style={{ color: styles.textColor }}>Batafsil ma'lumot</h5>

                  <Row className="g-4">
                    <Col md={6}>
                      <div className="p-3 rounded-4 border d-flex justify-content-between align-items-center" style={{ borderColor: styles.borderColor }}>
                        <div>
                          <small className="text-muted d-block">To'liq ism (Sharifi bilan)</small>
                          <span className="fw-semibold" style={{ color: styles.textColor }}>{teacher.last_name} {teacher.first_name} {teacher.middle_name}</span>
                        </div>
                        <Icon icon="lucide:user" className="text-primary fs-6" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 rounded-4 border d-flex justify-content-between align-items-center" style={{ borderColor: styles.borderColor }}>
                        <div>
                          <small className="text-muted d-block">Hozirgi lavozimi</small>
                          <span className="fw-semibold" style={{ color: styles.textColor }}>O'qituvchi</span>
                        </div>
                        <Icon icon="lucide:shield-check" className="text-success fs-6" />
                      </div>
                    </Col>
                  </Row>

                  <h6 className="fw-bold mt-5 mb-3" style={{ color: styles.textColor }}>Filiallar tarixi</h6>
                  <div className="table-responsive">
                    <Table borderless hover className="align-middle">
                      <thead className="small text-muted border-bottom">
                        <tr>
                          <th>FILIAL NOMI</th>
                          <th>HOLATI</th>
                          <th>BIRIKTIRILGAN SANA</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        <tr>
                          <td className="fw-medium">Farg'ona filiali</td>
                          <td><Badge bg="success">Faol</Badge></td>
                          <td>{teacher.hire_date}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>


      <style>
        {`
          .hover-btn:hover {
            background: #cd323230 !important;
          }
        `}
      </style>
    </>
  );
};

export default TeacherDetail;