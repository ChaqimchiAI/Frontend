import { Card } from "react-bootstrap";
import { Icon } from "@iconify/react";

const StudentProfile = ({
    student,
    currentStudent,
    cardBg,
    textColor,
    setModal 
}) => {
    const balanceValue = Number(currentStudent?.balance || 0);
    const balanceColor = balanceValue < 0 ? "#ef4444" : "#10b981";

    return (
        <Card
            className="border-0 shadow-sm mb-4 text-center p-3 p-sm-4 d-flex flex-column justify-content-between"
            style={{ minHeight: "520px", backgroundColor: cardBg, borderRadius: "15px" }}
        >
            <div className="w-100">
                {/* Rasm va Status */}
                <div className="mb-3 position-relative d-inline-block">
                    <img
                        src={student?.image_preview || student?.image || "/user.jpg"}
                        className="rounded-circle border border-3 p-1"
                        style={{
                            width: "clamp(100px, 15vw, 120px)", // Ekran o'zgarishiga qarab rasm kichrayadi
                            height: "clamp(100px, 15vw, 120px)",
                            objectFit: "cover",
                            borderColor: balanceColor
                        }}
                        alt="Student"
                    />
                </div>

                {/* Ism va Telefon */}
                <h5 className={`mb-1 fw-bold text-truncate ${textColor}`}>
                    {currentStudent?.first_name} {currentStudent?.last_name}
                </h5>
                <p className="small mb-2 fw-medium" style={{ color: "#00d2ff" }}>
                    <Icon icon="solar:phone-bold" className="me-1" />
                    {currentStudent?.phone}
                </p>

                {/* Balans Ko'rinishi */}
                <div className="mb-3 p-2 rounded-3" style={{ background: `${balanceColor}15` }}>
                    <span className="small opacity-75 d-block" style={{ color: textColor }}>Joriy Balans</span>
                    <span className="fw-bold fs-5 text-nowrap" style={{ color: balanceColor }}>
                        {balanceValue.toLocaleString()} <small style={{ fontSize: "12px" }}>UZS</small>
                    </span>
                </div>

                {/* Ma'lumotlar */}
                <div className="text-start mt-3 pt-3 border-top border-secondary border-opacity-10">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Icon icon="solar:map-point-bold-duotone" width="20" style={{ color: "#00d2ff", flexShrink: 0 }} />
                        <span className={`small text-truncate ${textColor}`} title={currentStudent?.address}>
                            {currentStudent?.address || "Manzil ko'rsatilmagan"}
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Icon icon="solar:user-id-bold-duotone" width="20" style={{ color: "#00d2ff", flexShrink: 0 }} />
                        <span className={`small ${textColor}`}>ID: {currentStudent?.id}</span>
                    </div>
                </div>
            </div>

            {/* ── Tugmalar To'plami (Moslashuvchan) ───────────────── */}
            <div className="d-flex flex-column gap-2 mt-auto w-100">
                
                {/* Tepada Kirim/Chiqim (Yonma-yon, kichik ekranda ustma-ust) */}
                <div className="d-flex flex-wrap gap-2 w-100">
                    <button
                        className="btn btn-sm py-2 save-button d-flex align-items-center justify-content-center gap-1"
                        style={{ flex: "1 1 120px", fontSize: "13px", fontWeight: "600" }}
                        onClick={() => setModal("payment")}
                    >
                        <Icon icon="solar:wallet-money-bold" width="18" />
                        To'ldirish
                    </button>

                    <button
                        className="btn btn-sm py-2 d-flex align-items-center justify-content-center gap-1"
                        style={{ 
                            flex: "1 1 120px", 
                            fontSize: "13px", 
                            fontWeight: "600",
                            backgroundColor: "#ef444415", 
                            color: "#ef4444", 
                            border: "1px solid #ef444440",
                            transition: "0.2s"
                        }}
                        onClick={() => setModal("payout")}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#ef444425"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#ef444415"}
                    >
                        <Icon icon="solar:hand-money-bold" width="18" />
                        Qaytarish
                    </button>
                </div>

                {/* Pastda To'lov Yechish (Har doim to'liq kenglikda) */}
                <button
                    className="btn btn-sm py-2 w-100 d-flex justify-content-center align-items-center gap-2"
                    style={{ 
                        backgroundColor: "#ff9800", 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: "8px", 
                        fontWeight: "600",
                        fontSize: "14px",
                        boxShadow: "0 4px 10px rgba(255, 152, 0, 0.2)"
                    }}
                    onClick={() => setModal("withdrawPayment")}
                >
                    <Icon icon="solar:wad-of-money-bold" width="20" />
                    To'lov yechish
                </button>
            </div>
        </Card>
    );
};

export default StudentProfile;