import { useState, useEffect } from "react"; // Tablar uchun holat
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Spinner, Button, Nav, Table } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useDeleteStudent, useStudent, useUpdateStudent } from "../../data/queries/students.queries";
import { Input } from "../../components/Ui/Input";
import { useTheme } from "../../Context/Context";
import Notification from "../../components/Ui/Notification";
import Modal from "../../components/Ui/Modal";

const StudentDetaile = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("tahrirlash"); // Standart holat

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentStudent, isLoading, error } = useStudent(id);
  const { mutate: deleteStudentData, isPending: deletingStudent } = useDeleteStudent();
  const { mutate: updateStudentData, isPending: updatingStudent } = useUpdateStudent();

  const [student, setStudent] = useState(null);

  const [notif, setNotif] = useState({ show: false, type: "", message: "" })
  const [deleteStudent, setDeleteStudent] = useState(false)

  useEffect(() => {
    if (currentStudent) {
      setStudent({ ...currentStudent, save: false });
    }
  }, [currentStudent]);

  const handleChange = (field, value) => {
    setStudent(prev => ({ ...prev, [field]: value, save: true }));
  };

  // Card va Tugma ranglari
  const cardBg = !theme ? "#15263a" : "#f6f9fb";
  const btnColor = "#0085db";
  const textColor = !theme ? "text-white" : "text-black";

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Spinner animation="border" style={{ color: btnColor }} />
      </div>
    );
  }

  if (error) return <div className="text-danger p-5 text-center">Xatolik yuz berdi!</div>;

  const handleDeleteStudent = () => {
    deleteStudentData(id, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "O'quvchini o'chirish muvaffaqiyatli amalga oshirildi" });
        setTimeout(() => navigate(-1), 1500);
      },
      onError: (err) => {
        console.error(err)
        setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    })
  }

  const handleSaveStudent = () => {
    // Remove the temporary 'save' flag before sending to backend
    const { save, ...dataToSave } = student;
    updateStudentData({ id, data: dataToSave }, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "Ma'lumotlar muvaffaqiyatli saqlandi" });
        setStudent(prev => ({ ...prev, save: false }));
      },
      onError: (err) => {
        console.error(err);
        setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    });
  }

  return (
    <>

      {notif.show &&
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      }


      {deleteStudent &&
        <Modal
          title="Tasdiqlash"
          anima={deleteStudent}
          close={setDeleteStudent}
          width="30%"
          zIndex={100}
        >
          <p className="fs-4">Haqiqatdan o'chirishni istaysizmi?</p>

          <div className="mt-2 d-flex align-items-center gap-2 justify-content-end">
            <Button
              className="btn btn-sm px-4 py-2 text-black border-0"
              style={{ background: "#f9fafb" }}
              onClick={() => setDeleteStudent(false)}
            >
              Orqaga
            </Button>
            <Button
              className="btn btn-sm px-4 py-2 border-0"
              style={{ background: "#db3232", color: "#fff" }}
              onClick={handleDeleteStudent}
            >
              {deletingStudent ? <Spinner animation="border" size="sm" /> : "Ha"}
            </Button>
          </div>
        </Modal>
      }


      <Container fluid className="card card-body">
        {/* Header: Orqaga qaytish */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            className={`p-0 opacity-75 hover-opacity-100 ${textColor}`}
          >
            <Icon icon="fluent:arrow-left-24-filled" width="24" />
          </Button>
          <h4 className={`mb-0 fw-bold ${textColor}`}>{currentStudent?.first_name} {currentStudent?.last_name}</h4>
        </div>

        <Row>
          {/* Chap taraf: Profil */}
          <Col lg={4} xl={3}>
            <Card className="border-0 shadow-sm mb-4 text-center p-4" style={{ backgroundColor: cardBg }}>
              <div className="mb-3 position-relative">
                <img
                  src={student?.image || "/user.jpg"}
                  className="rounded-circle border border-2 border-info p-1"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                {currentStudent?.is_active && (
                  <span className="position-absolute bottom-0 translate-middle p-2 bg-success border border-light rounded-circle" style={{ left: "65%" }}></span>
                )}
              </div>
              <h5 className={`mb-1 ${textColor}`}>{currentStudent?.first_name}</h5>
              <p className="small mb-4" style={{ color: "#00d2ff" }}>{currentStudent?.phone}</p>

              <div className="text-start mt-3 pt-3 border-top border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Icon icon="fluent:location-24-regular" style={{ color: "#00d2ff" }} />
                  <span className={`small ${textColor}`}>{currentStudent?.address || "Farg'ona, Qo'qon shahri"}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Icon icon="fluent:person-24-regular" style={{ color: "#00d2ff" }} />
                  <span className={`small ${textColor}`}>ID: {currentStudent?.id}</span>
                </div>
              </div>
            </Card>
          </Col>

          {/* O'ng taraf: Ma'lumotlar */}
          <Col lg={8} xl={9}>
            <Card className="border-0 mb-4 p-4" style={{ backgroundColor: cardBg }}>
              <Row className="align-items-center gy-3">
                <Col md={5} className="border-end border-secondary border-opacity-25">
                  <p className={`mb-3 ${textColor}`}>Balans amal qilish muddati</p>
                  <div className="d-flex gap-2 flex-wrap">
                    {[5, 7, 10, 12, 14, 17, 19, 21, 24, 26, 28].map(d => (
                      <span key={d} className="badge rounded-pill border border-info border-opacity-50 fw-normal" style={{ fontSize: "11px", color: "#00d2ff" }}>{d}</span>
                    ))}
                  </div>
                </Col>
                <Col md={7}>
                  <div className="d-flex gap-2 flex-wrap ms-md-3">
                    <Badge className="py-2 px-3 fw-normal" style={{ backgroundColor: btnColor, color: "#fff" }}>Qolgan darslar: 11</Badge>
                    <Badge className="py-2 px-3 fw-normal" style={{ backgroundColor: btnColor, color: "#fff" }}>To'lanishi kerak: 330k</Badge>
                    <Badge className="py-2 px-3 fw-normal" style={{ backgroundColor: btnColor, color: "#fff" }}>Balans: {currentStudent?.balance || "0.00"}</Badge>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card className="border-0" style={{ backgroundColor: cardBg }}>
              <div className="px-4 pt-3 border-bottom border-secondary border-opacity-25">
                <Nav className="gap-4 mb-0">
                  <Nav.Link
                    onClick={() => setActiveTab("tahrirlash")}
                    className={`px-0 py-3 ${activeTab === "tahrirlash" ? "text-primary border-bottom border-2 border-primary" : "text-muted opacity-75"}`}
                    style={{ fontSize: "14px" }}
                  >
                    Tahrirlash
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setActiveTab("parol")}
                    className={`px-0 py-3 ${activeTab === "parol" ? "text-primary border-bottom border-2 border-primary" : "text-muted opacity-75"}`}
                    style={{ fontSize: "14px" }}
                  >
                    Parol o'rnatish
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setActiveTab("guruhlar")}
                    className={`px-0 py-3 ${activeTab === "guruhlar" ? "text-primary border-bottom border-2 border-primary" : "text-muted opacity-75"}`}
                    style={{ fontSize: "14px" }}
                  >
                    Guruhlar
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setActiveTab("davomat")}
                    className={`px-0 py-3 ${activeTab === "davomat" ? "text-primary border-bottom border-2 border-primary" : "text-muted opacity-75"}`}
                    style={{ fontSize: "14px" }}
                  >
                    Davomat
                  </Nav.Link>
                </Nav>
              </div>

              <Card.Body className="p-4 mt-2">
                {activeTab === "tahrirlash" && (
                  <Row className="gy-4">
                    <Col md={4}>
                      <Input
                        label="Ism"
                        value={student?.first_name || ""}
                        onChange={(e) => handleChange("first_name", e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Input
                        label="Familiya"
                        value={student?.last_name || ""}
                        onChange={(e) => handleChange("last_name", e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Input
                        label="Telefon raqam"
                        value={student?.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Input
                        label="Sharifi"
                        value={student?.middle_name || ""}
                        onChange={(e) => handleChange("middle_name", e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Input
                        label="Tug'ilgan sanasi"
                        type="date"
                        value={student?.date_of_birth || ""}
                        onChange={(e) => handleChange("date_of_birth", e.target.value)}
                      />
                    </Col>
                    <Col md={4}>
                      <Input
                        label="Rasm yuklash"
                        type="file"
                        onChange={(e) => handleChange("image", e.target.files[0])}
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        label="Ota-onasining ismi"
                        placeholder="Ism..."
                        value={student?.parent_name || ""}
                        onChange={(e) => handleChange("parent_name", e.target.value)}
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        label="Ota-onasining telefoni"
                        value={student?.parent_phone || ""}
                        onChange={(e) => handleChange("parent_phone", e.target.value)}
                      />
                    </Col>
                    <Col md={12}>
                      <label className={`form-label ${textColor}`}>Izoh</label>
                      <textarea
                        className={`form-control ${!theme ? "bg-dark text-white border-secondary" : ""}`}
                        rows="3"
                        value={student?.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                      />
                    </Col>

                    <div className="mt-5 d-flex justify-content-end">
                      <Button
                        className="btn btn-sm px-4 py-2 fw-bold me-2 delete-button"
                        onClick={() => setDeleteStudent(true)}
                      >
                        O'chirish
                      </Button>
                      <Button
                        className={`btn btn-sm save-button ${!student?.save ? 'opacity-50' : ''}`}
                        onClick={handleSaveStudent}
                        disabled={!student?.save || updatingStudent}
                      >
                        {updatingStudent ? <Spinner animation="border" size="sm" /> : "Saqlash"}
                      </Button>
                    </div>
                  </Row>
                )}

                {activeTab === "parol" && (
                  <div style={{ width: "100%" }}>
                    <Input label="Login" defaultValue={currentStudent?.phone} className="mb-3" style={{ width: "50%" }} />
                    <Input label="Yangi parol" type="password" placeholder="********" style={{ width: "50%" }} />
                    <div className="mt-5 d-flex justify-content-end">
                      <Button
                        className="btn btn-sm save-button"
                      >
                        Saqlash
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "guruhlar" && (
                  <div className="p-3 rounded border border-primary border-opacity-25" style={{ backgroundColor: "rgba(0,133,219,0.05)" }}>
                    <h6 className={textColor}>MM Arab tili J (13:30) Kids</h6>
                  </div>
                )}

                {activeTab === "davomat" && (
                  <Table responsive borderless className={textColor}>
                    <thead>
                      <tr className="border-bottom border-secondary border-opacity-25 opacity-50 small">
                        <th>SANA</th><th>GURUH</th><th>HOLAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>07.02.2026</td><td>MM Arab tili J</td><td><Badge bg="success">Kelgan</Badge></td></tr>
                      <tr><td>05.02.2026</td><td>MM Arab tili J</td><td><Badge bg="danger">Kelmagan</Badge></td></tr>
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container >
    </>
  );
};


export default StudentDetaile;