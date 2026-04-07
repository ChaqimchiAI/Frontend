import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Badge, ListGroup, Spinner, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useTheme } from "../../Context/Context";
import Back from "../../components/Ui/Back";
import { useLead, useLeadHistory } from "../../data/queries/leads.queries";

const ArchiveLeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { data: lead, isLoading, error } = useLead(id);
  const { data: history, isLoading: isHistoryLoading } = useLeadHistory(id);

  const getStatusBadge = (status) => {
    const statusValue = typeof status === "object" ? (status?.code || status?.name || status?.id) : status;
    const statusMap = {
      new:        { label: "Yangi",              color: "#0dcaf0", icon: "qlementine-icons:new-16" },
      registered: { label: "Guruhga qo'shilgan", color: "#198754", icon: "material-symbols:check-circle-outline" },
      lost:       { label: "O'chirilgan",        color: "#dc3545", icon: "material-symbols:cancel-outline" },
      contacted:  { label: "Bog'lanilgan",       color: "#6610f2", icon: "material-symbols:call-made" },
    };
    const s = statusMap[statusValue] || {
      label: typeof status === "object" ? (status?.name || "Noaniq") : (status || "Noaniq"),
      color: "#6c757d",
      icon: "material-symbols:help-outline",
    };
    return (
      <div
        className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
        style={{ background: `${s.color}50`, color: s.color, border: `1px solid ${s.color}40`, fontSize: "0.85rem", fontWeight: "600" }}
      >
        <Icon icon={s.icon} /> {String(s.label)}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Aniqlanmagan";
    return new Date(dateString).toLocaleString("uz-UZ", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    color: "white",
  };

  if (isLoading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (error) return (
    <div className="text-center mt-5">
      <p className="text-danger">Xatolik: Ma'lumot yuklanmadi</p>
      <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>Orqaga</Button>
    </div>
  );

  return (
    <div className="container-fluid p-4" style={{ color: "#e2e2e2" }}>
      <Back style={{ transform: "translate(-10px, -20px)" }} />

      {/* Header — faqat o'qish, hech qanday amal tugmasi yo'q */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-white border-opacity-10">
        <div>
          <h5 className="mb-0 fw-bold">Lid tafsilotlari</h5>
          <small className="text-white-50">Arxivlangan lid — faqat ko'rish rejimida</small>
        </div>
      </div>

      <Row className="g-4">
        {/* Left: Main Info */}
        <Col lg={8}>
          {/* Profile header */}
          <Card style={glassStyle} className="mb-4 overflow-hidden border-0 shadow-lg">
            <div style={{ height: "80px", background: "linear-gradient(90deg, #0085db30, #00c8ff30)" }}></div>
            <Card.Body className="position-relative pt-0 px-4">
              <div className="position-relative" style={{ marginTop: "-40px" }}>
                <div className="d-flex flex-column flex-md-row align-items-end gap-3 mb-3">
                  <div
                    className="rounded-circle overflow-hidden border border-4 border-dark shadow-lg d-flex align-items-center justify-content-center"
                    style={{ width: "100px", height: "100px", fontSize: "2.5rem", background: "linear-gradient(45deg, #2b364c, #1a2233)" }}
                  >
                    {lead?.first_name?.charAt(0)}{lead?.last_name?.charAt(0)}
                  </div>
                  <div className="flex-grow-1 mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <h2 className="mb-0 fw-bold">{lead?.first_name} {lead?.last_name}</h2>
                      {getStatusBadge(lead?.status)}
                    </div>
                    <div className="text-white-50 d-flex align-items-center gap-2 mt-1">
                      <Icon icon="material-symbols:calendar-today-outline" />
                      <span>Qo'shildi: {new Date(lead?.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-4 border-white border-opacity-10" />

              <Row className="py-2">
                <Col md={4} className="mb-3 mb-md-0 border-end border-white border-opacity-10">
                  <div className="d-flex flex-column">
                    <span className="text-white-50 small mb-1">Telefon raqam</span>
                    <a href={`tel:${lead?.phone}`} className="text-white text-decoration-none fw-semibold d-flex align-items-center gap-2">
                      <Icon icon="material-symbols:call" className="text-primary" />
                      {lead?.phone}
                    </a>
                  </div>
                </Col>
                <Col md={4} className="mb-3 mb-md-0 border-end border-white border-opacity-10">
                  <div className="d-flex flex-column">
                    <span className="text-white-50 small mb-1">Kurs</span>
                    <span className="fw-semibold d-flex align-items-center gap-2 text-warning">
                      <Icon icon="material-symbols:school-outline" />
                      {lead?.course?.name || "Tanlanmagan"}
                    </span>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex flex-column">
                    <span className="text-white-50 small mb-1">O'qituvchi</span>
                    <span className="fw-semibold d-flex align-items-center gap-2">
                      <Icon icon="material-symbols:person-outline" className="text-success" />
                      {lead?.teacher?.first_name ? `${lead.teacher.first_name} ${lead.teacher.last_name}` : "Tayinlanmagan"}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Timeline */}
          <Card style={glassStyle} className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <Icon icon="material-symbols:history-rounded" className="text-primary" width="20" />
                Harakatlar tarixi
              </h6>
            </Card.Header>
            <Card.Body className="px-4 py-4">
              {isHistoryLoading ? (
                <div className="text-center py-4"><Spinner size="sm" animation="border" /></div>
              ) : history && history.length > 0 ? (
                <div className="timeline">
                  {history.map((item, idx) => (
                    <div key={idx} className="position-relative ps-4 pb-4">
                      <div className="position-absolute start-0 top-0 mt-1 rounded-circle bg-primary shadow" style={{ width: "12px", height: "12px", marginLeft: "-6px", zIndex: 1 }}></div>
                      {idx !== history.length - 1 && (
                        <div className="position-absolute start-0 h-100 border-start border-primary border-opacity-25" style={{ top: "12px", marginLeft: "-1px" }}></div>
                      )}
                      <div className="small text-white-50 mb-1">{formatDate(item.created_at)}</div>
                      <div className="fw-semibold mb-1">{item.title || "Status o'zgartirildi"}</div>
                      <div className="text-white-50 small">{item.comment || "Tafsilotlar mavjud emas"}</div>
                      {item.status && <div className="mt-2">{getStatusBadge(item.status)}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-white-50">
                  <Icon icon="material-symbols:history-off" width="48" className="mb-2 opacity-25" />
                  <p className="mb-0">Hozircha hech qanday harakat qayd etilmagan</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right: Sidebar */}
        <Col lg={4}>
          <Card style={glassStyle} className="mb-4 border-0 shadow-sm overflow-hidden">
            <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3">
              <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <Icon icon="material-symbols:info-outline" className="text-info" width="20" />
                Qo'shimcha ma'lumotlar
              </h6>
            </Card.Header>
            <ListGroup variant="flush">
              {[
                { label: "Ota-onasi",       value: lead?.parent_name || "Ma'lumot yo'q" },
                { label: "Ota-ona raqami",  value: lead?.parent_phone || "Ma'lumot yo'q" },
                { label: "Kelish manbasi",  value: lead?.source?.name || "Noma'lum" },
                { label: "Izoh",            value: lead?.comment || "Ma'lumot yo'q" },
              ].map(({ label, value }) => (
                <ListGroup.Item key={label} className="bg-transparent border-white border-opacity-10 py-3">
                  <div className="text-white-50 small mb-1">{label}</div>
                  <div className="fw-semibold">{value}</div>
                </ListGroup.Item>
              ))}
              <ListGroup.Item className="bg-transparent border-white border-opacity-10 py-3">
                <div className="text-white-50 small mb-1">Dars kunlari</div>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {lead?.week_days?.length > 0 ? (
                    lead.week_days.map((day, i) => (
                      <Badge key={i} bg="dark" className="border border-white border-opacity-10 fw-normal">
                        {day?.code || day}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-white-50 small">Belgilanmagan</span>
                  )}
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <style>{`
        .timeline-item::after { content: ''; clear: both; display: table; }
      `}</style>
    </div>
  );
};

export default ArchiveLeadDetail;
