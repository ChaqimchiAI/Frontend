import { Table, Dropdown, Button } from "react-bootstrap";

const StudentDiscounts = ({
    currentStudent,
    setShowAddDiscount,
    textColor,
    statusStyle,
    openDropdown,
    setOpenDropdown,
    statusChange
}) => {
    return (
        <div style={{ width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="mb-0 fw-bold">Chegirmalar</h6>
                <Button
                    className="btn btn-sm save-button"
                    onClick={() => setShowAddDiscount(true)}
                >
                    Chegirma qo'shish
                </Button>
            </div>

            {currentStudent?.discounts?.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-ticket-perforated fs-1 text-muted mb-3"></i>
                    <p className="text-muted">Bu o'quvchi uchun hali chegirma qo'shilmagan</p>
                </div>
            ) : (
                <Table borderless className={`${textColor}`} style={{ overflow: "visible" }}>
                    <thead>
                        <tr className="border-bottom border-secondary border-opacity-25 opacity-50 small">
                            <th>Summa</th>
                            <th>Muddat</th>
                            <th>Izoh</th>
                            <th>Sana</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudent?.discounts?.map((discount, index) => (
                            <tr key={index} className="border-bottom border-secondary border-opacity-10">
                                <td>{Number(discount.amount).toLocaleString("uz-UZ")}</td>
                                <td>{discount.total_uses} oy</td>
                                <td className="small">{discount.comment}</td>
                                <td>{discount.created_at?.split("T")[0].split("-").reverse().join(".") || "-"}</td>
                                <td>
                                    <Dropdown
                                        show={openDropdown === index}
                                        onToggle={() => setOpenDropdown(openDropdown === index ? null : index)}
                                        onClick={(e) => e.stopPropagation()}
                                        align="end"
                                    >
                                        <Dropdown.Toggle
                                            className="no-caret"
                                            style={{ background: "transparent", border: "none" }}
                                        >
                                            <div
                                                style={{
                                                    padding: "3px 7px",
                                                    borderRadius: "15px",
                                                    background: statusStyle(discount?.is_active)?.style?.background || "gray",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "white",
                                                    cursor: "pointer",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                {statusStyle(discount?.is_active)?.t || "No Status"}
                                            </div>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {[
                                                { k: true, label: "Faol", c: "#01df31" },
                                                { k: false, label: "Faol emas", c: "#ef4444" }
                                            ].map(o => (
                                                <Dropdown.Item
                                                    key={o.k}
                                                    onClick={() => statusChange(o.k, discount?.id)}
                                                    className="no-hover-effect"
                                                    style={{ padding: "5px 10px" }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#fff",
                                                            fontWeight: "500",
                                                            padding: "3px 7px",
                                                            borderRadius: "15px",
                                                            background: o.c,
                                                            fontSize: "12px"
                                                        }}
                                                    >
                                                        {o.label}
                                                    </span>
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default StudentDiscounts;
