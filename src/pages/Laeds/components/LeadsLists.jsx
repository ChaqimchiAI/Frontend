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

const sourcesD = [
     { key: "all", label: "Barcha manbalar", },
     { key: "Telegram", label: "Telegram", },
     { key: "Facebook", label: "Facebook", },
     { key: "Tavsiya", label: "Tavsiya", },
     { key: "Banner", label: "Banner", },
     { key: "Instagram", label: "Instagram", },
];


const LeadsLists = ({ leads, totalCount, filters, setFilters, setOpemModal, setChangeData, setShow }) => {
     const navigate = useNavigate()

     const { data: teachers } = useTeachersData()
     const teacherData = teachers?.results

     const { mutate: updateLead } = useUpdateLead();

     const { data: stats } = useLeadsStats(filters)

     const [openDropdown, setOpenDropdown] = useState(null)

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

     const handleSourceChange = (source) => {
          setFilters(prev => ({ ...prev, source: source.key === "all" ? "" : source.key, page: 1 }));
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


     const handleSearch = (query) => {
          setFilters(prev => ({ ...prev, search: query, page: 1 }));
     };

     return (
          <>
               <div className="card card-body px-4 mt-3 overflow-hidden">

                    <div className="row g-3 mb-4 mx-0">
                         <div className="col-12 col-xl-6">
                              <Card className="lidCard h-100">
                                   <Card.Body>
                                        <h4 className="fs-6" style={{ fontWeight: "900" }}>
                                             Lidlar Holati
                                        </h4>

                                        <ResponsiveContainer width="99%" height={300}>
                                             <PieChart>
                                                  <Pie
                                                       data={statusData}
                                                       cx="50%"
                                                       cy="50%"
                                                       labelLine={false}
                                                       label={(entry) => entry.name}
                                                       outerRadius={100}
                                                       fill="#8884d8"
                                                       dataKey="value"
                                                  >
                                                       {statusData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                                       ))}
                                                  </Pie>
                                                  <Tooltip />
                                             </PieChart>
                                        </ResponsiveContainer>
                                   </Card.Body>
                              </Card>
                         </div>
                         <div className="col-12 col-xl-6">
                              <Card className="lidCard h-100">
                                   <Card.Body>
                                        <h4 className="fs-6" style={{ fontWeight: "900" }}>
                                             Lidlar Manbai
                                        </h4>

                                        <ResponsiveContainer width="99%" height={300}>
                                             <PieChart>
                                                  <Pie
                                                       data={sourceData}
                                                       cx="50%"
                                                       cy="50%"
                                                       labelLine={false}
                                                       label={(entry) => entry.name}
                                                       outerRadius={100}
                                                       fill="#8884d8"
                                                       dataKey="value"
                                                  >
                                                       {sourceData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                                       ))}
                                                  </Pie>
                                                  <Tooltip />
                                             </PieChart>
                                        </ResponsiveContainer>
                                   </Card.Body>
                              </Card>
                         </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                         <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                              <div className="d-flex flex-column gap-1">
                                   <h4 className="fs-6">Lidlar ro'yhati</h4>
                                   <span className="text-muted">Barcha lidlar ma'lumotlari</span>
                              </div>
                              <button
                                   className="btn btn-sm fs-3 px-4 text-white"
                                   style={{ background: "#0085db", padding: "10px 20px" }}
                                   onClick={() => setShow(true)}
                              >
                                   <Icon icon="qlementine-icons:plus-16" width="15" height="15" />
                                   &nbsp;
                                   Yangi lid qo'shish
                              </button>
                         </div>

                         {/* filters */}
                         <div className="d-flex flex-wrap gap-2 align-items-center">
                              <CalendarSelector onRangeSelect={handleDateRange} filters={filters} />

                              <StatusDropdown
                                   statuses={statuses}
                                   currentItem={statuses.find(s => s.key === (filters.status || "all"))}
                                   setCurrentItem={handleStatusChange}
                              />

                              <StatusDropdown
                                   statuses={sourcesD}
                                   currentItem={sourcesD.find(s => s.key === (filters.source || "all"))}
                                   setCurrentItem={handleSourceChange}
                              />

                              {(filters.status || filters.source || filters.start_date) && (
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
                         onSearch={handleSearch}
                         columns={["№", "Ism", "Telefon", "Holati", "Yaratilgan vaqti", "O'qituvchi", "Kurs", "Vaqti", "Amallar"]}
                         searchKeys={["first_name", "last_name", "phone"]}
                    >
                         {(currentData) =>
                              currentData.map((lid, index) => (
                                   <tr
                                        key={index}
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/leads/${lid.id}`)}
                                   >
                                        <td>{lid.id}</td>
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

                                                  <Dropdown.Menu>
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
                                             {lid?.week_days?.map(d => d.code + ", ")}
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
                         }
                    </DataTable>
               </div>
          </>
     )
}

export default LeadsLists;