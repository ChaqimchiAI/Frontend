import { Button, Col, Row, Spinner, Image } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Input } from "../../../components/Ui/Input";

const Edited = ({
    student,
    handleChange,
    setDeleteStudent,
    handleSaveStudent,
    updatingStudent,
    theme,
    textColor
}) => {

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleChange("image", file);
            // Preview yaratish
            const previewUrl = URL.createObjectURL(file);
            handleChange("image_preview", previewUrl);
        }
    };

    // Rasm manbasini aniqlash: Yangi tanlangan preview yoki serverdagi eski rasm
    const currentImage = student?.image_preview || student?.image;

    return (
        <Row className="gy-4">
            {/* --- Rasm Preview Bo'limi --- */}
            <Col md={12} className="d-flex align-items-center gap-4 mb-2">
                <div 
                    style={{ 
                        width: "100px", 
                        height: "100px", 
                        borderRadius: "15px", 
                        overflow: "hidden", 
                        border: `2px solid ${!theme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        background: !theme ? "#15263a" : "#f1f1f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {currentImage ? (
                        <Image 
                            src={currentImage} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                    ) : (
                        <Icon icon="solar:user-broken" width="40" className="opacity-25" />
                    )}
                </div>
                <div>
                    <label className={`form-label fw-bold mb-1 ${textColor}`} style={{ cursor: 'pointer' }}>
                        <div className="btn btn-sm btn-outline-primary px-3">
                            <Icon icon="solar:camera-add-bold" className="me-2" />
                            Rasm tanlash
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </label>
                    <p className="text-muted small mb-0">PNG, JPG yoki JPEG (max 2MB)</p>
                </div>
            </Col>

            {/* --- Ma'lumotlar --- */}
            <Col md={4}>
                <Input label="Ism" value={student?.first_name || ""} onChange={(e) => handleChange("first_name", e.target.value)} />
            </Col>
            <Col md={4}>
                <Input label="Familiya" value={student?.last_name || ""} onChange={(e) => handleChange("last_name", e.target.value)} />
            </Col>
            <Col md={4}>
                <Input label="Telefon raqam" value={student?.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
            </Col>
            
            <Col md={4}>
                <Input label="Sharifi (Otasining ismi)" value={student?.middle_name || ""} onChange={(e) => handleChange("middle_name", e.target.value)} />
            </Col>
            <Col md={4}>
                <Input label="Tug'ilgan sanasi" type="date" value={student?.date_of_birth || ""} onChange={(e) => handleChange("date_of_birth", e.target.value)} />
            </Col>
            
            <Col md={4}>
                <Input label="Manzil" value={student?.address || ""} onChange={(e) => handleChange("address", e.target.value)} />
            </Col>

            <Col md={6}>
                <Input label="Ota-onasining ismi" placeholder="Ism..." value={student?.parent_name || ""} onChange={(e) => handleChange("parent_name", e.target.value)} />
            </Col>
            <Col md={6}>
                <Input label="Ota-onasining telefoni" value={student?.parent_phone || ""} onChange={(e) => handleChange("parent_phone", e.target.value)} />
            </Col>
            
            <Col md={12}>
                <label className={`form-label fw-bold ${textColor}`}>Izoh</label>
                <textarea
                    className={`form-control ${!theme ? "bg-dark text-white border-secondary" : ""}`}
                    rows="3"
                    value={student?.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    style={{ borderRadius: "10px" }}
                />
            </Col>

            <div className="mt-5 d-flex justify-content-end gap-2">
                <Button 
                    variant="outline-danger" 
                    className="btn btn-sm px-4 py-2 fw-bold border-0" 
                    style={{ background: "rgba(220, 53, 69, 0.1)" }}
                    onClick={() => setDeleteStudent(true)}
                >
                    O'quvchini o'chirish
                </Button>
                <Button
                    className={`btn btn-sm save-button px-5 ${!student?.save ? 'opacity-50' : ''}`}
                    onClick={handleSaveStudent}
                    disabled={!student?.save || updatingStudent}
                >
                    {updatingStudent ? <Spinner animation="border" size="sm" /> : "O'zgarishlarni saqlash"}
                </Button>
            </div>
        </Row>
    )
}

export default Edited;