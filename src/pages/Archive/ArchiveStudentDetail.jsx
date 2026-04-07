import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button, Nav } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useStudent } from "../../data/queries/students.queries";
import { useTheme } from "../../Context/Context";
import { useGroups } from "../../data/queries/group.queries";
import { useCourses } from "../../data/queries/courses.queries";
import StudentsGroups from "../Students/components/StudentsGroups";
import StudentAttendances from "../Students/components/Details/StudentAttendances";
import StudentDiscounts from "../Students/components/Details/StudentDiscounts";
import StudentTransactions from "../Students/components/Details/StudentTransactions";

const ArchiveStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { data: currentStudent, isLoading, error } = useStudent(id);
  const { data: groupsData } = useGroups();
  const { data: courses } = useCourses();
  const coursesData = courses?.results;

  const [activeTab, setActiveTab] = useState("profile");

  const [totalToPay, setTotalToPay] = useState(0);
  const [remainingLessons, setRemainingLessons] = useState(0);

  useEffect(() => {
    const allGroups = groupsData?.results || groupsData;
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const lastDate = new Date(year, month + 1, 0).getDate();

    if (Array.isArray(allGroups) && coursesData && currentStudent?.groups) {
      const dayMap = {
        'dushanba': 1, 'Du': 1, 'seshanba': 2, 'Se': 2,
        'chorshanba': 3, 'Cho': 3, 'payshanba': 4, 'Pay': 4,
        'juma': 5, 'Ju': 5, 'shanba': 6, 'Sha': 6, 'yakshanba': 0, 'Ya': 0
      };
      let totalCoursePrice = 0;
      let totalLessonsThisMonth = 0;
      let balance = Number(currentStudent.balance?.split?.(".")?.[0] || currentStudent.balance || 0);

      currentStudent.groups.forEach(studentGroup => {
        const foundGroup = allGroups.find(g => g.id === studentGroup.group_id);
        if (foundGroup) {
          const foundCourse = coursesData.find(c => c.course === foundGroup.course || c.name === foundGroup.course_name);
          if (foundCourse) {
            const price = Number(foundCourse.price?.split?.(".")?.[0] || foundCourse.price || 0);
            totalCoursePrice += price;
            if (foundGroup?.schedule_items?.active?.length > 0) {
              const lastActive = foundGroup.schedule_items.active.at(-1);
              if (lastActive?.days_of_week) {
                const dayIndices = lastActive.days_of_week.map(d => dayMap[d.code]);
                let count = 0;
                for (let i = 1; i <= lastDate; i++) {
                  if (dayIndices.includes(new Date(year, month, i).getDay())) count++;
                }
                totalLessonsThisMonth += count;
              }
            }
          }
        }
      });

      const debt = totalCoursePrice - balance;
      setTotalToPay(debt > 0 ? debt : 0);
      const lessonPrice = totalCoursePrice > 0 ? totalCoursePrice / (totalLessonsThisMonth || 12) : 0;
      setRemainingLessons(lessonPrice > 0 ? Math.floor(balance / lessonPrice) : 0);
    }
  }, [groupsData, coursesData, currentStudent]);

  const cardBg = !theme ? "#15263a" : "#f6f9fb";
  const textColor = !theme ? "text-white" : "text-black";
  const balanceValue = Number(currentStudent?.balance || 0);
  const balanceColor = balanceValue < 0 ? "#ef4444" : "#10b981";

  const TABS = [
    { key: "profile",     label: "Profil",        icon: "solar:user-id-bold" },
    { key: "guruhlar",    label: "Guruhlar",       icon: "solar:users-group-two-rounded-bold" },
    { key: "davomat",     label: "Davomat",        icon: "solar:calendar-mark-bold" },
    { key: "chegirma",    label: "Chegirma",       icon: "solar:tag-price-bold" },
    { key: "to'lovlar",   label: "To'lovlar tarixi", icon: "solar:bill-list-bold" },
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

            {/* Balance */}
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
              <div className="d-flex align-items-center gap-2">
                <Icon icon="solar:user-id-bold-duotone" width="18" style={{ color: "#00d2ff" }} />
                <span className={`small ${textColor}`}>ID: {currentStudent?.id}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="d-flex gap-2 flex-wrap mt-3 pt-3 border-top border-secondary border-opacity-10">
              <span className="badge py-2 px-2 fw-normal text-white" style={{ backgroundColor: "#0085db", fontSize: "12px" }}>
                Qolgan darslar: {remainingLessons}
              </span>
              <span className="badge py-2 px-2 fw-normal text-white" style={{ backgroundColor: "#0085db", fontSize: "12px" }}>
                To'lanishi kerak: {Number(totalToPay).toLocaleString("uz-UZ")}
              </span>
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
                    style={{ fontSize: "14px" }}
                  >
                    {label}
                  </Nav.Link>
                ))}
              </Nav>
            </div>
            <Card.Body className="p-4 mt-2">
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
                  <div className="mt-3 p-3 rounded-3" style={{ background: !theme ? "#1a2d45" : "#fff", border: "1px solid #dee2e6" }}>
                    <span className="text-muted small d-block mb-1">Arxiv sababi (tizim statusi)</span>
                    <span className={`fw-medium ${textColor}`}>Arxivlangan</span>
                  </div>
                </div>
              )}
              {activeTab === "guruhlar" && (
                <StudentsGroups student={currentStudent} theme={theme} textColor={textColor} navigate={navigate} />
              )}
              {activeTab === "davomat" && (
                <StudentAttendances textColor={textColor} />
              )}
              {activeTab === "chegirma" && (
                <StudentDiscounts
                  currentStudent={currentStudent}
                  setShowAddDiscount={() => {}}
                  textColor={textColor}
                  statusStyle={() => {}}
                  openDropdown={null}
                  setOpenDropdown={() => {}}
                  statusChange={() => {}}
                  readOnly
                />
              )}
              {activeTab === "to'lovlar" && (
                <StudentTransactions studentId={id} textColor={textColor} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ArchiveStudentDetail;
