import { useState } from "react"
import { Icon } from "@iconify/react"
import { useTheme } from "../../Context/Context"
import MonthSelect, { monthOptions } from "../../components/Ui/MonthSelect"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend
} from "recharts"

const Statistics = () => {
    // const {data: getBillingStatsData, isLoading: getBillingStatsLoading} = useBillingStats()
    // console.log(getBillingStatsData)

    const { theme } = useTheme()

    const [selectedMonth, setSelectedMonth] = useState(monthOptions[0])

    // ============ MOCK DATA ============

    const statsCards = [
        {
            id: 1,
            title: "Jami tushum",
            value: "128.5M",
            change: "+14%",
            icon: "ph:currency-dollar-duotone",
            color: "#10b981",
            gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
            subtitle: "so'mda"
        },
        {
            id: 2,
            title: "Jami xarajat",
            value: "42.3M",
            change: "-3%",
            icon: "ph:arrow-circle-down-duotone",
            color: "#f43f5e",
            gradient: "linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)",
            subtitle: "so'mda"
        },
        {
            id: 3,
            title: "Sof foyda",
            value: "86.2M",
            change: "+22%",
            icon: "ph:chart-line-up-duotone",
            color: "#6366f1",
            gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            subtitle: "so'mda"
        },
        {
            id: 4,
            title: "Qarzdorlik",
            value: "15.8M",
            change: "-8%",
            icon: "ph:warning-circle-duotone",
            color: "#f59e0b",
            gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
            subtitle: "so'mda"
        },
    ]

    const monthlyRevenue = [
        { name: "Yan", tushum: 38, xarajat: 14 },
        { name: "Fev", tushum: 42, xarajat: 16 },
        { name: "Mar", tushum: 55, xarajat: 18 },
        { name: "Apr", tushum: 48, xarajat: 15 },
        { name: "May", tushum: 62, xarajat: 20 },
        { name: "Iyun", tushum: 58, xarajat: 19 },
        { name: "Iyul", tushum: 72, xarajat: 22 },
        { name: "Avg", tushum: 68, xarajat: 21 },
        { name: "Sen", tushum: 85, xarajat: 25 },
        { name: "Okt", tushum: 92, xarajat: 28 },
        { name: "Noy", tushum: 105, xarajat: 30 },
        { name: "Dek", tushum: 128, xarajat: 42 },
    ]

    const studentGrowth = [
        { name: "Yan", students: 820 },
        { name: "Fev", students: 870 },
        { name: "Mar", students: 940 },
        { name: "Apr", students: 980 },
        { name: "May", students: 1020 },
        { name: "Iyun", students: 1050 },
        { name: "Iyul", students: 1100 },
        { name: "Avg", students: 1130 },
        { name: "Sen", students: 1200 },
        { name: "Okt", students: 1240 },
        { name: "Noy", students: 1260 },
        { name: "Dek", students: 1280 },
    ]

    const paymentMethods = [
        { name: "Naqd", value: 45, fill: "#10b981" },
        { name: "Plastik", value: 30, fill: "#6366f1" },
        { name: "Click", value: 15, fill: "#f59e0b" },
        { name: "Payme", value: 10, fill: "#ec4899" },
    ]

    const courseDistribution = [
        { name: "IELTS", value: 35, fill: "#3b82f6" },
        { name: "General English", value: 25, fill: "#10b981" },
        { name: "Kids English", value: 20, fill: "#f59e0b" },
        { name: "IT / Programming", value: 12, fill: "#ec4899" },
        { name: "Boshqa", value: 8, fill: "#6366f1" },
    ]

    const recentTransactions = [
        { id: 1, student: "Aliyev Jasur", amount: "500,000", type: "income", method: "Naqd", date: "24.02.2026", group: "IELTS Master" },
        { id: 2, student: "Karimova Nodira", amount: "800,000", type: "income", method: "Click", date: "24.02.2026", group: "General English" },
        { id: 3, student: "Toshmatov Sardor", amount: "350,000", type: "income", method: "Plastik", date: "23.02.2026", group: "Kids English" },
        { id: 4, student: "Rahimov Bobur", amount: "1,200,000", type: "expense", method: "Naqd", date: "23.02.2026", group: "O'qituvchi ish haqi" },
        { id: 5, student: "Sobirova Malika", amount: "600,000", type: "income", method: "Payme", date: "22.02.2026", group: "IT / Programming" },
        { id: 6, student: "Nuriddinov Otabek", amount: "450,000", type: "income", method: "Naqd", date: "22.02.2026", group: "IELTS Master" },
    ]



    const attendanceWeekly = [
        { name: "Dush", present: 85, absent: 15 },
        { name: "Sesh", present: 90, absent: 10 },
        { name: "Chor", present: 82, absent: 18 },
        { name: "Pay", present: 88, absent: 12 },
        { name: "Jum", present: 78, absent: 22 },
        { name: "Shan", present: 65, absent: 35 },
    ]

    // ============ END MOCK DATA ============

    const RADIAN = Math.PI / 180
    const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)
        if (percent < 0.05) return null
        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    const periods = [
        { key: "week", label: "Hafta" },
        { key: "month", label: "Oy" },
        { key: "year", label: "Yil" },
    ]

    const chartTextColor = !theme ? "#94a3b8" : "#64748b"
    const gridColor = !theme ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null
        return (
            <div style={{
                background: !theme ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.97)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${!theme ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
                borderRadius: "14px",
                padding: "14px 18px",
                boxShadow: !theme
                    ? "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)"
                    : "0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)",
                minWidth: "140px",
            }}>
                {label && (
                    <div style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: !theme ? "#94a3b8" : "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "8px",
                        paddingBottom: "8px",
                        borderBottom: `1px solid ${!theme ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                    }}>{label}</div>
                )}
                {payload.map((entry, i) => (
                    <div key={i} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        padding: "3px 0",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                                width: 10,
                                height: 10,
                                borderRadius: "3px",
                                background: entry.color || entry.fill || entry.payload?.fill,
                                display: "inline-block",
                                flexShrink: 0,
                            }}></span>
                            <span style={{
                                fontSize: "13px",
                                color: !theme ? "#cbd5e1" : "#475569",
                                fontWeight: 500,
                            }}>{entry.name}</span>
                        </div>
                        <span style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: !theme ? "#f1f5f9" : "#1e293b",
                        }}>{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="card card-body" style={{ minHeight: '100vh', transition: 'all 0.3s' }}>

                {/* Header */}
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 fw-bold">
                            STATISTIKA
                        </span>
                        <h2 className="fw-bold mb-1 stats-welcome-title">Moliyaviy statistika</h2>
                        <p className="text-muted mb-0 small">O'quv markaz faoliyati haqida umumiy ko'rsatkichlar</p>
                    </div>

                    <MonthSelect value={selectedMonth} onChange={setSelectedMonth} />
                </div>

                {/* Stat Cards */}
                <div className="row g-4 mb-5">
                    {statsCards.map(stat => (
                        <div className="col-12 col-md-6 col-xl-3" key={stat.id}>
                            <div className="card stats-glass-card stats-stat-card p-4 h-100 border-0 overflow-hidden position-relative">
                                <div style={{
                                    position: 'absolute', top: '-20px', right: '-20px',
                                    width: '100px', height: '100px', background: stat.gradient,
                                    opacity: '0.1', borderRadius: '50%', filter: 'blur(30px)'
                                }}></div>

                                <div className="stats-icon-box" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}20` }}>
                                    <Icon icon={stat.icon} fontSize={28} style={{ color: stat.color }} />
                                </div>

                                <div>
                                    <p className="text-muted small mb-1 fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>{stat.title}</p>
                                    <div className="d-flex align-items-end gap-2">
                                        <h3 className={`fw-bold mb-0 ${!theme ? 'text-white' : 'text-dark'}`}>{stat.value}</h3>
                                        <span className={`small mb-1 fw-semibold ${stat.change.startsWith('+') ? 'stats-trend-up' : 'stats-trend-down'}`}>
                                            <Icon icon={stat.change.startsWith('+') ? 'ph:trend-up-bold' : 'ph:trend-down-bold'} fontSize={14} className="me-1" />
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{stat.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Row 1: Revenue Chart + Payment Methods */}
                <div className="row g-4 mb-4">
                    <div className="col-12 col-xl-8">
                        <div className="card stats-glass-card p-4 border-0 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h5 className={`fw-bold mb-1 ${!theme ? 'text-white' : 'text-dark'}`}>Oylik tushum va xarajat</h5>
                                    <p className="text-muted small mb-0">Yillik moliyaviy ko'rsatkichlar (mln so'mda)</p>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center gap-1">
                                        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#6366f1' }}></span>
                                        <span className="text-muted" style={{ fontSize: '12px' }}>Tushum</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-1">
                                        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#f43f5e' }}></span>
                                        <span className="text-muted" style={{ fontSize: '12px' }}>Xarajat</span>
                                    </div>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={monthlyRevenue} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: !theme ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                                    <Bar dataKey="tushum" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
                                    <Bar dataKey="xarajat" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="col-12 col-xl-4">
                        <div className="card stats-glass-card p-4 border-0 h-100">
                            <h5 className={`fw-bold mb-1 ${!theme ? 'text-white' : 'text-dark'}`}>To'lov usullari</h5>
                            <p className="text-muted small mb-3">Tushum bo'yicha taqsimot</p>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={paymentMethods}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={90}
                                        labelLine={false}
                                        label={renderLabel}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {paymentMethods.map((entry, index) => (
                                            <Cell key={`pm-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                                {paymentMethods.map((pm, i) => (
                                    <div key={i} className="d-flex align-items-center gap-2">
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: pm.fill }}></span>
                                        <span className="text-muted" style={{ fontSize: '12px' }}>{pm.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Student Growth + Course Distribution */}
                <div className="row g-4 mb-4">
                    <div className="col-12 col-xl-8">
                        <div className="card stats-glass-card p-4 border-0 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h5 className={`fw-bold mb-1 ${!theme ? 'text-white' : 'text-dark'}`}>O'quvchilar o'sishi</h5>
                                    <p className="text-muted small mb-0">Yil davomida o'quvchilar soni dinamikasi</p>
                                </div>
                                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)'
                                }}>
                                    <Icon icon="ph:trend-up-bold" fontSize={16} style={{ color: '#10b981' }} />
                                    <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>+56%</span>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={studentGrowth}>
                                    <defs>
                                        <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} fill="url(#studentGrad)" dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="col-12 col-xl-4">
                        <div className="card stats-glass-card p-4 border-0 h-100">
                            <h5 className={`fw-bold mb-1 ${!theme ? 'text-white' : 'text-dark'}`}>Kurslar taqsimoti</h5>
                            <p className="text-muted small mb-3">O'quvchilar soni bo'yicha</p>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={courseDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        labelLine={false}
                                        label={renderLabel}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {courseDistribution.map((entry, index) => (
                                            <Cell key={`cd-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                                {courseDistribution.map((cd, i) => (
                                    <div key={i} className="d-flex align-items-center gap-2">
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: cd.fill }}></span>
                                        <span className="text-muted" style={{ fontSize: '12px' }}>{cd.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Weekly Attendance */}
                <div className="row g-4 mb-4">
                    <div className="col-12">
                        <div className="card stats-glass-card p-4 border-0">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h5 className={`fw-bold mb-1 ${!theme ? 'text-white' : 'text-dark'}`}>Haftalik davomat</h5>
                                    <p className="text-muted small mb-0">O'quvchilarning davomat ko'rsatkichlari (%)</p>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center gap-1">
                                        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#10b981' }}></span>
                                        <span className="text-muted" style={{ fontSize: '12px' }}>Keldi</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-1">
                                        <span style={{ width: 10, height: 10, borderRadius: 3, background: '#f43f5e' }}></span>
                                        <span className="text-muted" style={{ fontSize: '12px' }}>Kelmadi</span>
                                    </div>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={attendanceWeekly}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                    <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5, strokeWidth: 0 }} activeDot={{ r: 7, strokeWidth: 0 }} />
                                    <Line type="monotone" dataKey="absent" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', r: 5, strokeWidth: 0 }} activeDot={{ r: 7, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Row 4: Recent Transactions */}
                <div className="row g-4 mb-4">
                    {/* Recent Transactions */}
                    <div className="col-12">
                        <div className="card stats-glass-card p-4 border-0 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h5 className={`fw-bold mb-1 ${!theme ? 'text-white' : 'text-dark'}`}>Oxirgi tranzaksiyalar</h5>
                                    <p className="text-muted small mb-0">So'nggi moliyaviy operatsiyalar</p>
                                </div>
                                <button className="btn btn-sm btn-link text-primary text-decoration-none fw-bold" style={{ fontSize: '13px' }}>
                                    Hammasini ko'rish
                                </button>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-borderless mb-0" style={{ fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: `1px solid ${!theme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                                            <th className="text-muted fw-semibold py-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>ISM</th>
                                            <th className="text-muted fw-semibold py-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>GURUH</th>
                                            <th className="text-muted fw-semibold py-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>SUMMA</th>
                                            <th className="text-muted fw-semibold py-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>USUL</th>
                                            <th className="text-muted fw-semibold py-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>SANA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map(tx => (
                                            <tr key={tx.id} className="stats-tx-row" style={{ borderBottom: `1px solid ${!theme ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}` }}>
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{
                                                            width: 32, height: 32,
                                                            background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                        }}>
                                                            <Icon
                                                                icon={tx.type === 'income' ? 'ph:arrow-down-left-bold' : 'ph:arrow-up-right-bold'}
                                                                fontSize={14}
                                                                style={{ color: tx.type === 'income' ? '#10b981' : '#f43f5e' }}
                                                            />
                                                        </div>
                                                        <span className={`fw-semibold ${!theme ? 'text-white' : 'text-dark'}`}>{tx.student}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-muted">{tx.group}</td>
                                                <td className="py-3">
                                                    <span className="fw-bold" style={{ color: tx.type === 'income' ? '#10b981' : '#f43f5e' }}>
                                                        {tx.type === 'income' ? '+' : '-'}{tx.amount}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className="badge rounded-pill px-2 py-1" style={{
                                                        background: !theme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                                                        color: !theme ? '#94a3b8' : '#64748b',
                                                        fontSize: '11px',
                                                        fontWeight: 600
                                                    }}>{tx.method}</span>
                                                </td>
                                                <td className="py-3 text-muted">{tx.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style>
                {`
        .stats-glass-card {
          background: ${!theme ? "rgba(30, 41, 59, 0.7)" : "#f5f5f5"};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid ${!theme ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: ${!theme ? "0 4px 6px -1px rgba(0, 0, 0, 0.2)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)"};
        }

        .stats-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
          border-color: ${!theme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
        }

        .stats-icon-box {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          margin-bottom: 1.2rem;
        }

        .stats-trend-up { color: #10b981; }
        .stats-trend-down { color: #f43f5e; }

        .stats-welcome-title {
          background: ${!theme ? "linear-gradient(to right, #fff, #94a3b8)" : "linear-gradient(to right, #1e293b, #64748b)"};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }


        .stats-tx-row {
          transition: background 0.2s ease;
        }

        .stats-tx-row:hover {
          background: ${!theme ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"};
        }

        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line {
          stroke-opacity: 0.5;
        }
        `}
            </style>
        </>
    )
}

export default Statistics