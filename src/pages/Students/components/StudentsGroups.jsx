import { Icon } from "@iconify/react"
import { Col, Row } from "react-bootstrap"

const StudentsGroups = ({
    student,
    theme,
    textColor,
    navigate
}) => {
    return (
        <Row className="gy-3">
            {student?.groups?.length > 0 ? (
                student.groups.map((group) => (
                    <Col md={6} xl={4} key={group.group_id}>
                        <div
                            className="p-3 rounded-4 border border-primary border-opacity-10 d-flex align-items-center gap-3 transition-all hover-shadow cursor-pointer"
                            style={{
                                backgroundColor: !theme ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 133, 219, 0.03)",
                            }}
                            onClick={() => navigate(`/groups/${group.group_id}`)}
                        >
                            <div className="flex-grow-1 min-w-0">
                                <h6 className={`mb-1 text-truncate ${textColor}`} title={group.group_name}>
                                    {group.group_name}
                                </h6>
                                <div className="d-flex align-items-center gap-2">
                                    <span
                                        className="rounded-circle"
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            backgroundColor: group.status === "active" ? "#198754" : "#dc3545"
                                        }}
                                    ></span>
                                    <span className="small opacity-75" style={{ color: textColor }}>
                                        {group.status === "active" ? "Faol" : "Faol emas"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))
            ) : (
                <Col xs={12}>
                    <div className="text-center py-5 opacity-50">
                        <Icon icon="fluent:Layer-24-regular" width="48" className="mb-2" />
                        <p>Guruhlar topilmadi</p>
                    </div>
                </Col>
            )}
        </Row>
    )
}

export default StudentsGroups