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

     const selectSchedule = (schedule) => {
          setSelectedSchedule(schedule)
          // Setup default values when opening the schedule? Maybe not necessary yet.
     }

     const handleStatusChange = (student_id, status) => {
          setSelectedStatuses(prev => {
               const defaultTime = selectedSchedule?.begin_time?.slice(0, 5) || "";
               const current = prev[student_id] || { comment: "" };

               // Yoki avvalgi kiritgan vaqti saqlanib qoladi, yoki avtomatik dars vaqti belgilanadi
               let time = current.time;
               if ((status === "present" || status === "late") && !time) {
                    time = defaultTime;
               } else if (status === "absent" || status === "excused") {
                    time = ""; // Vaqt kerak emas
               }

               return {
                    ...prev,
                    [student_id]: {
                         ...current,
                         status,
                         time
                    }
               };
          });
     };

     const handleTimeChange = (student_id, time) => {
          setSelectedStatuses(prev => ({
               ...prev,
               [student_id]: {
                    ...(prev[student_id] || { status: "", comment: "" }),
                    time
               }
          }));
     };

     const handleCommentChange = (student_id, comment) => {
          setSelectedStatuses(prev => ({
               ...prev,
               [student_id]: {
                    ...(prev[student_id] || { status: "", time: "" }),
                    comment
               }
          }));
     };

     const saveAttendance = () => {
          const items = Object.keys(selectedStatuses).map(student_id => ({
               student_id: Number(student_id),
               status: selectedStatuses[student_id].status,
               time: selectedStatuses[student_id].time || undefined,
               comment: selectedStatuses[student_id].comment || undefined
          }))

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

     const statuses = [
          { id: 'present', label: 'Keldi', color: '#00a854', icon: 'mingcute:check-fill' },
          { id: 'late', label: 'Kech qoldi', color: '#c48a07', icon: 'mingcute:time-fill' },
          { id: 'excused', label: 'Sababli', color: '#0881c2', icon: 'mingcute:information-fill' },
          { id: 'absent', label: 'Kelmadi', color: '#ff4d4d', icon: 'mingcute:close-fill' }
     ]

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
                         <Table className="align-middle border-top">
                              <thead className="bg-light">
                                   <tr>
                                        <th style={{ width: '25%' }}>O‘quvchi</th>
                                        <th style={{ width: '45%' }}>Davomat Holati</th>
                                        <th style={{ width: '30%' }}>Qo'shimcha</th>
                                   </tr>
                              </thead>

                              <tbody>
                                   {studentsData.length > 0 ? (
                                        studentsData.map(student => {
                                             const statObj = selectedStatuses[student.student_id] || {};
                                             const status = statObj.status;
                                             
                                             return (
                                             <tr key={student.student_id}>
                                                  <td>
                                                       <Link to={`/students/${student.student_id}`} className="text-decoration-none text-dark fw-medium d-flex align-items-center gap-2">
                                                            <div className="avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 35, height: 35 }}>
                                                                 {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                                                            </div>
                                                            {student.first_name} {student.last_name}
                                                       </Link>
                                                  </td>
                                                  <td>
                                                       <div className="d-flex flex-wrap gap-2">
                                                            {statuses.map(s => (
                                                                 <button
                                                                      key={s.id}
                                                                      className="btn btn-sm border d-flex align-items-center gap-1"
                                                                      onClick={() => handleStatusChange(student.student_id, s.id)}
                                                                      style={{
                                                                           backgroundColor: status === s.id ? s.color : 'transparent',
                                                                           borderColor: status === s.id ? s.color : '#e2e8f0',
                                                                           color: status === s.id ? '#ffffff' : '#64748b',
                                                                           fontWeight: status === s.id ? '600' : '400',
                                                                           transition: 'all 0.2s'
                                                                      }}
                                                                 >
                                                                      <Icon icon={s.icon} width="16" height="16" />
                                                                      {s.label}
                                                                 </button>
                                                            ))}
                                                       </div>
                                                  </td>
                                                  <td>
                                                       <div className="d-flex align-items-center gap-2">
                                                            {(status === 'present' || status === 'late') && (
                                                                 <div className="d-flex align-items-center bg-white border border-secondary-subtle rounded px-2" style={{ height: '32px' }}>
                                                                      <Icon icon="tabler:clock" width="16" height="16" className="text-primary opacity-75 me-1" />
                                                                      <input 
                                                                           type="time" 
                                                                           className="border-0 bg-transparent text-secondary cursor-pointer" 
                                                                           style={{ width: "auto", minWidth: "75px", outline: "none", fontSize: "14px", fontWeight: "500" }}
                                                                           value={statObj.time || ""}
                                                                           onChange={(e) => handleTimeChange(student.student_id, e.target.value)}
                                                                           title="Kelgan vaqt"
                                                                      />
                                                                 </div>
                                                            )}
                                                            {status && (
                                                                 <div className="d-flex align-items-center bg-white border border-secondary-subtle rounded px-2" style={{ height: '32px' }}>
                                                                      <Icon icon="tabler:message-circle" width="16" height="16" className="text-secondary opacity-75 me-1" />
                                                                      <input 
                                                                           type="text" 
                                                                           className="border-0 bg-transparent text-secondary"
                                                                           style={{ width: "120px", outline: "none", fontSize: "14px" }}
                                                                           placeholder="Izoh yozish..."
                                                                           value={statObj.comment || ""}
                                                                           onChange={(e) => handleCommentChange(student.student_id, e.target.value)}
                                                                      />
                                                                 </div>
                                                            )}
                                                       </div>
                                                  </td>
                                             </tr>
                                        )})
                                   ) : (
                                        <tr>
                                             <td colSpan={3} className="text-center py-5 text-muted">
                                                  <Icon icon="mingcute:sleep-fill" width={40} height={40} className="mb-2 opacity-50" />
                                                  <p className="mb-0 fs-4">Hozircha o‘quvchilar yo‘q!</p>
                                             </td>
                                        </tr>
                                   )}
                              </tbody>
                         </Table>

                         <div className="d-flex justify-content-end mt-3">
                              <button
                                   className="btn btn-sm py-2 px-3 fs-3 d-flex align-items-center gap-2 shadow-sm border-0"
                                   style={{ background: "#0881c2", color: "#fff" }}
                                   onClick={saveAttendance}
                                   disabled={Object.keys(selectedStatuses).length === 0}
                              >
                                   <Icon icon="mingcute:check-2-fill" width="20" height="20" />
                                   Saqlash
                              </button>
                         </div>
                    </>
               )}
          </div >
     )
}

export default AttendenceTable