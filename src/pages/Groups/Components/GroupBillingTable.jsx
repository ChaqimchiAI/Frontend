import React from "react";
import { Table, Badge, Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react";

const GroupBillingTable = ({ financeData, theme }) => {
    const results = financeData?.results || [];
    const summary = financeData?.summary || {};

    // ─── HISOB-KITOBLAR ───
    // 1. Jami chegirmalar (Shu oyda berilgan)
    const totalDiscounts = results.reduce((acc, curr) => acc + Number(curr.discount_amount || 0), 0);
    
    // 2. Kutilayotgan qarz (Faqat balansida minus bor o'quvchilarning minuslarini yig'amiz)
    const totalCurrentDebt = results.reduce((acc, curr) => {
        const bal = Number(curr.current_balance || 0);
        return acc + (bal < 0 ? Math.abs(bal) : 0);
    }, 0);

    const subBg = !theme ? "#0e315065" : "#4d9ee51d";
    const borderColor = !theme ? "rgba(255,255,255,0.1)" : "rgba(0,160,234,0.15)";

    return (
        <div className="mt-2">
            {/* ─── YUQORI STATISTIKA (MINI CARDS) ─── */}
            <Row className="g-3 mb-4">
                <Col md={4}>
                    <div className="p-3 rounded-3 border h-100" style={{ background: subBg, borderColor }}>
                        <div className="d-flex align-items-center gap-2 text-success mb-1">
                            <Icon icon="solar:wad-of-money-bold" width="20" />
                            <span className="small fw-bold text-uppercase">Jami Tushum</span>
                        </div>
                        <h4 className="mb-0 fw-bold">
                            {Number(summary.total_collected_amount || 0).toLocaleString()} 
                            <small className="fs-6 fw-normal ms-1">so'm</small>
                        </h4>
                        <div className="text-muted small mt-1" style={{ fontSize: '10px' }}>TANLANGAN OY UCHUN</div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="p-3 rounded-3 border h-100" style={{ background: subBg, borderColor }}>
                        <div className="d-flex align-items-center gap-2 text-warning mb-1">
                            <Icon icon="solar:sale-bold" width="20" />
                            <span className="small fw-bold text-uppercase">Jami Chegirma</span>
                        </div>
                        <h4 className="mb-0 fw-bold">
                            {totalDiscounts.toLocaleString()} 
                            <small className="fs-6 fw-normal ms-1">so'm</small>
                        </h4>
                        <div className="text-muted small mt-1" style={{ fontSize: '10px' }}>OYLIK IMTIYOZLAR</div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="p-3 rounded-3 border h-100" style={{ background: subBg, borderColor }}>
                        <div className="d-flex align-items-center gap-2 text-danger mb-1">
                            <Icon icon="solar:hand-stars-bold" width="20" />
                            <span className="small fw-bold text-uppercase">Kutilayotgan Qarz</span>
                        </div>
                        <h4 className="mb-0 fw-bold">
                            {totalCurrentDebt.toLocaleString()} 
                            <small className="fs-6 fw-normal ms-1">so'm</small>
                        </h4>
                        <div className="text-danger small mt-1" style={{ fontSize: '10px', fontWeight: 500 }}>UMUMIY MINUS BALANSLAR</div>
                    </div>
                </Col>
            </Row>

            {/* ─── ASOSIY JADVAL ─── */}
            <h6 className="fw-medium mb-3 d-flex align-items-center gap-2">
                <Icon icon="solar:users-group-rounded-bold" className="text-primary" />
                O'quvchilar kesimida moliya jadvali
            </h6>

            <div
                className="px-3 py-1 border rounded-3"
                style={{
                    background: subBg,
                    borderColor: borderColor,
                    overflowX: "auto"
                }}
            >
                <Table className="mb-0 align-middle">
                    <thead>
                        <tr>
                            <th className="text-muted bg-transparent border-0 small">№</th>
                            <th className="text-muted bg-transparent border-0 small">O'quvchi F.I.SH</th>
                            <th className="text-muted bg-transparent border-0 small text-center">Holat</th>
                            <th className="text-muted bg-transparent border-0 small text-end">Kurs Narxi</th>
                            <th className="text-muted bg-transparent border-0 small text-end">Chegirma</th>
                            <th className="text-muted bg-transparent border-0 small text-end">To'landi</th>
                            <th className="text-muted bg-transparent border-0 small text-end">Joriy Balans</th>
                            <th className="text-muted bg-transparent border-0 small text-center">Sana</th>
                        </tr>
                    </thead>
                    <tbody style={{ borderTop: `1px solid ${borderColor}` }}>
                        {results.length > 0 ? (
                            results.map((item, index) => {
                                const isMinus = Number(item.current_balance) < 0;
                                return (
                                    <tr key={item.student_id || index} style={{ borderBottom: `1px solid ${borderColor}` }}>
                                        <td className="bg-transparent text-muted small">{index + 1}</td>
                                        <td className="bg-transparent py-3">
                                            <div className="fw-bold">{item.full_name}</div>
                                            {isMinus && (
                                                <div className="text-danger" style={{ fontSize: '10px', fontWeight: 600 }}>
                                                    <Icon icon="solar:danger-triangle-bold" className="me-1" />
                                                    QARZDORLIK MAVJUD
                                                </div>
                                            )}
                                        </td>
                                        <td className="bg-transparent text-center">
                                            <Badge 
                                                bg={item.is_currently_active ? "success" : "secondary"} 
                                                className="fw-medium px-2 py-1"
                                                style={{ fontSize: '9px', borderRadius: '4px', opacity: 0.8 }}
                                            >
                                                {item.is_currently_active ? "FAOL" : "KETGAN"}
                                            </Badge>
                                        </td>
                                        <td className="bg-transparent text-end fw-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                                            {Number(item.course_price).toLocaleString()}
                                        </td>
                                        <td className="bg-transparent text-end text-warning" style={{ fontVariantNumeric: "tabular-nums" }}>
                                            {Number(item.discount_amount) > 0 ? `-${Number(item.discount_amount).toLocaleString()}` : "0"}
                                        </td>
                                        <td className="bg-transparent text-end text-success fw-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                                            {Number(item.withdrawn_amount).toLocaleString()}
                                        </td>
                                        <td className="bg-transparent text-end">
                                            <div className={isMinus ? "text-danger fw-bold" : "text-success fw-bold"} style={{ fontVariantNumeric: "tabular-nums", fontSize: '14px' }}>
                                                {Number(item.current_balance).toLocaleString()}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: '9px', textTransform: 'uppercase' }}>so'm</div>
                                        </td>
                                        <td className="bg-transparent text-center small opacity-75">
                                            {item.billing_date ? (
                                                <div className="d-flex flex-column align-items-center">
                                                    <span style={{ fontWeight: 500 }}>{item.billing_date.split("T")[0].split("-").reverse().join(".")}</span>
                                                    <span style={{ fontSize: '10px' }}>{item.billing_date.split("T")[1]?.slice(0, 5)}</span>
                                                </div>
                                            ) : "—"}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8} className="bg-transparent text-center py-5 opacity-50">
                                    <Icon icon="solar:bill-list-broken" width="48" className="mb-2 d-block mx-auto text-primary" />
                                    <h5 className="fw-medium">Billing yozuvlari topilmadi</h5>
                                    <p className="small">Ushbu oy uchun hali oylik to'lovlari yechilmagan</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            
            <div className="mt-3 d-flex align-items-center gap-2 opacity-50" style={{ fontSize: '11px' }}>
                <Icon icon="solar:info-square-bold" className="text-primary" />
                <span>Eslatma: Kutilayotgan qarz ustunida o'quvchilarning barcha guruhlardagi jami minus balanslari hisoblanadi.</span>
            </div>
        </div>
    );
};

export default GroupBillingTable;