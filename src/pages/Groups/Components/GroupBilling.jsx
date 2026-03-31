import React, { useState } from "react";
import { Table, Card, Row, Col, Badge, Form, InputGroup } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { DatePicker } from "antd"; // Oyni tanlash uchun qulay
import dayjs from "dayjs";

const GroupBilling = ({ groupId, theme }) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  
  // ── Mock Data (Sizning modellaringizga asoslangan) ──────────────────────
  const mockBillingData = [
    {
      id: 1,
      student_name: "Ali Valiyev",
      amount_paid: 500000,
      discount_amount: 50000,
      total_billed: 450000,
      current_balance: 120000,
      status: "paid",
      date: "2026-03-15"
    },
    {
      id: 2,
      student_name: "Olim Toshov",
      amount_paid: 0,
      discount_amount: 0,
      total_billed: 500000,
      current_balance: -500000,
      status: "unpaid",
      date: null
    },
    {
      id: 3,
      student_name: "Zebiniso Karimoeva",
      amount_paid: 450000,
      discount_amount: 100000,
      total_billed: 350000,
      current_balance: 50000,
      status: "partial",
      date: "2026-03-10"
    }
  ];

  const subTextColor = theme ? "#6b7280" : "rgba(255,255,255,0.5)";
  const borderColor = theme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";

  return (
    <div className="mt-3">
      {/* ── Filtrlar va Statistika ── */}
      <Row className="mb-4 gy-3">
        <Col md={4}>
          <label className="small fw-bold mb-2 d-block" style={{ color: subTextColor }}>
            Hisob oyini tanlang
          </label>
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={(date) => setSelectedMonth(date)}
            className="w-100 py-2"
            allowClear={false}
          />
        </Col>
        <Col md={8}>
          <Row className="text-center">
            <Col xs={4}>
              <div className="p-2 rounded" style={{ background: "rgba(16,185,129,0.1)" }}>
                <div className="small text-success fw-bold">Jami tushum</div>
                <h5 className="mb-0 mt-1">950,000 UZS</h5>
              </div>
            </Col>
            <Col xs={4}>
              <div className="p-2 rounded" style={{ background: "rgba(245,158,11,0.1)" }}>
                <div className="small text-warning fw-bold">Jami chegirma</div>
                <h5 className="mb-0 mt-1">150,000 UZS</h5>
              </div>
            </Col>
            <Col xs={4}>
              <div className="p-2 rounded" style={{ background: "rgba(239,68,68,0.1)" }}>
                <div className="small text-danger fw-bold">Qarzdorlik</div>
                <h5 className="mb-0 mt-1">500,000 UZS</h5>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* ── To'lovlar jadvali ── */}
      <div className="table-responsive" style={{ borderRadius: "10px", border: `1px solid ${borderColor}` }}>
        <table className="table table-borderless align-middle mb-0">
          <thead style={{ background: theme ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)" }}>
            <tr className="small text-uppercase" style={{ color: subTextColor, fontSize: "11px", letterSpacing: "0.5px" }}>
              <th className="p-3">O'quvchi</th>
              <th className="p-3">To'lov holati</th>
              <th className="p-3">Asl narxi</th>
              <th className="p-3">Chegirma</th>
              <th className="p-3">Yechilgan</th>
              <th className="p-3">Hozirgi Balans</th>
              <th className="p-3">Sana</th>
            </tr>
          </thead>
          <tbody>
            {mockBillingData.map((item) => (
              <tr key={item.id} className="border-bottom" style={{ borderColor: borderColor }}>
                <td className="p-3 fw-bold">{item.student_name}</td>
                <td className="p-3">
                  <Badge 
                    bg={item.status === 'paid' ? 'success' : item.status === 'partial' ? 'warning' : 'danger'}
                    className="fw-medium px-2 py-1"
                    style={{ fontSize: "10px" }}
                  >
                    {item.status === 'paid' ? 'To\'langan' : item.status === 'partial' ? 'Qisman' : 'To\'lanmagan'}
                  </Badge>
                </td>
                <td className="p-3">{Number(500000).toLocaleString()}</td>
                <td className="p-3 text-warning">-{Number(item.discount_amount).toLocaleString()}</td>
                <td className="p-3 fw-bold text-success">{Number(item.amount_paid).toLocaleString()}</td>
                <td className="p-3">
                   <span style={{ color: item.current_balance < 0 ? "#ef4444" : "#10b981", fontWeight: 600 }}>
                     {Number(item.current_balance).toLocaleString()} UZS
                   </span>
                </td>
                <td className="p-3 small text-muted">{item.date || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupBilling;