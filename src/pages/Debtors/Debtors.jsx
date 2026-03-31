import { Icon } from "@iconify/react";
import { useTheme } from "../../Context/Context";
import { useDebtorsStudents } from "../../data/queries/billing.queries";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner, Badge } from "react-bootstrap";
import DataTable from "../../components/Ui/DataTable";
import StatusDropdown from "../../components/Ui/StatusFilter";

const Debtors = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [ordering, setOrdering] = useState("balance");
    
    // Hamma ma'lumotni bittada olish uchun limitni oshiramiz
    const { data: response, isLoading } = useDebtorsStudents({ 
        ordering, 
        limit: 1000 // Jami 125 ta bo'lsa, 1000 hammasini olib keladi
    });

    const orderingStatuses = [
        { key: "balance", label: "Qarz: Katta → Kichik" },
        { key: "-balance", label: "Qarz: Kichik → Katta" },
    ];

    // Backend yangi strukturasi: data.data ichida to'g'ridan-to'g'ri results va statistikalar
    const debtors = response?.results || [];
    const totalDebtSum = response?.total_debt_sum || 0; // Backenddan tayyor kelgan summa
    const totalDebtorsCount = response?.total_debtors || 0; // Backenddan tayyor kelgan soni

    const formatMoney = (val) => {
        return Math.abs(Number(val) || 0).toLocaleString("uz-UZ");
    };

    const getDebtLevel = (balance) => {
        const debt = Math.abs(Number(balance) || 0);
        if (debt >= 1000000) return { color: "#ef4444", bg: "#ef444415", label: "Yuqori" };
        if (debt >= 500000) return { color: "#f59e0b", bg: "#f59e0b15", label: "O'rta" };
        return { color: "#f97316", bg: "#f9731615", label: "Past" };
    };

    return (
        <div className="card card-body border-0 shadow-sm" style={{ minHeight: "100vh", borderRadius: "16px" }}>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        <Icon icon="solar:danger-circle-bold-duotone" className="text-danger" width="32" />
                        Qarzdorlar Nazorati
                    </h3>
                    <p className="text-muted small mb-0">Tizimdagi barcha qarzdor o'quvchilarning umumiy hisoboti</p>
                </div>

                <StatusDropdown
                    statuses={orderingStatuses}
                    currentItem={orderingStatuses.find(s => s.key === ordering) || orderingStatuses[0]}
                    setCurrentItem={(item) => setOrdering(item.key)}
                    style={{ width: "220px" }}
                />
            </div>

            {/* Statistika Kartalari (Backenddan kelgan tayyor ma'lumotlar bilan) */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                    <div className="p-3 rounded-4 border d-flex align-items-center gap-3" 
                         style={{ background: !theme ? "#1a1616" : "#fff5f5", borderColor: "#ef444430" }}>
                        <div className="p-3 rounded-3 bg-danger text-white d-flex shadow-sm">
                            <Icon icon="solar:hand-money-bold-duotone" fontSize={28} />
                        </div>
                        <div>
                            <p className="text-muted mb-0 small fw-bold text-uppercase" style={{ fontSize: "10px" }}>Umumiy kutilayotgan tushum</p>
                            <h3 className="fw-bold mb-0 text-danger" style={{ fontVariantNumeric: "tabular-nums" }}>
                                {isLoading ? "..." : formatMoney(totalDebtSum)} <small className="fs-6 fw-normal">so'm</small>
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="p-3 rounded-4 border d-flex align-items-center gap-3"
                         style={{ background: !theme ? "#111827" : "#f0f9ff", borderColor: "#0ea5e930" }}>
                        <div className="p-3 rounded-3 bg-primary text-white d-flex shadow-sm">
                            <Icon icon="solar:users-group-rounded-bold-duotone" fontSize={28} />
                        </div>
                        <div>
                            <p className="text-muted mb-0 small fw-bold text-uppercase" style={{ fontSize: "10px" }}>Qarzdorlar soni</p>
                            <h3 className="fw-bold mb-0 text-primary">
                                {isLoading ? "..." : totalDebtorsCount} <small className="fs-6 fw-normal">nafar</small>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* DataTable */}
            {isLoading ? (
                <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>
            ) : (
                <DataTable
                    data={debtors}
                    columns={["№", "O'quvchi", "Telefon", "Filial", "Balans", "Amal"]}
                    searchKeys={["full_name", "phone", "branch_name"]}
                >
                    {(currentData) =>
                        currentData.map((debtor, index) => {
                            const level = getDebtLevel(debtor.balance);
                            return (
                                <tr key={debtor.id || index} className="align-middle border-bottom border-light">
                                    <td className="text-muted">{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                                 style={{ width: "35px", height: "35px", background: level.bg, color: level.color, fontSize: '12px' }}>
                                                {debtor.full_name?.[0] || "S"}
                                            </div>
                                            <div className="fw-bold">{debtor.full_name}</div>
                                        </div>
                                    </td>
                                    <td className="text-muted small">{debtor.phone || "—"}</td>
                                    <td>
                                        <Badge bg="secondary" className="bg-opacity-10 text-secondary fw-normal border">
                                            {debtor.branch_name}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="fw-bold text-danger" style={{ fontVariantNumeric: "tabular-nums" }}>
                                            -{formatMoney(debtor.balance)} so'm
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-light border" 
                                            style={{ borderRadius: '8px' }}
                                            onClick={() => navigate(`/students/${debtor.id}`)}
                                        >
                                            <Icon icon="solar:userId-bold-duotone" className="me-1" /> Profil
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </DataTable>
            )}
        </div>
    );
};

export default Debtors;