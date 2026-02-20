import { Icon } from "@iconify/react";
import { useTheme } from "../../Context/Context";
import { useDebtorsStudents } from "../../data/queries/billing.queries";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import DataTable from "../../components/Ui/DataTable";

const Debtors = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [ordering, setOrdering] = useState("balance");
    const { data: response, isLoading } = useDebtorsStudents({ ordering });

    const debtors = response?.results || [];

    // Umumiy qarz summasi
    const totalDebt = useMemo(() => {
        if (!debtors || !Array.isArray(debtors)) return 0;
        return debtors.reduce((sum, d) => sum + Math.abs(Math.min(d.balance || 0, 0)), 0);
    }, [debtors]);

    const formatMoney = (val) => {
        return Math.abs(val || 0).toLocaleString("uz-UZ");
    };

    const getDebtLevel = (balance) => {
        const debt = Math.abs(balance || 0);
        if (debt >= 1000000) return { color: "#ef4444", bg: "#ef444415", label: "Yuqori" };
        if (debt >= 500000) return { color: "#f59e0b", bg: "#f59e0b15", label: "O'rta" };
        return { color: "#f97316", bg: "#f9731615", label: "Past" };
    };

    return (
        <div className="card card-body" style={{ minHeight: "100vh" }}>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "8px",
                                background: "#ef444418",
                            }}
                        >
                            <Icon icon="ph:warning-duotone" width="22" height="22" style={{ color: "#ef4444" }} />
                        </span>
                        <h3 className="fw-bold mb-0">Qarzdor o'quvchilar</h3>
                    </div>
                    <p className="text-muted mb-0 ms-1" style={{ fontSize: "13px" }}>
                        Balansida qarz mavjud bo'lgan o'quvchilar ro'yxati
                    </p>
                </div>
            </div>

            {/* Statistika kartochkalari */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                    <div
                        className="p-3 rounded-4 d-flex align-items-center gap-3"
                        style={{
                            background: !theme ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.05)",
                            border: `1px solid ${!theme ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)"}`,
                        }}
                    >
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: "48px", height: "48px", borderRadius: "14px",
                                background: "#ef444415", border: "1px solid #ef444420",
                            }}
                        >
                            <Icon icon="ph:currency-dollar-duotone" fontSize={26} style={{ color: "#ef4444" }} />
                        </div>
                        <div>
                            <p className="text-muted mb-0 small fw-semibold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                                Umumiy qarz
                            </p>
                            <h4 className="fw-bold mb-0" style={{ color: "#ef4444" }}>
                                {isLoading ? "..." : formatMoney(totalDebt)} so'm
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div
                        className="p-3 rounded-4 d-flex align-items-center gap-3"
                        style={{
                            background: !theme ? "rgba(249, 115, 22, 0.08)" : "rgba(249, 115, 22, 0.05)",
                            border: `1px solid ${!theme ? "rgba(249, 115, 22, 0.15)" : "rgba(249, 115, 22, 0.1)"}`,
                        }}
                    >
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: "48px", height: "48px", borderRadius: "14px",
                                background: "#f9731615", border: "1px solid #f9731620",
                            }}
                        >
                            <Icon icon="ph:users-duotone" fontSize={26} style={{ color: "#f97316" }} />
                        </div>
                        <div>
                            <p className="text-muted mb-0 small fw-semibold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                                Qarzdorlar soni
                            </p>
                            <h4 className={`fw-bold mb-0 ${!theme ? "text-white" : "text-dark"}`}>
                                {isLoading ? "..." : (debtors?.length || 0)} ta
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* DataTable */}
            {isLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-3">Ma'lumotlar yuklanmoqda...</p>
                </div>
            ) : (
                <DataTable
                    data={debtors}
                    columns={["№", "O'quvchi", "Telefon", "Balans", "Harakat"]}
                    searchKeys={["first_name", "last_name", "phone"]}
                    filter={
                        <select
                            className="form-select"
                            value={ordering}
                            onChange={(e) => setOrdering(e.target.value)}
                            style={{ width: "auto", minWidth: "180px" }}
                        >
                            <option value="balance">Qarz: Katta → Kichik</option>
                            <option value="-balance">Qarz: Kichik → Katta</option>
                        </select>
                    }
                >
                    {(currentData) =>
                        currentData.length > 0 ? currentData.map((debtor, index) => {
                            const level = getDebtLevel(debtor.balance);
                            return (
                                <tr key={debtor.id || index} className="cursor-pointer">
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-circle"
                                                style={{
                                                    width: "36px", height: "36px",
                                                    background: level.bg,
                                                    border: `1px solid ${level.color}30`,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Icon icon="ph:user-duotone" fontSize={18} style={{ color: level.color }} />
                                            </div>
                                            <span className="fw-semibold">{debtor.first_name} {debtor.last_name}</span>
                                        </div>
                                    </td>
                                    <td className="text-muted">{debtor.phone || "—"}</td>
                                    <td>
                                        <span className="fw-bold" style={{ color: "#ef4444" }}>
                                            -{formatMoney(debtor.balance)} so'm
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm rounded-3 d-inline-flex align-items-center gap-1"
                                            style={{
                                                background: !theme ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.08)",
                                                color: "#3b82f6",
                                                border: "1px solid rgba(59, 130, 246, 0.2)",
                                                padding: "6px 14px", fontSize: "13px",
                                            }}
                                            onClick={() => navigate(`/students/${debtor.id}`)}
                                        >
                                            <Icon icon="ph:eye-duotone" fontSize={16} />
                                            Ko'rish
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-muted">
                                    Qarzdor o'quvchilar yo'q
                                </td>
                            </tr>
                        )
                    }
                </DataTable>
            )}
        </div>
    );
};

export default Debtors;
