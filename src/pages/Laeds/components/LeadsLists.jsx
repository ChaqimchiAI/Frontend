import { Card, Dropdown } from "react-bootstrap";
import DataTable from "../../../components/Ui/DataTable";
import StatusDropdown from "../../../components/Ui/StatusFilter";
import CalendarSelector from "../../../components/Ui/CalendarSelector";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeachersData } from "../../../data/queries/teachers.queries";
import { Icon } from "@iconify/react";
import { useLeadsStats, useUpdateLead } from "../../../data/queries/leads.queries";
import MonthSelect, { monthOptions } from "../../../components/Ui/MonthSelect";
import { useTheme } from "../../../Context/Context";

const sources = {
     "Instagram": "#ec4899",
     "Telegram": "#06b6d4",
     "Facebook": "#10b981",
     "Tavsiya": "#f59e0b",
     "Banner": "#2f871c",
}

const statuses = [
     { key: "all", label: "Barcha statuslar", color: "gray" },
     { key: "new", label: "Yangi", color: "blue" },
     { key: "registered", label: "Qabul qilingan", color: "green" },
     { key: "interested", label: "Qiziqqan", color: "yellow" },
     { key: "lost", label: "Bekor qilingan", color: "red" },
     { key: "contacted", label: "Bog‘lanilgan", color: "muted" },
];

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
     const x = cx + radius * Math.cos(-midAngle * RADIAN);
     const y = cy + radius * Math.sin(-midAngle * RADIAN);
     if (percent < 0.05) return null;
     return (
          <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
               {`${(percent * 100).toFixed(0)}%`}
          </text>
     );
};

