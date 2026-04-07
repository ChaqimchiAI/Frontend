import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button, Nav } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useArchiveStudent, useArchiveStudentEnrollmentHistory } from "../../data/queries/archive.queries";
import { useTheme } from "../../Context/Context";

const ArchiveStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { data: currentStudent, isLoading, error } = useArchiveStudent(id);
  const { data: historyData, isLoading: historyLoading } = useArchiveStudentEnrollmentHistory(id);

  const [activeTab, setActiveTab] = useState("profile");

  const cardBg = !theme ? "#15263a" : "#f6f9fb";
  const textColor = !theme ? "text-white" : "text-black";
  const balanceValue = Number(currentStudent?.balance || 0);
  const balanceColor = balanceValue < 0 ? "#ef4444" : "#10b981";

  const TABS = [
    { key: "profile",     label: "Profil",        icon: "solar:user-id-bold" },
    { key: "guruhlar",    label: "Guruhlar",       icon: "solar:users-group-two-rounded-bold" },
    { key: "tarix",       label: "Guruh tarixi",   icon: "solar:history-bold" },
  ];

  if (isLoading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="primary" />
    </div>
  );
  if (error) return <div className="p-4 text-danger">Ma'lumot yuklanmadi!</div>;

  return (
    <Container fluid className="card card-body mt-2">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <Button variant="link" onClick={() => navigate(-1)} className={`p-0 ${textColor}`}>
            <Icon icon="fluent:arrow-left-24-filled" width="24" />
          </Button>
          <div>
            <h4 className={`mb-0 fw-bold ${textColor}`}>
              {currentStudent?.first_name} {currentStudent?.last_name}
            </h4>
            <small className="text-muted">Arxivlangan o'quvchi — faqat ko'rish rejimida</small>
          </div>
        </div>
      </div>

      <Row>
        {/* Left: Profile Card */}
        <Col lg={4} xl={3}>
          <Card className="border-0 shadow-sm mb-4 text-center p-3" style={{ backgroundColor: cardBg, borderRadius: "15px" }}>
            <img
              src={currentStudent?.image || "/user.jpg"}
              className="rounded-circle border border-3 p-1 mx-auto d-block mb-3"
              style={{ width: "110px", height: "110px", objectFit: "cover", borderColor: balanceColor }}
              alt="Student"
            />
            <h5 className={`fw-bold mb-1 ${textColor}`}>
              {currentStudent?.first_name} {currentStudent?.last_name}
            </h5>
            <p className="small mb-3" style={{ color: "#00d2ff" }}>
              <Icon icon="solar:phone-bold" className="me-1" />
              {currentStudent?.phone}
            </p>

            <div className="mb-3 p-2 rounded-3" style={{ background: `${balanceColor}15` }}>
              <span className="small opacity-75 d-block" style={{ color: textColor }}>Joriy Balans</span>
              <span className="fw-bold fs-5" style={{ color: balanceColor }}>
                {balanceValue.toLocaleString()} <small style={{ fontSize: "12px" }}>UZS</small>
              </span>
            </div>

            <div className="text-start mt-2 pt-3 border-top border-secondary border-opacity-10">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Icon icon="solar:map-point-bold-duotone" width="18" style={{ color: "#00d2ff" }} />
                <span className={`small ${textColor}`}>{currentStudent?.address || "Manzil ko'rsatilmagan"}</span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Icon icon="solar:user-id-bold-duotone" width="18" style={{ color: "#00d2ff" }} />
                <span className={`small ${textColor}`}>ID: {currentStudent?.id}</span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Icon icon="solar:buildings-bold-duotone" width="18" style={{ color: "#00d2ff" }} />
                <span className={`small ${textColor}`}>{currentStudent?.branch_name || "Filial ko'rsatilmagan"}</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right: Tabs */}
        <Col lg={8} xl={9}>
          <Card className="border-0" style={{ backgroundColor: cardBg }}>
            <div className="px-4 pt-2 border-bottom border-secondary border-opacity-25">
              <Nav className="gap-3">
                {TABS.map(({ key, label }) => (
                  <Nav.Link
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-0 py-3 text-capitalize ${activeTab === key ? "text-primary border-bottom border-2 border-primary" : "text-muted opacity-75"}`}
                    style={{ fontSize: "14px", cursor: "pointer" }}
                  >
                    {label}
                  </Nav.Link>
                ))}
              </Nav>
            </div>
            
            <Card.Body className="p-4 mt-2">
              {/* PROFIL TAB */}
              {activeTab === "profile" && (
                <div>
                  <h5 className={`fw-bold mb-4 ${textColor}`}>Shaxsiy Ma'lumotlar</h5>
                  <Row className="g-3">
                    {[
                      { label: "Ism", value: currentStudent?.first_name },
                      { label: "Familiya", value: currentStudent?.last_name },
                      { label: "Telefon", value: currentStudent?.phone },
                      { label: "Manzil", value: currentStudent?.address },
                    ].map(({ label, value }) => (
                      <Col sm={6} key={label}>
                        <div className="p-3 rounded-3" style={{ background: !theme ? "#1a2d45" : "#fff", border: "1px solid #dee2e6" }}>
                          <span className="text-muted small d-block mb-1">{label}</span>
                          <span className={`fw-medium ${textColor}`}>{value || "—"}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <div className="mt-4">
                    <h6 className={`fw-bold mb-2 ${textColor}`}>O'quvchi holati</h6>
                    <span className={`badge ${currentStudent?.is_active ? "bg-success" : "bg-danger"}`}>
                      {currentStudent?.is_active ? "Faol (Hozir o'qiydi)" : "Nofaol (Arxivlangan)"}
                    </span>
                  </div>
                </div>
              )}
              
              {/* GURUHLAR TAB */}
              {activeTab === "guruhlar" && (
                <div>
                  <h5 className={`fw-bold mb-4 ${textColor}`}>O'qiydigan/O'qigan Guruhlari</h5>
                  {currentStudent?.groups?.length === 0 ? (
                    <p className="text-muted">Hech qanday guruhga biriktirilmagan</p>
                  ) : (
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Guruh</th>
                          <th>Kurs</th>
                          <th>Holati</th>
                          <th>Qo'shilgan sana</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentStudent?.groups?.map(g => (
                          <tr key={g.group_id}>
                            <td className="fw-bold text-primary cursor-pointer" onClick={() => navigate(`/archive/groups/${g.group_id}`)}>
                              {g.group_name}
                            </td>
                            <td>{g.course_name}</td>
                            <td>
                              <span className={`badge ${g.status === 'active' ? 'bg-success' : g.status === 'finished' ? 'bg-secondary' : 'bg-danger'}`}>
                                {g.status}
                              </span>
                            </td>
                            <td>{g.joined_date || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
              
              {/* TARIX TAB (Yangi qo'shilgan) */}
              {activeTab === "tarix" && (
                <div>
                  <h5 className={`fw-bold mb-4 ${textColor}`}>
                    <Icon icon="solar:history-bold" className="me-2" />
                    Guruh Tarixi
                  </h5>
                  {historyLoading ? (
                    <div className="text-center py-4"><Spinner animation="border" size="sm" /></div>
                  ) : historyData?.length === 0 ? (
                    <p className="text-muted">Hech qanday tarix mavjud emas.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead>
                          <tr>
                            <th>Sana</th>
                            <th>Guruh</th>
                            <th>Harakat</th>
                            <th>Izoh</th>
                            <th>Xodim</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyData.map(h => (
                            <tr key={h.id}>
                              <td>{new Date(h.date).toLocaleString()}</td>
                              <td className="fw-bold cursor-pointer text-primary" onClick={() => navigate(`/archive/groups/${h.group_id}`)}>
                                {h.group_name}
                              </td>
                              <td>
                                <span className={`badge ${
                                  h.action === "join" ? "bg-success" : 
                                  h.action === "leave" ? "bg-danger" : 
                                  h.action === "finished" ? "bg-info text-dark" : "bg-secondary"
                                }`}>
                                  {h.action_display}
                                </span>
                              </td>
                              <td><span className="small text-muted">{h.comment || "—"}</span></td>
                              <td><span className="small">{h.created_by_name || "Tizim"}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ArchiveStudentDetail;
