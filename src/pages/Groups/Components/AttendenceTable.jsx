import { Icon } from "@iconify/react"
import { useState, useMemo } from "react"
import { Dropdown, Table } from "react-bootstrap"
import { Link } from "react-router-dom"

const AttendenceTable = ({ studentsData = [], setCurrentStudents, days_of_week = [] }) => {

     // currentPage: 0 - joriy hafta, -1 - o'tgan, 1 - kelgusi
     const [currentPage, setCurrentPage] = useState(0)
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

     // Sanalarni hisoblash mantig'ini to'g'irladik
     const lessonDates = useMemo(() => {
          const dates = []
          let d = new Date()
          const day = d.getDay()
          const diff = day === 0 ? -6 : 1 - day
          
          // Dushanbadan boshlab currentPage'ga qarab suriladi
          d.setDate(d.getDate() + diff + (currentPage * 7))
          d.setHours(0, 0, 0, 0)

          const useAllDays = days_of_week.length === 0
          let tempDate = new Date(d)

          while (dates.length < 6) {
               const code = dayCodeMap[tempDate.getDay()]
               // Yakshanba bo'lmasa va tanlangan dars kunlariga to'g'ri kelsa
               if (tempDate.getDay() !== 0 && (useAllDays || days_of_week.some(day => day.code === code))) {
                    dates.push(new Date(tempDate))
               }
               tempDate.setDate(tempDate.getDate() + 1)
               
               // Cheksiz sikldan himoya (agar dars kunlari noto'g'ri kelsa)
               if (tempDate.getDate() > d.getDate() + 14) break; 
          }
          return dates
     }, [currentPage, days_of_week])

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
                              if (idx >= 0) att[idx] = { ...att[idx], status }
                              else att.push({ date: dateStr, status })
                              return att
                         })()
                    }
               )
          )
          setOpenDropdown(null) // Tanlangandan keyin yopish
     }

     return (
          <>
               {/* HEADER */}
               <div className="d-flex align-items-center gap-2 my-3">
                    <button className="btn btn-sm border" onClick={() => setCurrentPage(p => p - 1)}>
                         <Icon icon="akar-icons:chevron-left" />
                    </button>

                    <strong>
                         {lessonDates[0]?.getDate()} {monthNames[lessonDates[0]?.getMonth()]} –
                         {" "} {lessonDates.at(-1)?.getDate()} {monthNames[lessonDates.at(-1)?.getMonth()]}
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
                         {studentsData.length > 0 ? (
                              studentsData.map(student => (
                                   <tr key={student.id}>
                                        <td>
                                             <Link to={`/students/${student.student_id}`}>{student.first_name + " " + student.last_name}</Link>
                                        </td>

                                        {lessonDates.map((d, i) => {
                                             const status = getStatusForStudent(student, d)
                                             const key = `${student.id}-${d.getTime()}` // Key o'zgartirildi

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