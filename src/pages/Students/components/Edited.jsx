import { Button, Col, Row, Spinner } from "react-bootstrap"
import { Input } from "../../../components/Ui/Input"

const Edited = ({
    student,
    handleChange,
    setDeleteStudent,
    handleSaveStudent,
    updatingStudent,
    theme,
    textColor
}) => {
    return (
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
    )
}

export default Edited