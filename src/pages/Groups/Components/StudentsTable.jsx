import { Icon } from "@iconify/react"
import { Table } from "react-bootstrap"
import { Link } from "react-router-dom"

const StudentsTable = ({ currentStudents }) => {
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
                    {currentStudents.length > 0 ?
                         currentStudents.map((student, index) => (
                              <tr>
                                   <td>{index + 1}</td>
                                   <td
                                        className="cursor-pointer"
                                   >
                                        <Link to={`/students/${student.id}`} style={{ textDecoration: "none" }}>
                                             {student.name}
                                        </Link>
                                   </td>
                                   <td>{student.phone}</td>
                                   <td>{student.joinDate}</td>
                                   <td>
                                        <span
                                             className="px-2 py-1 fs-2 rounded-3"
                                             style={{ background: "#00a85425", color: "#00a854" }}
                                        >
                                             Faol
                                        </span>
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