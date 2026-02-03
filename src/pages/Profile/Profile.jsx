import { useState, useEffect } from "react";
import {
  Tab,
  Nav,
  Row,
  Col,
  Button,
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
import Modal from "../../components/Ui/Modal"
import { Input } from "../../components/Ui/Input";
import Notification from "../../components/Ui/Notification";
import { useChangePassword, useProfile } from "../../data/queries/profile.queries"
import { useTheme } from "../../Context/Context";

const Profile = () => {

  const { theme } = useTheme();

  const [EditModal, setEditModal] = useState(false)
  const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })
  const [passwordStatus, setPasswordStatus] = useState("");

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })

  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { mutate: changePassword, isPending: changePasswordLoading } = useChangePassword()

  if (profileLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="mt-2">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="text-center py-5">
        <p className="mt-2">Xatolik yuz berdi</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-5">
        <p className="mt-2">Profil ma'lumotlari topilmadi</p>
      </div>
    );
  }

  // parolni o'zgartirish
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setNotif({ show: true, type: 'error', message: "Yangi parol va tasdiqlash paroli mos emas!" })
      return;
    }

    if (passwordData.new_password.length < 6 || passwordData.confirm_password.length < 6) {
      setNotif({ show: true, type: 'warn', message: "Yangi parol kamida 6 ta belgidan iborat bo'lishi shart!" })
      return;
    }

    changePassword(
      passwordData,
      {
        onSuccess: () => {
          setNotif({ show: true, type: 'success', message: 'Parol muvaffaqiyatli o`zgartirildi' })
          setPasswordData({
            current_password: "",
            new_password: "",
            confirm_password: ""
          })
        },
        onError: (err) => {
          console.error(err);
          setNotif({ show: true, type: 'error', message: "Parol o'zgartirilmadi, xatolik yuz berdi" })
        }
      }
    )

  };

  const handleSaveChanges = () => {
    setEditModal(false)
    setNotif({ show: true, type: 'edited', message: "Ma'lumotlar saqlandi" })
  }

  return (
    <>

      {EditModal && (
        <Modal
          title="Ma'lumotlarni tahrirlash"
          close={setEditModal}
          anima={EditModal}
          width="60%"
          zIndex={100}
        >
          <div className="d-flex justify-content-between gap-3 mt-2">
            <div className="d-flex flex-column w-50 gap-2">
              <span className="fw-bold fs-4 text-white-50">
                Shaxsiy
              </span>
              <Input
                label="Ism"
                placeholder="Ismingiz..."
                defaultValue={profile?.first_name}
              />
              <Input
                label="Familya"
                placeholder="Familiyangiz..."
                defaultValue={profile?.last_name}
              />
              <Input
                label="Telefon"
                placeholder="Telifon raqam..."
                defaultValue={profile?.phone}
              />
              <Input
                type="email"
                label="Email"
                placeholder="Email manzilingiz..."
                defaultValue={profile?.email}
              />
            </div>
            <div
              style={{ width: "1px", height: "auto", background: "#2b364cff" }}
            >

            </div>
            <div className="d-flex flex-column w-50 gap-2">
              <span className="fw-bold fs-4 text-white-50">
                Boshqa
              </span>
              <Input
                label="Yashash manzili"
                placeholder="(Farg'ona)"
                defaultValue={profile?.address}
              />
              <Input
                label="Tug'ilgan sana"
                type="date"
                defaultValue={profile?.date_of_birth}
              />
              <Input
                label="Ishga olingan sana"
                type="date"
                defaultValue={profile?.hire_date}
              />
              <div className="d-flex flex-column gap-2">
                <label htmlFor="disc">
                  Izoh
                </label>
                <textarea
                  id="disc"
                  className="form-control"
                  defaultValue={profile?.description}
                  placeholder="Izoh..."
                  style={{ height: "90px" }}
                >

                </textarea>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3 mt-3">
            <button
              className="btn btn-sm py-2 px-4"
              style={{ background: "#e5e5e5", color: "black" }}
              onClick={() => setEditModal(false)}
            >
              Orqaga
            </button>
            <button
              className="btn btn-sm py-2 px-4"
              style={{ background: "#0085db", color: "white" }}
              onClick={handleSaveChanges}
            // disabled={changePasswordLoading}
            >
              {/* {changePasswordLoading ? <Spinner animation="border" size="sm" /> : "Saqlash"} */}
              Saqlash
            </button>
          </div>
        </Modal>
      )}


      {notif.show && (
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      )}


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
                            profile?.photo_url ||
                            "/user-1.jpg"
                          }
                          alt="profile-img"
                          className="img-fluid"
                          style={{ borderRadius: "100%", width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <span className="text-bg-primary rounded-circle text-white d-flex align-items-center justify-content-center position-absolute bottom-0 end-0 p-1 border-2 border-white">
                          <IconPlus size={16} />
                        </span>
                      </div>

                      {/* Foydalanuvchi ma'lumotlari */}
                      <div className="ms-0 ms-md-3 mb-9 mb-md-0">
                        <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-1">
                          <h4 id="full-name" className="me-3 mb-0 fs-6 fw-bold">
                            {profile?.first_name + " " + profile?.last_name}
                          </h4>
                          <span
                            className="fs-2 rounded-4 fw-bold text-capitalize"
                            style={{ color: "#0095db", padding: "1px 10px", background: "#0085db20", border: "1px solid #0095db" }}
                          >
                            {profile?.role}
                          </span>
                        </div>
                        <p id="positions" className={`fs-5 mt-2 text-success`}>
                          •
                          <span
                            className="fs-3 fw-bold"
                            style={{ color: !theme ? "white" : "black" }}
                          >
                            Active
                          </span>
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
                      onClick={() => setEditModal(true)}
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
                  <Col lg={6}>
                    <div className="card border border-1 p-4">
                      <h4 className="fs-6 mb-3">About me</h4>
                      <p className="mb-3 text-dark">
                        {profile?.about_me || "Ma'lumot kiritilmagan."}
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
                            {profile?.phone || "-"}
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
                            {profile?.email || "-"}
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
                            {profile?.address || "-"}
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
                            {profile?.date_of_birth || "-"}
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
                            {profile?.hire_date || "-"}
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
                            <Input
                              label="Hozirgi parol"
                              type="password"
                              name="currentPassword"
                              required
                              value={passwordData.current_password}
                              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Input
                              label="Yangi parol"
                              type="password"
                              name="newPassword"
                              required
                              value={passwordData.new_password}
                              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Input
                              label="Parolni tastiqlash"
                              type="password"
                              name="confirmPassword"
                              required
                              value={passwordData.confirm_password}
                              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                            />
                          </Form.Group>

                          <Button
                            variant="primary"
                            type="submit"
                            className="mt-2 fw-semibold"
                            disabled={changePasswordLoading}
                          >
                            {changePasswordLoading ? <Spinner animation="border" size="sm" /> : "O'zgartirish"}
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
    </>
  );
};

export default Profile;
