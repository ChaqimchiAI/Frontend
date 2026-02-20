import { Row, Col, Card, Badge } from "react-bootstrap";

const StudentStats = ({
    nextClassDates,
    remainingLessons,
    totalToPay,
    currentStudent,
    textColor,
    btnColor,
    cardBg
}) => {
    return (
        <Card className="border-0 mb-4 p-4" style={{ backgroundColor: cardBg }}>
            <Row className="align-items-center gy-3">
                <Col md={5} className="border-end border-secondary border-opacity-25">
                    <p className={`mb-3 ${textColor}`}>Balans amal qilish muddati</p>
                    <div className="d-flex gap-2 flex-wrap">
                        {nextClassDates.length > 0 ? nextClassDates.map((item, idx) => (
                            <span
                                key={idx}
                                className={`badge rounded-pill fw-normal border ${item.isPaid ? 'border-info' : 'border-danger'}`}
                                style={{
                                    fontSize: "11px",
                                    color: item.isPaid ? "#00d2ff" : "#ff4d4d",
                                    backgroundColor: item.isPaid ? "rgba(0, 210, 255, 0.1)" : "rgba(255, 77, 77, 0.1)"
                                }}
                                title={item.isPaid ? "Yetarli balans" : "Balans yetarli emas"}
                            >
                                {item.day}
                            </span>
                        )) : (
                            <span className="small text-muted opacity-50">Dars kunlari belgilanmagan</span>
                        )}
                    </div>
                </Col>
                <Col md={7}>
                    <div className="d-flex gap-2 flex-wrap ms-md-3">
                        <Badge className="py-2 px-3 fw-normal" style={{ backgroundColor: btnColor, color: "#fff" }}>
                            Qolgan darslar: {remainingLessons}
                        </Badge>
                        <Badge className="py-2 px-3 fw-normal" style={{ backgroundColor: btnColor, color: "#fff" }}>
                            To'lanishi kerak: {Number(totalToPay).toLocaleString("uz-UZ")}
                        </Badge>
                        <Badge className="py-2 px-3 fw-normal" style={{ backgroundColor: btnColor, color: "#fff" }}>
                            Balans: {Number(currentStudent?.balance).toLocaleString("uz-UZ") || "0.00"}
                        </Badge>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default StudentStats;