const LeadsLists = ({ leads, totalCount, filters, setFilters, setOpemModal, setChangeData, stats }) => {
     const navigate = useNavigate()
     const { theme } = useTheme()

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

     const { data: teachers } = useTeachersData()
     const teacherData = teachers?.results

     const { mutate: updateLead } = useUpdateLead();

     console.log(stats)

     const [openDropdown, setOpenDropdown] = useState(null)
     const [selectedMonth, setSelectedMonth] = useState(monthOptions[0])

     // Handlers for server-side filters
     const handlePageChange = (event, value) => {
          setFilters(prev => ({ ...prev, page: value }));
     };

     const handleLimitChange = (limit) => {
          setFilters(prev => ({ ...prev, limit, page: 1 }));
     };

     const handleStatusChange = (status) => {
          setFilters(prev => ({ ...prev, status: status.key === "all" ? "" : status.key, page: 1 }));
     };

     const handleDateRange = (range) => {
          setFilters(prev => ({
               ...prev,
               start_date: range.start || "",
               end_date: range.end || "",
               page: 1
          }));
     };

     // Status changing in table
     const statusChange = (s, id) => {
          updateLead({ id, data: { status: s } });
     }

     const statusStyle = (s) => {
          let st = s === "new" ? { style: { background: "#3b82f6" }, t: "Yangi" }
               : s === "contacted" ? { style: { background: "#9ea5ac" }, t: "Bog'lanilgan" }
                    : s === "interested" ? { style: { background: "#f59e0b" }, t: "Qiziqish bildirgan" }
                         : s === "registered" ? { style: { background: "#10b981" }, t: "Guruhga qo'shilgan" }
                              : s === "lost" ? { style: { background: "#ef4444" }, t: "O'chirilgan" }
                                   : ""
          return st
     }

     const handleChange = (e, id) => {
          e.stopPropagation()
          const data = leads.find(l => l.id === id)
          setChangeData(data)
          setOpemModal(true)
     }


     const statusData = [
          { name: "Yangi", value: stats?.statuses?.new, fill: "#3b82f6" },
          { name: "Qabul qilingan", value: stats?.statuses?.registered, fill: "#10b981" },
          { name: "Qiziqgan", value: stats?.statuses?.interested, fill: "#f59e0b" },
          { name: "Bekor qilingan", value: stats?.statuses?.lost, fill: "#ef4444" },
          { name: "Bog'lanilgan", value: stats?.statuses?.contacted, fill: "#9ea5ac" },
     ];

     const sourceData = Object.keys(sources).map(source => ({
          name: source,
          value: stats?.sources?.[source],
          fill: sources[source],
     }));

     const handleFilterChange = (key, value) => {
          setFilters(prev => ({
               ...prev,
               [key]: value === "all" ? "" : value,
               page: 1
          }));
     };

     return (
          <>
               <div className="card card-body px-4 mt-3">

                    <div className="row g-3 mb-4 mx-0">
                         <div className="col-12 col-xl-6">
                              <Card className="lidCard h-100">
                                   <Card.Body>
                                        <h4 className="fs-6" style={{ fontWeight: "900" }}>
                                             Lidlar Holati
                                        </h4>

                                        {statusData.some(d => d.value > 0) ? (
                                             <>
                                                  <ResponsiveContainer width="99%" height={300}>
                                                       <PieChart>
                                                            <Pie
                                                                 data={statusData.filter(d => d.value > 0)}
                                                                 cx="50%"
                                                                 cy="50%"
                                                                 outerRadius={110}
                                                                 labelLine={false}
                                                                 label={renderLabel}
                                                                 dataKey="value"
                                                                 strokeWidth={0}
                                                            >
                                                                 {statusData.filter(d => d.value > 0).map((entry, index) => (
                                                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                                                 ))}
                                                            </Pie>
                                                            <Tooltip content={<CustomTooltip />} />
                                                       </PieChart>
                                                  </ResponsiveContainer>
                                                  <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                                                       {statusData.map((item, i) => (
                                                            <div key={i} className="d-flex align-items-center gap-2">
                                                                 <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.fill, opacity: item.value > 0 ? 1 : 0.4 }}></span>
                                                                 <span className="text-muted" style={{ fontSize: '12px', opacity: item.value > 0 ? 1 : 0.5 }}>{item.name} ({item.value || 0})</span>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </>
                                        ) : (
                                             <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: 300, opacity: 0.5 }}>
                                                  <Icon icon="solar:chart-2-line-duotone" width="48" height="48" />
                                                  <p className="mt-2 mb-0">Ma'lumot mavjud emas</p>
                                             </div>
                                        )}
                                   </Card.Body>
                              </Card>
                         </div>
                         <div className="col-12 col-xl-6">
                              <Card className="lidCard h-100">
                                   <Card.Body>
                                        <h4 className="fs-6" style={{ fontWeight: "900" }}>
                                             Lidlar Manbai
                                        </h4>

                                        {sourceData.some(d => d.value > 0) ? (
                                             <>
                                                  <ResponsiveContainer width="99%" height={300}>
                                                       <PieChart>
                                                            <Pie
                                                                 data={sourceData.filter(d => d.value > 0)}
                                                                 cx="50%"
                                                                 cy="50%"
                                                                 outerRadius={110}
                                                                 labelLine={false}
                                                                 label={renderLabel}
                                                                 dataKey="value"
                                                                 strokeWidth={0}
                                                            >
                                                                 {sourceData.filter(d => d.value > 0).map((entry, index) => (
                                                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                                                 ))}
                                                            </Pie>
                                                            <Tooltip content={<CustomTooltip />} />
                                                       </PieChart>
                                                  </ResponsiveContainer>
                                                  <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                                                       {sourceData.map((item, i) => (
                                                            <div key={i} className="d-flex align-items-center gap-2">
                                                                 <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.fill, opacity: item.value > 0 ? 1 : 0.4 }}></span>
                                                                 <span className="text-muted" style={{ fontSize: '12px', opacity: item.value > 0 ? 1 : 0.5 }}>{item.name} ({item.value || 0})</span>
                                                            </div>
                                                       ))}
                                                  </div>
                                             </>
                                        ) : (
                                             <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: 300, opacity: 0.5 }}>
                                                  <Icon icon="solar:chart-2-line-duotone" width="48" height="48" />
                                                  <p className="mt-2 mb-0">Ma'lumot mavjud emas</p>
                                             </div>
                                        )}
                                   </Card.Body>
                              </Card>
                         </div>
                    </div>

                    <div className="d-flex flex-column gap-3">

                         <hr />

                         {/* filters */}
                         <div className="d-flex flex-wrap gap-2 align-items-center">
                              <CalendarSelector onRangeSelect={handleDateRange} filters={filters} />

                              <StatusDropdown
                                   statuses={statuses}
                                   currentItem={statuses.find(s => s.key === (filters.status || "all"))}
                                   setCurrentItem={handleStatusChange}
                              />

                              {(filters.status || filters.start_date) && (
                                   <button
                                        className="btn btn-sm fs-4 d-flex align-items-center gap-2 px-3 py-2"
                                        onClick={() => {
                                             setFilters({
                                                  page: 1,
                                                  limit: filters.limit,
                                                  status: "",
                                                  source: "",
                                                  start_date: "",
                                                  end_date: "",
                                                  period: ""
                                             });
                                        }}
                                   >
                                        <Icon icon="mdi:restore" width="24" height="24" />
                                        Tozalash
                                   </button>
                              )}
                         </div>
                    </div>

                    <DataTable
                         data={leads}
                         totalCount={totalCount}
                         onPageChange={handlePageChange}
                         onEntriesChange={handleLimitChange}
                         columns={["№", "Ism", "Telefon", "Holati", "Yaratilgan vaqti", "O'qituvchi", "Kurs", "Vaqti", "Amallar"]}
                         searchKeys={["first_name", "last_name", "phone"]}
                         onSearch={(v) => handleFilterChange("search", v)}
                    >
                         {(currentData) =>
                              currentData.length > 0 ?
                                   currentData.map((lid, index) => (
                                        <tr
                                             key={index}
                                             className="cursor-pointer"
                                             onClick={() => navigate(`/leads/${lid.id}`)}
                                        >
                                             <td>{index + 1}</td>
                                             <td>{lid?.first_name + " " + lid?.last_name}</td>
                                             <td>{lid.phone}</td>
                                             <td>
                                                  <Dropdown
                                                       show={openDropdown === index}
                                                       onToggle={() => setOpenDropdown(openDropdown === index ? null : index)}
                                                       onClick={(e) => e.stopPropagation()}
                                                  >
                                                       <Dropdown.Toggle
                                                            className="no-caret"
                                                            style={{ background: "transparent", border: "none" }}
                                                       >
                                                            <div
                                                                 style={{
                                                                      padding: "3px 7px",
                                                                      borderRadius: "15px",
                                                                      background: statusStyle(lid?.status)?.style?.background || "gray",
                                                                      display: "flex",
                                                                      alignItems: "center",
                                                                      justifyContent: "center",
                                                                      color: "white",
                                                                      cursor: "pointer",
                                                                      fontSize: "12px"
                                                                 }}
                                                            >
                                                                 {statusStyle(lid?.status)?.t || "No Status"}
                                                            </div>
                                                       </Dropdown.Toggle>

                                                       <Dropdown.Menu
                                                            renderOnMount
                                                            popperConfig={{ strategy: 'fixed' }}
                                                            style={{ zIndex: 9999 }}
                                                       >
                                                            {[
                                                                 { k: "new", label: "Yangi", c: "#3b82f6" },
                                                                 { k: "contacted", label: "Bog'lanilgan", c: "#9ea5ac" },
                                                                 { k: "interested", label: "Qiziqish bildirgan", c: "#f59e0b" },
                                                                 { k: "registered", label: "Guruhga qo'shilgan", c: "#10b981" },
                                                                 { k: "lost", label: "O'chirilgan", c: "#ef4444" }
                                                            ].map(o => (
                                                                 <Dropdown.Item
                                                                      key={o.k}
                                                                      onClick={() => statusChange(o.k, lid?.id)}
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
                                             <td>{lid?.created_at?.split("T")[0].split("-").reverse().join(".")}</td>
                                             <td>
                                                  {teacherData?.find(t => t.id === Number(lid.teacher))?.first_name}
                                                  {" "}
                                                  {teacherData?.find(t => t.id === Number(lid.teacher))?.last_name}
                                             </td>
                                             <td>{lid?.course?.name}</td>
                                             <td className="text-capitalize">
                                                  {lid?.week_days?.map(d => d.full_name).join(", ")}
                                             </td>
                                             <td>
                                                  <span
                                                       className="py-2 px-2 d-flex justify-content-center align-items-center rounded-2 dots cursor-pointer"
                                                       onClick={(e) => handleChange(e, lid.id)}
                                                  >
                                                       <Icon icon="line-md:pencil-twotone" height="22" />
                                                  </span>
                                             </td>
                                        </tr>
                                   ))
                                   : (
                                        <tr>
                                             <td colSpan={10} className="text-center">
                                                  Lidlar topilmadi!
                                             </td>
                                        </tr>
                                   )
                         }
                    </DataTable>
               </div>
          </>
     )
}

export default LeadsLists;