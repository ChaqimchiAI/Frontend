import { useState } from "react";
import { Button, Spinner, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useStudentTransactions } from "../../../../data/queries/payments.queries";
import { useVoidTransaction } from "../../../../data/queries/billing.queries";
import { useNotification } from "../../../../Context/NotificationContext";
import Pagination from "@mui/material/Pagination";
import { useTheme } from "../../../../Context/Context";

const TYPE_CONFIG = {
    cash:     { icon: "solar:banknote-2-bold",            color: "#10b981", bg: "rgba(16,185,129,0.15)",  label: "Naqd pul"    },
    card:     { icon: "solar:card-bold",                  color: "#3b82f6", bg: "rgba(59,130,246,0.15)",  label: "Karta"       },
    transfer: { icon: "solar:transfer-horizontal-bold",   color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", label: "O'tkazma"    },
    withdraw: { icon: "solar:wad-of-money-bold",          color: "#ef4444", bg: "rgba(239,68,68,0.15)",   label: "Yechim"      },
    payout:   { icon: "solar:hand-money-bold",            color: "#f97316", bg: "rgba(249,115,22,0.15)",  label: "To'lov"      },
    void:     { icon: "solar:restart-circle-bold",        color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  label: "Bekor qilindi" },
    default:  { icon: "solar:dollar-minimalistic-bold",   color: "#6b7280", bg: "rgba(107,114,128,0.1)", label: "Amal"        },
};

const VOIDED_CONFIG = { icon: "solar:close-circle-bold", color: "#9ca3af", bg: "rgba(156,163,175,0.1)", label: "Bekor qilingan" };

const isDebit  = (t) => ["withdraw", "payout"].includes(t);
const isCredit = (t) => ["cash", "card", "transfer"].includes(t);

const formatDateTime = (s) => {
    if (!s) return "—";
    const d = new Date(s), p = (n) => String(n).padStart(2, "0");
    return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
const formatMonth = (s) => {
    if (!s) return null;
    return new Date(s).toLocaleDateString("uz-UZ", { year: "numeric", month: "long" });
};

// ── Tranzaksiya tafsilot bloki ───────────────────────────────────────────
const TransactionDetail = ({ t, borderColor, subTextColor }) => {
    if (!t) return null;
    const cfg   = t.is_voided ? VOIDED_CONFIG : (TYPE_CONFIG[t.type] ?? TYPE_CONFIG.default);
    const debit = isDebit(t.type);
    const sign  = t.type === "void" ? "+" : debit ? "−" : "+";
    const amtColor = t.is_voided ? subTextColor
        : debit            ? "#ef4444"
        : isCredit(t.type) ? "#10b981"
        : t.type === "void"? "#f59e0b"
        : "inherit";

    const Row = ({ label, value, valueStyle = {} }) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            padding: "9px 0", borderBottom: `1px solid ${borderColor}`, gap: "12px" }}>
            <span style={{ fontSize: "12px", color: subTextColor, whiteSpace: "nowrap" }}>{label}</span>
            <span style={{ fontSize: "13px", fontWeight: 500, textAlign: "right", wordBreak: "break-word", ...valueStyle }}>{value}</span>
        </div>
    );

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px",
                marginBottom: "16px", padding: "14px", borderRadius: "12px", background: cfg.bg }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "13px", flexShrink: 0,
                    background: "rgba(255,255,255,0.18)", color: cfg.color,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon icon={cfg.icon} width="24" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "10px", color: cfg.color, fontWeight: 700,
                        letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "3px" }}>
                        {cfg.label}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: amtColor, letterSpacing: "-0.5px",
                        textDecoration: t.is_voided ? "line-through" : "none" }}>
                        {sign}{Number(t.amount).toLocaleString("uz-UZ")}
                        <span style={{ fontSize: "12px", fontWeight: 400, marginLeft: "4px", opacity: 0.65 }}>so'm</span>
                    </div>
                </div>
                {t.is_voided && (
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af",
                        background: "rgba(156,163,175,0.15)", padding: "3px 8px", borderRadius: "20px", whiteSpace: "nowrap" }}>
                        Bekor qilingan
                    </span>
                )}
            </div>

            <Row label="Tranzaksiya ID" value={<span style={{ fontFamily: "monospace", fontSize: "12px" }}>#{t.id}</span>} />
            <Row label="Balans (so'ng)"
                value={`${Number(t.balance_after).toLocaleString("uz-UZ")} so'm`}
                valueStyle={{ color: Number(t.balance_after) < 0 ? "#ef4444" : "#10b981", fontVariantNumeric: "tabular-nums" }} />
            {t.group_name && <Row label="Guruh" value={t.group_name} />}
            {t.billing_month && <Row label="To'lov oyi" value={formatMonth(t.billing_month)} />}
            <Row label="Sana va vaqt" value={formatDateTime(t.created_at)} valueStyle={{ fontVariantNumeric: "tabular-nums" }} />
            {t.comment && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", gap: "12px" }}>
                    <span style={{ fontSize: "12px", color: subTextColor, whiteSpace: "nowrap" }}>Izoh</span>
                    <span style={{ fontSize: "13px", fontWeight: 400, textAlign: "right", fontStyle: "italic", color: subTextColor, wordBreak: "break-word", maxWidth: "240px" }}>{t.comment}</span>
                </div>
            )}
        </div>
    );
};

