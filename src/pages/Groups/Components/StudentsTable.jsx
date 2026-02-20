import { Icon } from "@iconify/react"
import { useState } from "react"
import { Dropdown, Table } from "react-bootstrap"
import { useUpdateStudent } from "../../../data/queries/students.queries"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { useGroupStudentStatusChange } from "../../../data/queries/group.queries"

const StudentsTable = ({ currentStudents, groupId, setNotif }) => {
     const navigate = useNavigate()
     const queryClient = useQueryClient()


     const [openDropdown, setOpenDropdown] = useState(null)
     const { mutate: groupStudentStatusChange } = useGroupStudentStatusChange()

     const statusStyle = (s) => {
          let st = s === "active" || s === "active" ? { style: { background: "#10b981" }, t: "Faol" }
               : s === "frozen" || s === "frozen" ? { style: { background: "#3b82f6" }, t: "Muzlatilgan" }
                    : s === "finished" ? { style: { background: "#9ea5ac" }, t: "Tugatgan" }
                         : s === "left" ? { style: { background: "#ef4444" }, t: "Chiqib ketgan" }
                              : { style: { background: "gray" }, t: "Status yo'q" }
          return st
     }

     const statusChange = (s, id) => {

          groupStudentStatusChange(
               { student_id: id, group_id: groupId, status: s },
               {
                    onSuccess: () => {
                         setNotif({ show: true, type: 'edited', message: "O'quvchi holati o'zgartirildi!" })
                         setOpenDropdown(null)
                    },
                    onError: (err) => {
                         console.error(err)
                         setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                    }
               }
          );
     }

     return (
          <Table striped hover className="mt-4">
               <thead>
                    <tr>
                         <th>№</th>
                         <th>Ism Familiya</th>
                         <th>Telefon</th>
                         <th>Qo'shilgan sana</th>
                         <th>Holat</th>
                         <th></th>
                    </tr>
               </thead>

               <tbody>
                    {currentStudents?.length > 0 ?
                         currentStudents.map((student, index) => (
                              <tr key={student.id}>
                                   <td>{index + 1}</td>
                                   <td
                                        onClick={() => navigate(`/students/${student.student_id}`)}
                                        className="cursor-pointer"
                                   >
                                        {student.first_name + " " + student.last_name}
                                   </td>
                                   <td>{student.phone}</td>
                                   <td>{student.joined_date?.split("-").reverse().join(".")}</td>
                                   <td>
                                        <Dropdown
                                             show={openDropdown === index}
                                             onToggle={() => setOpenDropdown(openDropdown === index ? null : index)}
                                             onClick={(e) => e.stopPropagation()}
                                        >
                                             <Dropdown.Toggle
                                                  className="no-caret p-0"
                                                  style={{ background: "transparent", border: "none" }}
                                             >
                                                  <div
                                                       className="px-3 py-1 rounded-3 fs-3"
                                                       style={{ background: statusStyle(student?.status)?.style?.background || "gray" }}
                                                  >
                                                       {statusStyle(student?.status)?.t || "No Status"}
                                                  </div>
                                             </Dropdown.Toggle>

                                             <Dropdown.Menu>
                                                  {[
                                                       { k: "frozen", label: "Muzlatilgan", c: "#3b82f6" },
                                                       { k: "finished", label: "Tugatgan", c: "#9ea5ac" },
                                                       { k: "active", label: "Faol", c: "#10b981" },
                                                       { k: "left", label: "Chiqib ketgan", c: "#ef4444" }
                                                  ].map(o => (
                                                       <Dropdown.Item
                                                            key={o.k}
                                                            onClick={() => statusChange(o.k, student?.id)}
                                                            className="no-hover-effect"
                                                       >
                                                            <span
                                                                 className="px-2 py-1 rounded-3 text-white fs-2"
                                                                 style={{ background: o.c }}
                                                            >
                                                                 {o.label}
                                                            </span>
                                                       </Dropdown.Item>
                                                  ))}
                                             </Dropdown.Menu>
                                        </Dropdown>
                                   </td>
                                   <td title="O'chirish">
                                        <Icon
                                             icon="gg:trash"
                                             width="24"
                                             height="24"
                                             className="cursor-pointer"
                                             style={{ color: "#cd3232" }}
                                        />
                                   </td>
                              </tr>
                         ))
                         : (
                              <tr className="pb-0">
                                   <td colSpan={6} className="border-bottom-0 fs-4 text-center">
                                        Hozircha o'quvchilar yo'q!
                                   </td>
                              </tr>
                         )
                    }
               </tbody>
          </Table>
     )
}

export default StudentsTable
