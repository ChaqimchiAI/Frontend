import { Icon } from "@iconify/react"
import { useState } from "react"
import { Dropdown, Table } from "react-bootstrap"
import { Link } from "react-router-dom"

const AttendenceTable = ({ currentStudents = [], studentsData = [], setCurrentStudents, days_of_week = [] }) => {

     // Haftaning dushanbasi
     const [weekStart] = useState(() => {
          const d = new Date()
          const day = d.getDay()
          const diff = day === 0 ? -6 : 1 - day
          d.setDate(d.getDate() + diff)
          d.setHours(0, 0, 0, 0)
          return d
     })

     const [currentPage, setCurrentPage] = useState(1)
     const [openDropdown, setOpenDropdown] = useState(null)

     const dayCodeMap = {
          1: "Du",
          2: "Se",
          3: "Cho",
          4: "Pay",
          5: "Ju",
          6: "Sha"
     }

     const monthNames = [
          "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
          "Iyul", "Avgust", "Sentyabr", "Oktabr", "Noyabr", "Dekabr"
     ]

     const lessonDates = []
     let d = new Date(weekStart)
     d.setDate(d.getDate() + (currentPage - 1) * 7)

     const useAllDays = currentStudents.length === 0

     while (lessonDates.length < 6) {
          const code = dayCodeMap[d.getDay()]

          if (
               d.getDay() !== 0 &&
               (useAllDays || days_of_week.some(day => day.code === code))
          ) {
               lessonDates.push(new Date(d))
          }

          d.setDate(d.getDate() + 1)
     }

     const getStatusForStudent = (s, date) =>
          s.attendance?.find(a => a.date === date.toISOString().slice(0, 10))?.status ?? null

     const renderBadge = (status) => {
          if (status === "bor") return "#00a854"
          if (status === "yoq") return "#ff4d4d"
          if (status === "sababli") return "#c48a07"
          return "transparent"
     }

     const handleSetAttendance = (studentId, date, status) => {
          const dateStr = date.toISOString().slice(0, 10)

          setCurrentStudents(prev =>
               prev.map(s =>
                    s.id !== studentId ? s : {
                         ...s,
                         attendance: (() => {
                              const att = Array.isArray(s.attendance) ? [...s.attendance] : []
                              const idx = att.findIndex(a => a.date === dateStr)
                              if (idx >= 0) att[idx].status = status
                              else att.push({ date: dateStr, status })
                              return att
                         })()
                    }
               )
          )
     }

     return (
          <>
               {/* HEADER */}
               <div className="d-flex align-items-center gap-2 my-3">
                    <button className="btn btn-sm border" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                         <Icon icon="akar-icons:chevron-left" />
                    </button>

                    <strong>
                         {lessonDates[0]?.getDate()} {monthNames[lessonDates[0]?.getMonth()]} –
                         {lessonDates.at(-1)?.getDate()} {monthNames[lessonDates.at(-1)?.getMonth()]}
                    </strong>

                    <button className="btn btn-sm border" onClick={() => setCurrentPage(p => p + 1)}>
                         <Icon icon="akar-icons:chevron-right" />
                    </button>
               </div>

               {/* TABLE */}
               <Table striped hover>
                    <thead>
                         <tr>
                              <th>O‘quvchi</th>
                              {lessonDates.map((d, i) => (
                                   <th key={i} className="text-center">
                                        {dayCodeMap[d.getDay()]}
                                        <div className="fs-3">{d.getDate()}</div>
                                   </th>
                              ))}
                         </tr>
                    </thead>

                    <tbody>
                         {currentStudents.length > 0 ? (
                              currentStudents.map(student => (
                                   <tr key={student.id}>
                                        <td>
                                             <Link to={`/students/${student.id}`}>{student.name}</Link>
                                        </td>

                                        {lessonDates.map((d, i) => {
                                             const status = getStatusForStudent(student, d)
                                             const key = `${student.id}-${i}`

                                             return (
                                                  <td key={i} className="text-center">
                                                       <Dropdown
                                                            show={openDropdown === key}
                                                            onToggle={() =>
                                                                 setOpenDropdown(openDropdown === key ? null : key)
                                                            }
                                                       >
                                                            <Dropdown.Toggle
                                                                 className="no-caret"
                                                                 style={{ background: "transparent", border: "none" }}
                                                            >
                                                                 <div
                                                                      style={{
                                                                           width: 26,
                                                                           height: 26,
                                                                           border: "1px solid #ccc",
                                                                           borderRadius: "50%"
                                                                      }}
                                                                 >
                                                                      <div
                                                                           style={{
                                                                                width: "100%",
                                                                                height: "100%",
                                                                                borderRadius: "50%",
                                                                                background: renderBadge(status)
                                                                           }}
                                                                      />
                                                                 </div>
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                 {[
                                                                      { k: "bor", label: "Bor", c: "#00a854" },
                                                                      { k: "yoq", label: "Yo‘q", c: "#ff4d4d" },
                                                                      { k: "sababli", label: "Sababli", c: "#c48a07" }
                                                                 ].map(o => (
                                                                      <Dropdown.Item
                                                                           key={o.k}
                                                                           onClick={() => handleSetAttendance(student.id, d, o.k)}
                                                                      >
                                                                           <span style={{ color: o.c }}>{o.label}</span>
                                                                      </Dropdown.Item>
                                                                 ))}
                                                            </Dropdown.Menu>
                                                       </Dropdown>
                                                  </td>
                                             )
                                        })}
                                   </tr>
                              ))
                         ) : (
                              <tr>
                                   <td colSpan={7} className="text-center border-bottom-0 fs-4">
                                        Hozircha o‘quvchilar yo‘q!
                                   </td>
                              </tr>
                         )}
                    </tbody>
               </Table>
          </>
     )
}

export default AttendenceTable