// ── Asosiy komponent ──────────────────────────────────────────────────────
const StudentTransactions = ({ studentId, textColor, cardBg }) => {
    const { theme } = useTheme();
    const { setNotif } = useNotification();
    
    // Default 10 ta element
    const [filters, setFilters] = useState({ page: 1, limit: 10 });

    const [showVoidModal, setShowVoidModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [reason, setReason] = useState("");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailTransaction, setDetailTransaction] = useState(null);

    const { data, isLoading } = useStudentTransactions(studentId, filters);
    const { mutate: voidMutate, isPending: isVoiding } = useVoidTransaction(studentId);

    const transactions = data?.results || [];
    const totalCount   = data?.count   || 0;

    const borderColor  = theme ? "rgba(0,0,0,0.1)"       : "rgba(255,255,255,0.1)";
    const subTextColor = theme ? "#6b7280"                : "rgba(255,255,255,0.5)";
    const headerBg     = theme ? "rgba(0,0,0,0.04)"      : "rgba(255,255,255,0.04)";
    const rowHoverBg   = theme ? "rgba(0,0,0,0.03)"      : "rgba(255,255,255,0.04)";

    const handleVoidSubmit = () => {
        if (!selectedTransaction?.id || !reason.trim()) return;
        voidMutate({ 
            transactionId: selectedTransaction.id, 
            reason: reason 
        }, {
            onSuccess: () => {
                setNotif({ show: true, type: "success", message: "Amal muvaffaqiyatli bekor qilindi!" });
                setShowVoidModal(false); setReason(""); setSelectedTransaction(null);
            },
            onError: () => setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" }),
        });
    };

    const openVoid = (t, e) => { e.stopPropagation(); setSelectedTransaction(t); setShowVoidModal(true); };
    const closeVoid = () => { if (isVoiding) return; setShowVoidModal(false); setReason(""); setSelectedTransaction(null); };
    const openDetail = (t) => { setDetailTransaction(t); setShowDetailModal(true); };

    if (isLoading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;

    const thBase = {
        fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
        color: subTextColor, background: headerBg, whiteSpace: "nowrap", padding: "10px 14px", border: `1px solid ${borderColor}`,
    };
    const tdBase = { padding: "10px 14px", border: `1px solid ${borderColor}`, verticalAlign: "middle" };

    return (
        <div style={{ margin: "-1.5rem -1.5rem 0 -1.5rem" }}>
            <div style={{ width: "100%", overflowX: "auto", border: `1px solid ${borderColor}`, borderRadius: "0 0 10px 10px", borderTop: "none" }}>
                <table style={{ width: "100%", minWidth: "780px", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ ...thBase, width: "46px", textAlign: "center" }}>Tur</th>
                            <th style={thBase}>Summa</th>
                            <th style={thBase}>Balans</th>
                            <th style={thBase}>Guruh / Oy</th>
                            <th style={thBase}>Izoh</th>
                            <th style={thBase}>Sana va Vaqt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ ...tdBase, textAlign: "center", padding: "48px", color: subTextColor }}>Tranzaksiyalar topilmadi</td>
                            </tr>
                        )}
                        {transactions.map((t) => {
                            const cfg = t.is_voided ? VOIDED_CONFIG : (TYPE_CONFIG[t.type] ?? TYPE_CONFIG.default);
                            const debit = isDebit(t.type);
                            const sign = t.type === "void" ? "+" : debit ? "−" : "+";
                            const amtColor = t.is_voided ? subTextColor : debit ? "#ef4444" : isCredit(t.type) ? "#10b981" : "#f59e0b";
                            const rowDefaultBg = t.is_voided ? (theme ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,0.01)") : "transparent";

                            return (
                                <tr key={t.id} style={{ background: rowDefaultBg, cursor: "pointer" }} onClick={() => openDetail(t)}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = rowHoverBg; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = rowDefaultBg; }}
                                >
                                    <td style={{ ...tdBase, textAlign: "center" }}>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>{cfg.label} {t.is_voided ? "(Bekor qilingan)" : ""}</Tooltip>}>
                                            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: cfg.bg, color: cfg.color, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icon icon={cfg.icon} width="18" />
                                            </div>
                                        </OverlayTrigger>
                                    </td>
                                    <td style={tdBase}>
                                        <span style={{ color: amtColor, fontWeight: 600, fontSize: "14px", textDecoration: t.is_voided ? "line-through" : "none", fontVariantNumeric: "tabular-nums" }}>
                                            {sign}{Number(t.amount).toLocaleString("uz-UZ")}
                                            <span style={{ fontSize: "11px", fontWeight: 400, marginLeft: "3px", opacity: 0.65 }}>so'm</span>
                                        </span>
                                    </td>
                                    <td style={tdBase}>
                                        <span style={{ fontSize: "13px", fontVariantNumeric: "tabular-nums", color: Number(t.balance_after) < 0 ? "#ef4444" : subTextColor }}>
                                            {Number(t.balance_after).toLocaleString("uz-UZ")} so'm
                                        </span>
                                    </td>
                                    <td style={tdBase}>
                                        <div style={{ fontSize: "13px", fontWeight: 500 }}>{t.group_name ?? "Kassa amali"}</div>
                                        {t.billing_month && <div style={{ fontSize: "11px", color: subTextColor }}>{formatMonth(t.billing_month)}</div>}
                                    </td>
                                    <td style={tdBase}>
                                        <span style={{ fontSize: "12px", color: subTextColor, fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: "200px" }}>{t.comment || "—"}</span>
                                    </td>
                                    <td style={tdBase}>
                                        <span style={{ fontSize: "12px", color: subTextColor, whiteSpace: "nowrap" }}>{formatDateTime(t.created_at)}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Faqat jami elementlar 25 tadan ko'p bo'lsa chiqadi */}
            <div className="d-flex justify-content-between align-items-center mt-3 px-4 pb-3">
                <div style={{ fontSize: "12px", color: subTextColor }}>Jami: <b>{totalCount}</b> ta tranzaksiya</div>
                {totalCount > filters.limit && (
                    <Pagination
                        count={Math.ceil(totalCount / filters.limit)}
                        page={filters.page}
                        onChange={(_, v) => setFilters((prev) => ({ ...prev, page: v }))}
                        size="small" color="primary"
                    />
                )}
            </div>

            {/* Detail Modal */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="sm">
                <Modal.Header closeButton className="border-0 pb-0"><Modal.Title style={{ fontSize: "14px", fontWeight: 600, opacity: 0.6 }}>Tafsilotlar</Modal.Title></Modal.Header>
                <Modal.Body>
                    <TransactionDetail t={detailTransaction} borderColor={borderColor} subTextColor={subTextColor} />
                    {detailTransaction && !detailTransaction.is_voided && detailTransaction.type !== "void" && (
                        <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: `1px solid ${borderColor}` }}>
                            <Button variant="outline-warning" size="sm" className="w-100" onClick={() => { setShowDetailModal(false); setTimeout(() => openVoid(detailTransaction, { stopPropagation: () => {} }), 150); }}>
                                <Icon icon="solar:re-routing-bold" width="15" className="me-1" />Amalni bekor qilish
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Void Modal */}
            <Modal show={showVoidModal} onHide={closeVoid} centered>
                <Modal.Header closeButton className="border-0 pb-0"><Modal.Title style={{ fontSize: "15px", fontWeight: 600 }}>Bekor qilish</Modal.Title></Modal.Header>
                <Modal.Body>
                    <TransactionDetail t={selectedTransaction} borderColor={borderColor} subTextColor={subTextColor} />
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${borderColor}` }}>
                        <label style={{ fontSize: "12px", color: subTextColor, marginBottom: "6px" }}>Sabab *</label>
                        <Form.Control as="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} disabled={isVoiding} className={!theme ? "bg-dark text-white border-secondary" : ""} style={{ resize: "none", fontSize: "13px" }} />
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0 gap-2">
                    <Button variant="light" size="sm" onClick={closeVoid}>Bekor</Button>
                    <Button variant="warning" size="sm" onClick={handleVoidSubmit} disabled={isVoiding || !reason.trim()}>{isVoiding ? <Spinner size="sm" /> : "Tasdiqlash"}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default StudentTransactions;