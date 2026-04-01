import { Icon } from "@iconify/react";
import { useTheme } from "../../Context/Context";
import { useDebtorsStudents } from "../../data/queries/billing.queries";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner, Badge, Pagination } from "react-bootstrap";
import DataTable from "../../components/Ui/DataTable";
import StatusDropdown from "../../components/Ui/StatusFilter";

const Debtors = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    // Pagination & Ordering states
    const [page, setPage] = useState(() => Number(localStorage.getItem("debtors_page")) || 1);
    const [ordering, setOrdering] = useState("balance");
    const limit = 20;

    const { data: response, isLoading } = useDebtorsStudents({ ordering, page, limit });

    const debtors = response?.results || [];
    const totalCount = response?.total_debtors || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Sahifa o'zgarganda localStorage'ga saqlash
    useEffect(() => {
        localStorage.setItem("debtors_page", page);
    }, [page]);

    const orderingStatuses = [
        { key: "balance", label: "Qarz: Yuqoridan pastga" },
        { key: "-balance", label: "Qarz: Pastdan yuqoriga" },
    ];

    const formatMoney = (val) => Math.abs(Number(val) || 0).toLocaleString("uz-UZ");

    return (
        <div className="card card-body border-0 shadow-sm" style={{ minHeight: "90vh", borderRadius: "12px" }}>

            {/* ─── HEADER ─── */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ letterSpacing: "-1px" }}>
                        <Icon icon="solar:fire-bold" className="text-danger" />
                        Qarzdorlik Nazorati
                    </h2>
                    <p className="text-muted small mb-0 fw-medium">
                        Jami {totalCount} ta aktiv qarzdorlik holati aniqlangan
                    </p>
                </div>

                <StatusDropdown
                    statuses={orderingStatuses}
                    currentItem={orderingStatuses.find(s => s.key === ordering) || orderingStatuses[0]}
                    setCurrentItem={(item) => { setOrdering(item.key); setPage(1); }}
                    style={{ width: "230px" }}
                />
            </div>

            {/* ─── KPI CARDS ─── */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="p-4 rounded-3 border-0 shadow-sm h-100"
                        style={{ background: !theme ? "#1a1616" : "#fff5f5", borderLeft: "5px solid #dc3545" }}>
                        <span className="text-muted small fw-bold text-uppercase opacity-75">Kutilayotgan umumiy tushum</span>
                        <h1 className="fw-bold text-danger mb-0 mt-2" style={{ fontSize: "2rem", fontVariantNumeric: "tabular-nums" }}>
                            {isLoading ? "..." : formatMoney(response?.total_debt_sum)} <small className="fs-6">UZS</small>
                        </h1>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-4 rounded-3 border-0 shadow-sm h-100"
                        style={{ background: !theme ? "#111827" : "#f0f9ff", borderLeft: "5px solid #0d6efd" }}>
                        <span className="text-muted small fw-bold text-uppercase opacity-75">Qarzdor o'quvchilar</span>
                        <div className="d-flex align-items-center gap-3 mt-2">
                            <h1 className="fw-bold mb-0 text-primary" style={{ fontSize: "2rem" }}>{totalCount}</h1>
                            <Badge bg="primary" className="px-2 py-1 text-uppercase" style={{ fontSize: "10px" }}>Nafar</Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── DATA TABLE ─── */}
            {isLoading ? (
                <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>
            ) : (
                <>
                    <div className="table-responsive" style={{ border: `1px solid ${!theme ? '#2d2d2d' : '#eee'}`, borderRadius: "8px" }}>
                        <DataTable
                            data={debtors}
                            columns={["№", "O'quvchi / ID", "Aloqa / Filial", "Qarzdorlik miqdori", ""]}
                            searchKeys={["first_name", "last_name", "phone", "branch_name"]}
                            pagination={false} // DataTable ichki tugmalarini o'chirib tashlaymiz
                        >
                            {(currentData) =>
                                currentData.map((debtor, index) => {
                                    const bal = Math.abs(Number(debtor.balance));
                                    const isCritical = bal >= 1000000;
                                    const fullName = `${debtor.first_name} ${debtor.last_name}`;

                                    return (
                                        <tr
                                            key={debtor.id}
                                            className="align-middle debtor-row"
                                            style={{
                                                cursor: "pointer",
                                                borderBottom: `1px solid ${theme ? '#f1f1f1' : '#262626'}`,
                                                fontSize: "13px"
                                            }}
                                            onClick={() => navigate(`/students/${debtor.id}`)}
                                        >
                                            <td className="text-muted ps-4" style={{ width: "50px", fontSize: "11px" }}>
                                                {(page - 1) * limit + index + 1}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2 py-1">
                                                    <div className="rounded-3 d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                                        style={{
                                                            width: "32px", height: "32px",
                                                            background: isCritical ? "#dc354515" : "#0d6efd10",
                                                            color: isCritical ? "#dc3545" : "#0d6efd",
                                                            border: `1px solid ${isCritical ? '#dc354530' : '#0d6efd30'}`,
                                                            fontSize: "12px"
                                                        }}>
                                                        {debtor.first_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold mb-0 text-truncate" style={{ maxWidth: "160px" }}>
                                                            {fullName}
                                                        </div>
                                                        <div className="text-muted" style={{ fontSize: "10px", opacity: 0.7 }}>
                                                            ID: #{debtor.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-medium mb-0" style={{ fontSize: "12px" }}>{debtor.phone || "—"}</div>
                                                <div className="text-muted" style={{ fontSize: "10px" }}>{debtor.branch_name}</div>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-danger" style={{ fontVariantNumeric: "tabular-nums", fontSize: "14px" }}>
                                                    -{formatMoney(debtor.balance)}
                                                </div>
                                                {isCritical && (
                                                    <Badge bg="danger" className="fw-bold" style={{ fontSize: '8px', padding: "2px 5px" }}>
                                                        KRITIK
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="pe-4 text-end">
                                                <Icon icon="solar:alt-arrow-right-linear" className="text-muted opacity-25" width="16" />
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </DataTable>
                    </div>

                    {/* ─── PROFESSIONAL CUSTOM PAGINATION ─── */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                            <div className="text-muted small">
                                Ko'rsatilyapti: <b>{(page - 1) * limit + 1} - {Math.min(page * limit, totalCount)}</b> (Jami {totalCount})
                            </div>
                            <Pagination className="custom-debt-pagination mb-0">
                                <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
                                <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} />
                                
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    // Faqat kerakli sahifalarni ko'rsatish (Logic)
                                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                                        return (
                                            <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
                                                {p}
                                            </Pagination.Item>
                                        );
                                    }
                                    if (p === page - 2 || p === page + 2) return <Pagination.Ellipsis key={p} disabled />;
                                    return null;
                                })}

                                <Pagination.Next disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                                <Pagination.Last disabled={page === totalPages} onClick={() => setPage(totalPages)} />
                            </Pagination>
                        </div>
                    )}
                </>
            )}

            <style>
                {`
                    .debtor-row:hover {
                        background: ${theme ? "#f8f9fa" : "#1a1d21"} !important;
                    }
                    /* Custom Pagination Styles */
                    .custom-debt-pagination .page-link {
                        background: transparent;
                        border: 1px solid ${theme ? '#dee2e6' : '#333'};
                        color: ${theme ? '#000' : '#fff'};
                        margin: 0 2px;
                        border-radius: 6px;
                        padding: 6px 12px;
                        font-size: 13px;
                    }
                    .custom-debt-pagination .page-item.active .page-link {
                        background: #dc3545 !important;
                        border-color: #dc3545 !important;
                        color: #fff !important;
                        box-shadow: 0 4px 10px rgba(220, 53, 69, 0.2);
                    }
                    .custom-debt-pagination .page-item.disabled .page-link {
                        opacity: 0.3;
                    }
                `}
            </style>
        </div>
    );
};

export default Debtors;