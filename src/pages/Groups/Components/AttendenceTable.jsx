import { useCreateAttendance, useGroupAttendances } from "../../../data/queries/attendances.queries"
import { useState, useEffect } from "react"
import { Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import { Icon } from "@iconify/react"

const AttendenceTable = ({ setNotif,studentsData, schedule_items, }) => {
     const { mutate: updateAttendance } = useCreateAttendance()

     const [selectedStatuses, setSelectedStatuses] = useState({})
     const [selectedSchedule, setSelectedSchedule] = useState(null)

     const { data: attendances, error } = useGroupAttendances(selectedSchedule?.id)
     console.log(attendances);
     
     console.error(error);         


     const selectSchedule = (schedule) => {
          console.log(attendances);

          setSelectedSchedule(schedule)
     }

     const saveAttendance = () => {
          const items = Object.keys(selectedStatuses).map(student_id => ({
               student_id: Number(student_id),
               status: selectedStatuses[student_id]
          }))

          console.log(items);


          updateAttendance(
               {
                    id: selectedSchedule?.id,
                    data: items
               },
               {
                    onSuccess: () => {
                         setNotif({ show: true, type: "edited", message: "Davomat saqlandi" })
                    },
                    onError: (err) => {
                         console.error(err)
                         setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                    }
               }
          )
     }

     return (
          <div className="attendence-wrapper mt-2" style={{ overflowX: "auto" }}>
               {schedule_items?.length > 1 && !selectedSchedule ? (
                    <div className="d-flex flex-wrap gap-3 w-100 p-2">
                         {schedule_items.map(item => (
                              <div
                                   key={item.id}
                                   className="card card-hover px-3 border py-3 shadow-sm"
                                   style={{ width: "25%", minWidth: "250px", cursor: "pointer", transition: "all 0.2s" }}
                                   onClick={() => selectSchedule(item)}
                              >
                                   <div className="d-flex align-items-center mb-2" style={{ color: "#00c8ff" }}>
                                        <Icon icon="ion:calendar-outline" width="20" height="20" className="me-2" />
                                        <span className="fs-3 fw-medium">Dars jadvali</span>
                                   </div>
                                   <div className="fs-3 fw-medium text-dark mb-1">
                                        {item.days_of_week?.map(d => d.full).join(", ")}
                                   </div>
                                   <div className="d-flex align-items-center text-muted mb-2 fs-2">
                                        <Icon icon="tabler:clock" width="15" height="15" className="me-2" />
                                        {item.begin_time?.slice(0, 5) || "Belgilanmagan"} {item.end_time ? `- ${item.end_time.slice(0, 5)}` : ""}
                                   </div>
                                   <div className="mt-auto pt-2 border-top d-flex align-items-center text-secondary">
                                        <Icon icon="mage:user" width="18" height="18" className="me-2" />
                                        <span>{item.teacher ? `${item.teacher.first_name} ${item.teacher.last_name}` : "O'qituvchi belgilanmagan"}</span>
                                   </div>
                              </div>
                         ))}
                    </div>
               ) : (
                    <>
                         {schedule_items?.length > 1 && selectedSchedule && (
                              <button
                                   className="btn btn-sm border mb-3 d-flex align-items-center bg-white text-dark shadow-sm"
                                   onClick={() => setSelectedSchedule(null)}
                              >
                                   <Icon icon="ion:arrow-back" width="18" height="18" className="me-2" />
                                   Jadvallarga qaytish
                              </button>
                         )}
                         {/* Table */}
                         <Table>
                              <thead>
                                   <tr>
                                        <th>O‘quvchi</th>
                                        <th>
                                             <div className="d-flex align-items-center gap-1">
                                                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00a854" }} /> Keldi
                                             </div>
                                        </th>
                                        <th>
                                             <div className="d-flex align-items-center gap-1">
                                                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff4d4d" }} /> Kelmadi
                                             </div>
                                        </th>
                                        <th>
                                             <div className="d-flex align-items-center gap-1">
                                                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#c48a07" }} /> Kech keldi
                                             </div>
                                        </th>
                                        <th>
                                             <div className="d-flex align-items-center gap-1">
                                                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0881c2" }} /> Sababli
                                             </div>
                                        </th>
                                   </tr>
                              </thead>

                              <tbody>
                                   {studentsData.length > 0 ? (
                                        studentsData.map(student => (
                                             <tr key={student.student_id}>
                                                  <td style={{ position: "sticky", left: 0, zIndex: 1 }}>
                                                       <Link to={`/students/${student.student_id}`} className="text-decoration-none text-dark fw-medium">
                                                            {student.first_name} {student.last_name}
                                                       </Link>
                                                  </td>
                                                  <td className="ps-3">
                                                       <div
                                                            className="circle border"
                                                            onClick={() => setSelectedStatuses(prev => ({ ...prev, [student.student_id]: "present" }))}
                                                            style={{ background: selectedStatuses[student.student_id] === "present" ? "#00a854" : "" }}
                                                       />
                                                  </td>
                                                  <td className="ps-3">
                                                       <div
                                                            className="circle border"
                                                            onClick={() => setSelectedStatuses(prev => ({ ...prev, [student.student_id]: "absent" }))}
                                                            style={{ background: selectedStatuses[student.student_id] === "absent" ? "#ff4d4d" : "" }}
                                                       />
                                                  </td>
                                                  <td className="ps-3">
                                                       <div
                                                            className="circle border"
                                                            onClick={() => setSelectedStatuses(prev => ({ ...prev, [student.student_id]: "late" }))}
                                                            style={{ background: selectedStatuses[student.student_id] === "late" ? "#c48a07" : "" }}
                                                       />
                                                  </td>
                                                  <td className="ps-3">
                                                       <div
                                                            className="circle border"
                                                            onClick={() => setSelectedStatuses(prev => ({ ...prev, [student.student_id]: "excused" }))}
                                                            style={{ background: selectedStatuses[student.student_id] === "excused" ? "#0881c2" : "" }}
                                                       />
                                                  </td>
                                             </tr>
                                        ))
                                   ) : (
                                        <tr>
                                             <td colSpan={6} className="text-center py-4 text-muted">
                                                  Hozircha o‘quvchilar yo‘q!
                                             </td>
                                        </tr>
                                   )}
                              </tbody>
                         </Table>

                         <div className="d-flex justify-content-end mt-3">
                              <button
                                   className="btn btn-sm save-button"
                                   onClick={saveAttendance}
                                   disabled={Object.keys(selectedStatuses).length === 0}
                              >
                                   Saqlash
                              </button>
                         </div>
                    </>
               )}
          </div >
     )
}

export default AttendenceTable