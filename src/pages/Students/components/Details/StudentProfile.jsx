import { Card } from "react-bootstrap";
import { Icon } from "@iconify/react";

const StudentProfile = ({
    student,
    currentStudent,
    cardBg,
    textColor,
    setModal
}) => {
    return (
        <Card
            className="border-0 shadow-sm mb-4 text-center p-4 d-flex flex-column justify-content-between"
            style={{ height: "500px", backgroundColor: cardBg }}
        >
            <div className="">
                <div className="mb-3 position-relative">
                    <img
                        src={student?.image || "/user.jpg"}
                        className="rounded-circle border border-2 border-info p-1"
                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                    {currentStudent?.is_active && (
                        <span
                            className="position-absolute bottom-0 translate-middle p-2 bg-success border border-light rounded-circle"
                            style={{ left: "65%" }}
                        ></span>
                    )}
                </div>
                <h5 className={`mb-1 ${textColor}`}>{currentStudent?.first_name}</h5>
                <p className="small mb-4" style={{ color: "#00d2ff" }}>{currentStudent?.phone}</p>

                <div className="text-start mt-3 pt-3 border-top border-secondary border-opacity-25">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Icon icon="fluent:location-24-regular" style={{ color: "#00d2ff" }} />
                        <span className={`small ${textColor}`}>{currentStudent?.address || "Farg'ona, Qo'qon shahri"}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Icon icon="fluent:person-24-regular" style={{ color: "#00d2ff" }} />
                        <span className={`small ${textColor}`}>ID: {currentStudent?.id}</span>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-sm fs-2 px-3 py-2 delete-button"
                    onClick={() => setModal("withdraw")}
                >
                    <Icon icon="ri:refund-2-fill" fontSize={20} className="me-1" />
                    Pul qaytarish
                </button>

                <button
                    className="btn btn-sm fs-2 px-3 py-2 save-button"
                    onClick={() => setModal("payment")}
                >
                    <Icon icon="ion:wallet-outline" fontSize={20} className="me-1" />
                    To'lov qilish
                </button>
            </div>
        </Card>
    );
};

export default StudentProfile;
