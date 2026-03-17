import { useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useStudentTransactions } from "../../../../data/queries/payments.queries";
import Pagination from "@mui/material/Pagination";

const StudentTransactions = ({ studentId, textColor, setShowPaymentModal }) => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
    });

    // Backend'dan ma'lumot olish
    const { data, isLoading, error } = useStudentTransactions(studentId, filters);
    const transactions = data?.results || [];
    const totalCount = data?.count || 0;

    const getTransactionStyle = (type) => {
        switch (type) {
            case 'cash': return { label: "Naqd", bg: "#10b981", icon: "solar:wad-of-money-bold" };
            case 'card': return { label: "Karta", bg: "#3b82f6", icon: "solar:card-2-bold" };
            case 'withdraw': return { label: "Yechildi", bg: "#ef4444", icon: "solar:minus-circle-bold" };
            case 'refund': return { label: "Qaytarildi", bg: "#f59e0b", icon: "solar:re-delivery-bold" };
            default: return { label: type, bg: "gray", icon: "solar:help-bold" };
        }
    };

    if (isLoading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <div className="text-danger text-center py-3">Ma'lumotlarni yuklashda xatolik yuz berdi.</div>;

    return (
        <div style={{ width: "100%" }}>
            {transactions.length === 0 ? (
                <div className="text-center py-5 opacity-50">
                    <Icon icon="solar:bill-list-broken" width="48" className="mb-3" />
                    <p>Hozircha moliyaviy amallar mavjud emas</p>
                </div>
            ) : (
                <>
                    <Table borderless className={`${textColor} align-middle`}>
                        <thead>
                            <tr className="border-bottom border-secondary border-opacity-25 opacity-50 small">
                                <th>Turi</th>
                                <th>Summa</th>
                                <th>Balans (Keyin)</th>
                                <th>Izoh / Guruh</th>
                                <th>Sana</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => {
                                const style = getTransactionStyle(t.type);
                                return (
                                    <tr key={t.id} className="border-bottom border-secondary border-opacity-10">
                                        <td>
                                            <div style={{
                                                padding: "3px 10px", borderRadius: "15px", background: style.bg,
                                                display: "inline-flex", alignItems: "center", gap: "5px",
                                                color: "white", fontSize: "11px", fontWeight: "500"
                                            }}>
                                                <Icon icon={style.icon} width="14" />
                                                {style.label}
                                            </div>
                                        </td>
                                        <td className={`fw-bold ${t.type === 'withdraw' ? 'text-danger' : 'text-success'}`}>
                                            {t.type === 'withdraw' ? '-' : '+'}{Number(t.amount).toLocaleString()}
                                        </td>
                                        <td className="text-muted small">{Number(t.balance_after).toLocaleString()} UZS</td>
                                        <td>
                                            <div style={{ fontSize: "13px" }}>{t.comment || "—"}</div>
                                            {t.group_name && <div className="text-muted small italic opacity-75">{t.group_name}</div>}
                                        </td>
                                        <td className="text-muted small">
                                            {t.created_at ? new Date(t.created_at).toLocaleString('uz-UZ').replace(',', ' |') : "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-end mt-3">
                        <Pagination
                            count={Math.ceil(totalCount / filters.limit)}
                            page={filters.page}
                            onChange={(e, v) => setFilters(prev => ({ ...prev, page: v }))}
                            size="small"
                            color="primary"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentTransactions;