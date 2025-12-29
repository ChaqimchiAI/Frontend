import { useState, useEffect } from "react";
import {
  Tab,
  Nav,
  Row,
  Col,
  Button,
  Badge,
  Card,
  Form,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
// Tabler Icons
import {
  IconPlus,
  IconUserCircle,
  IconLock,
} from "@tabler/icons-react";
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordStatus, setPasswordStatus] = useState(""); // Parol o'zgartirish natijasi uchun

  // **********************************************
  //             API SO'ROVI (GET)
  // **********************************************
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://apichaqimchi.pythonanywhere.com/api/v1/staff/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        console.log(res);

        setEmployee(res?.data.data);
      } catch (err) {
        console.error("Profil ma'lumotlarini olishda xato:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // **********************************************
  //             PAROL O'ZGARTIRISH LOGIKASI
  // **********************************************
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus("");

    const current = e.target.elements.currentPassword.value;
    const newPass = e.target.elements.newPassword.value;
    const confirm = e.target.elements.confirmPassword.value;

    if (newPass !== confirm) {
      setPasswordStatus("Yangi parol va tasdiqlash paroli mos emas!");
      return;
    }

    try {
      // Haqiqiy API chaqirig'i misoli

      await axios.post(
        "http://apichaqimchi.pythonanywhere.com/api/v1/user/change-password/",
        {
          current_password: current,
          new_password: newPass,
          new_password_confirm: confirm,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setPasswordStatus("Parol muvaffaqiyatli o'zgartirildi!");
      e.target.reset();
    } catch (apiError) {
      console.error("Parol o'zgartirishda xato:", apiError);
      setPasswordStatus(
        "Parolni o'zgartirishda xato yuz berdi. Iltimos, hozirgi parolni tekshiring."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-2">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="alert alert-warning">Profil ma'lumotlari topilmadi.</div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <BreadcrumbComponent currentPage="Profile" />

        <Tab.Container defaultActiveKey="profile">
          {/* 1. Profil Sarlavhasi (Header) va Tab Navigatsiyasi */}
          <div className="position-relative overflow-hidden">
            <Card id="body-card-index" className="card">
              <Card.Body id="body-card-main" className="card-body pb-0">
                <div className="d-md-flex align-items-center justify-content-between text-center text-md-start">
                  <div className="d-md-flex align-items-center">
                    {/* Profil rasmi va "+" belgisi */}
                    <div className="rounded-circle position-relative mb-0 mb-md-0 d-inline-block">
                      <img
                        src={
                          employee?.photo_url ||
                          "/user-1.jpg"
                        }
                        alt="profile-img"
                        className="img-fluid rounded-circle"
                        width="100"
                        height="100"
                      />
                      <span className="text-bg-primary rounded-circle text-white d-flex align-items-center justify-content-center position-absolute bottom-0 end-0 p-1 border-2 border-white">
                        <IconPlus size={16} />
                      </span>
                    </div>

                    {/* Foydalanuvchi ma'lumotlari */}
                    <div className="ms-0 ms-md-3 mb-9 mb-md-0">
                      <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-1">
                        <h4 id="full-name" className="me-3 mb-0 fs-7 fw-bold">
                          {employee?.full_name}
                        </h4>
                        <Badge
                          id="is-active-badge"
                          bg={employee?.is_active ? "primary" : "danger"}
                          className="badge fs-6 fw-bold rounded-pill  border"
                        >
                          {employee?.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p id="positions" className="fs-6 mb-1">
                        {employee?.positions?.current?.title || "-"}
                      </p>
                      <p id="branches" className="fs-6 mb-1">
                        {employee?.branches?.current?.name || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Edit Profile tugmasi */}
                  <h5
                    style={{
                      backgroundColor: "rgb(13,110,253)",
                      color: "white",
                      padding: "8px 22px",
                      borderRadius: "34px",
                      display: "inline-block",
                      textDecoration: "none",
                      fontSize: "15px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Edit Profile
                  </h5>
                </div>

                {/* Tablar (Navigatsiya) */}
                <Nav
                  variant="pills"
                  className="nav nav-pills pb-0 user-profile-tab mt-4 justify-content-center justify-content-md-start"
                  id="pills-tab"
                >
                  <Nav.Item className="nav-item me-2 me-md-3">
                    <Nav.Link
                      eventKey="profile"
                      className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent py-6"
                    >
                      <IconUserCircle size={20} className="me-0 me-md-2" />
                      <span className="d-none d-md-block">My Profile</span>
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="nav-item me-2 me-md-3">
                    <Nav.Link
                      eventKey="password"
                      className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent py-6"
                    >
                      <IconLock size={20} className="me-0 me-md-2" />
                      <span className="d-none d-md-block">Parol</span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </div>

          {/* 2. Tab Kontenti - Siz bergan HTML qismiga moslashtirildi */}
          <Tab.Content className="mt-2">
            {/* My Profile Tab */}
            <Tab.Pane eventKey="profile">
              <Row>
                <Col lg={12}>
                  <div className="card border border-1 p-4">
                    <h4 className="fs-6 mb-3">About me</h4>
                    <p className="mb-3 text-dark">
                      {employee?.about_me || "Ma'lumot kiritilmagan."}
                    </p>

                    {/* Contact */}
                    <div className="py-3 border-top">
                      <h5 className="mb-3">Contact</h5>

                      <p className="mb-1">
                        <strong
                          className="d-inline-block"
                          style={{ width: "120px" }}
                        >
                          Phone:
                        </strong>
                        <span className="text-muted">
                          {employee?.phone || "-"}
                        </span>
                      </p>

                      <p className="mb-1">
                        <strong
                          className="d-inline-block"
                          style={{ width: "120px" }}
                        >
                          Email:
                        </strong>
                        <span className="text-muted">
                          {employee?.email || "-"}
                        </span>
                      </p>

                      <p className="mb-0">
                        <strong
                          className="d-inline-block"
                          style={{ width: "120px" }}
                        >
                          Address:
                        </strong>
                        <span className="text-muted">
                          {employee?.address || "-"}
                        </span>
                      </p>
                    </div>

                    {/* Other */}
                    <div className="pt-3 border-top">
                      <h5 className="mb-3">Other</h5>

                      <p className="mb-1">
                        <strong
                          className="d-inline-block"
                          style={{ width: "120px" }}
                        >
                          Birth Date:
                        </strong>
                        <span className="text-muted">
                          {employee?.birth_date || "-"}
                        </span>
                      </p>

                      <p className="mb-0">
                        <strong
                          className="d-inline-block"
                          style={{ width: "120px" }}
                        >
                          Hire Date:
                        </strong>
                        <span className="text-muted">
                          {employee?.hire_date || "-"}
                        </span>
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Password Tab */}
            <Tab.Pane eventKey="password">
              <Row>
                <Col lg={6}>
                  <Card className="shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="mb-4">Parolni o'zgartirish</h5>

                      {passwordStatus && (
                        <div
                          className={`alert ${passwordStatus.includes("muvaffaqiyatli")
                            ? "alert-success"
                            : "alert-danger"
                            } mb-3`}
                          role="alert"
                        >
                          {passwordStatus}
                        </div>
                      )}

                      <Form onSubmit={handleChangePassword}>
                        <Form.Group className="mb-3">
                          <Form.Label>Hozirgi parol</Form.Label>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Yangi parol</Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Parolni tasdiqlash</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            required
                          />
                        </Form.Group>

                        <Button
                          variant="primary"
                          type="submit"
                          className="mt-2 fw-semibold"
                        >
                          O'zgartirish
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export default Profile;
