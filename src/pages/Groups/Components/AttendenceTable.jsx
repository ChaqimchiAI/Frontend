import { Icon } from "@iconify/react"
import { useStudentAttendances, useAttendances, useGroupAttendances, useCreateAttendance } from "../../../data/queries/attendances.queries"
import { useState, useMemo } from "react"
import { Dropdown, Table } from "react-bootstrap"
import { Link } from "react-router-dom"

const AttendenceTable = ({ days_of_week = [], scheduleId, id }) => {
     const { mutate: updateAttendance } = useCreateAttendance()

     // monthOffset: 0 - joriy oy, -1 - o'tgan oy, 1 - kelgusi oy
     const [monthOffset, setMonthOffset] = useState(0)
     const [openDropdown, setOpenDropdown] = useState(null)

     const dayCodeMap = {
          1: "Du",
          2: "Se",
          3: "Cho",
          4: "Pay",
          5: "Ju",
          6: "Sha",
          0: "Ya"
     }

     const monthNames = [
          "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
          "Iyul", "Avgust", "Sentyabr", "Oktabr", "Noyabr", "Dekabr"
     ]

     const date = useMemo(() => {
          const now = new Date()
          return now.toISOString().slice(0, 10).split('-').reverse().join('.')
     }, [monthOffset])

     const studentsData =  []
     // const attendanceId = attendancesData?.id

     const lessonDates = useMemo(() => {
          const dates = []
          const now = new Date()
          const year = now.getFullYear()
          const month = now.getMonth() + monthOffset

          const lastDate = new Date(year, month + 1, 0).getDate()
          const useAllDays = days_of_week.length === 0

          for (let i = 1; i <= lastDate; i++) {
               const tempDate = new Date(year, month, i)
               const code = dayCodeMap[tempDate.getDay()]

               // Yakshanba bo'lmasa va tanlangan dars kunlariga to'g'ri kelsa
               if (tempDate.getDay() !== 0 && (useAllDays || days_of_week.some(day => day.code === code))) {
                    dates.push(new Date(tempDate))
               }
          }
          return dates
     }, [monthOffset, days_of_week])

     const mapStatusToUI = (status) => {
          if (status === "absent" || status === "yoq") return "yoq"
          if (status === "present" || status === "arrived" || status === "bor") return "bor"
          if (status === "caused" || status === "sababli") return "sababli"
          if (status === "late" || status === "Kech qoldi") return "Kech qoldi"
          return status
     }

     const mapStatusToAPI = (status) => {
          if (status === "bor") return "present"
          if (status === "yoq") return "absent"
          if (status === "sababli") return "caused"
          if (status === "Kech qoldi") return "late"
          return status
     }

     const getStatusForStudent = (student, date) => {
          const dateStr = date.toISOString().slice(0, 10)

          if (attendancesData?.date === dateStr && student.status) {
               return mapStatusToUI(student.status)
          }

          if (Array.isArray(student.attendance)) {
               const hist = student.attendance.find(a => a.date === dateStr)
               return hist ? mapStatusToUI(hist.status) : null
          }

          return null
     }

     const renderBadge = (status) => {
          if (status === "bor") return "#00a854"
          if (status === "yoq") return "#ff4d4d"
          if (status === "sababli") return "#c48a07"
          if (status === "Kech qoldi") return "#c48a07"
          return "transparent"
     }

     const handleSetAttendance = () => {} // = (studentId, date, newStatus) => {
     //      const dateStr = date.toISOString().slice(0, 10)

     //      // Agar bizda joriy kungi davomat ID si bo'lsa va tanlangan sana mos kelsa
     //      if (attendanceId && attendancesData.date === dateStr) {
     //           const updatedItems = studentsData.map(item =>
     //                item.student_id === studentId ? { ...item, status: mapStatusToAPI(newStatus) } : item
     //           )

     //           updateAttendance({
     //                id: attendanceId,
     //                data: { items: updatedItems }
     //           })
     //      } else {
     //           // Agar boshqa sana bo'lsa, hozircha faqat local stateni o'zgartiramiz 
     //           if (typeof setCurrentStudents === "function") {
     //                setCurrentStudents(prev =>
     //                     prev.map(s =>
     //                          s.student_id !== studentId ? s : {
     //                               ...s,
     //                               attendance: (() => {
     //                                    const att = Array.isArray(s.attendance) ? [...s.attendance] : []
     //                                    const idx = att.findIndex(a => a.date === dateStr)
     //                                    if (idx >= 0) att[idx] = { ...att[idx], status: newStatus }
     //                                    else att.push({ date: dateStr, status: newStatus })
     //                                    return att
     //                               })()
     //                          }
     //                     )
     //                )
     //           }
     //      }
     //      setOpenDropdown(null)
     // }

     const currentHeaderMonth = useMemo(() => {
          const now = new Date()
          const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
          return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`
     }, [monthOffset])

     return (
          <div className="attendence-wrapper" style={{ overflowX: "auto" }}>
               {/* HEADER */}
               <div className="d-flex align-items-center gap-3 my-3">
                    <button className="btn btn-sm border" onClick={() => setMonthOffset(p => p - 1)}>
                         <Icon icon="akar-icons:chevron-left" />
                    </button>

                    <span className="fs-4 fw-semibold">
                         {currentHeaderMonth}
                    </span>

                    <button className="btn btn-sm border" onClick={() => setMonthOffset(p => p + 1)}>
                         <Icon icon="akar-icons:chevron-right" />
                    </button>

                    <div className="ms-auto d-flex gap-3 small text-muted">
                         <div className="d-flex align-items-center gap-1">
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00a854" }} /> Bor
                         </div>
                         <div className="d-flex align-items-center gap-1">
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff4d4d" }} /> Yo'q
                         </div>
                         <div className="d-flex align-items-center gap-1">
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#c48a07" }} /> Sababli
                         </div>
                    </div>
               </div>

               {/* TABLE */}
               <Table>
                    <thead>
                         <tr>
                              <th>O‘quvchi</th>
                              {lessonDates.map((d, i) => (
                                   <th key={i} className="text-center" style={{ minWidth: "45px" }}>
                                        <div style={{ fontSize: "12px", opacity: 0.6 }}>{dayCodeMap[d.getDay()]}</div>
                                        <div className="fw-bold">{d.getDate()}</div>
                                   </th>
                              ))}
                         </tr>
                    </thead>

                    <tbody>
                         {studentsData.length > 0 ? (
                              studentsData.map(student => (
                                   <tr key={student.student_id}>
                                        <td style={{ position: "sticky", left: 0, background: "#f8f9fa", zIndex: 1, borderRight: "2px solid #dee2e6" }}>
                                             <Link to={`/students/${student.student_id}`} className="text-decoration-none text-dark fw-medium">
                                                  {student.full_name}
                                             </Link>
                                        </td>

                                        {lessonDates.map((d, i) => {
                                             const status = getStatusForStudent(student, d)
                                             const key = `${student.student_id}-${d.getTime()}`

                                             const isCurrentAttendanceDate = attendancesData?.date === d.toISOString().slice(0, 10)

                                             return (
                                                  <td key={i} className="text-center p-1" style={{ opacity: isCurrentAttendanceDate ? 1 : 0.5 }}>
                                                       <Dropdown
                                                            show={openDropdown === key}
                                                            onToggle={() =>
                                                                 setOpenDropdown(openDropdown === key ? null : key)
                                                            }
                                                            drop="down"
                                                       >
                                                            <Dropdown.Toggle
                                                                 className="no-caret p-0"
                                                                 style={{ background: "transparent", border: "none" }}
                                                                 disabled={!isCurrentAttendanceDate}
                                                            >
                                                                 <div
                                                                      style={{
                                                                           width: 24,
                                                                           height: 24,
                                                                           border: isCurrentAttendanceDate ? "1px solid #00a0ea" : "1px solid #dee2e6",
                                                                           borderRadius: "50%",
                                                                           margin: "0 auto",
                                                                           padding: "2px"
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

                                                            <Dropdown.Menu className="shadow-sm border-0">
                                                                 {[
                                                                      { k: "bor", label: "Bor", c: "#00a854" },
                                                                      { k: "yoq", label: "Yo‘q", c: "#ff4d4d" },
                                                                      { k: "sababli", label: "Sababli", c: "#c48a07" }
                                                                 ].map(o => (
                                                                      <Dropdown.Item
                                                                           key={o.k}
                                                                           onClick={() => handleSetAttendance(student.student_id, d, o.k)}
                                                                           className="d-flex align-items-center gap-2 py-2"
                                                                      >
                                                                           <div style={{ width: 8, height: 8, borderRadius: "50%", background: o.c }} />
                                                                           <span>{o.label}</span>
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
                                   <td colSpan={lessonDates.length + 1} className="text-center py-4 text-muted">
                                        Hozircha o‘quvchilar yo‘q!
                                   </td>
                              </tr>
                         )}
                    </tbody>
               </Table>
          </div>
     )
}

export default AttendenceTable