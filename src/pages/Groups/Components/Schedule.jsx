import { Icon } from "@iconify/react"
import { useState } from "react"
import { Table } from "react-bootstrap"
import { useTheme } from "../../../Context/Context"

const Schedule = ({ schedule_items, setChange_items }) => {
     const { theme } = useTheme()
     const [isEdit, setIsEdit] = useState(true)
     const active = schedule_items?.active?.map(s => s) ?? []
     const history = schedule_items?.history?.map(s => s) ?? []
     return (
          <div className="mt-3">
               <h6 className="fw-medium">
                    Ayni paytdagi
               </h6>
               <div
                    className="mt-3 px-3 py-1 border border-primary-subtle rounded-2"
                    style={{
                         background: !theme ? "#0e315065" : "#4d9ee51d"
                    }}
               >
                    <Table className="mb-0">
                         <thead>
                              <tr>
                                   <th className="text-muted bg-transparent">№</th>
                                   <th className="text-muted bg-transparent">O'qituvchi nomi</th>
                                   <th className="text-muted bg-transparent">Dars Kunlar</th>
                                   <th className="text-muted bg-transparent">Dars Vaqti</th>
                                   <th className="text-muted bg-transparent">Amal Vaqti</th>
                                   <th className="text-muted bg-transparent">Xona</th>
                                   <th className="text-muted bg-transparent"></th>
                              </tr>
                         </thead>
                         <tbody>
                              {active.length > 0 ?
                                   active.map((s, index) =>
                                        <tr>
                                             <td className="bg-transparent">{index + 1}</td>
                                             <td className="bg-transparent">{s.teacher.first_name + " " + s.teacher.last_name}</td>
                                             <td className="bg-transparent">{s.days_of_week.map(d => d.code + ", ")}</td>
                                             <td className="bg-transparent">
                                                  {s.begin_time.slice(0, 5) + " - " + s.end_time.slice(0, 5)}
                                             </td>
                                             <td className="bg-transparent">{s.start_date} {"-"} {s.end_date !== null || undefined ? s.end_date : "Belgilanmagan"}</td>
                                             <td className="bg-transparent">{s.room?.name}</td>
                                             <td
                                                  title={!isEdit ? "Bu jadvalni tahrirlab bo'lmaydi" : ""}
                                                  className="bg-transparent cursor-pointer"
                                             >
                                                  <button
                                                       disabled={!isEdit}
                                                       className="btn btn-sm border-0"
                                                       onClick={() => setChange_items(s.id)}
                                                  >
                                                       <Icon icon="line-md:pencil" className="me-1 hover-orange" width="20" height="20" />
                                                  </button>
                                             </td>
                                        </tr>
                                   ) : (
                                        <tr>
                                             <td colSpan={7} className=" bg-transparent text-center border-bottom-0 fs-4">
                                                  Hozircha jadvallar yo‘q!
                                             </td>
                                        </tr>
                                   )
                              }
                         </tbody>
                    </Table>
               </div>

               <h6 className="mt-4 fw-medium">
                    Boshqa davrlardagi
               </h6>
               <div className="mt-3 px-3 py-1 border rounded-2">
                    <Table className="mb-0">
                         <thead>
                              <tr>
                                   <th className="text-muted bg-transparent">№</th>
                                   <th className="text-muted bg-transparent">O'qituvchi nomi</th>
                                   <th className="text-muted bg-transparent">Dars Kunlar</th>
                                   <th className="text-muted bg-transparent">Dars Vaqti</th>
                                   <th className="text-muted bg-transparent">Amal Vaqti</th>
                                   <th className="text-muted bg-transparent">Xona</th>
                              </tr>
                         </thead>
                         <tbody>
                              {history.length > 0 ?
                                   history.map((s, index) =>
                                        <tr>
                                             <td className="bg-transparent">{index + 1}</td>
                                             <td className="bg-transparent">{s.teacher.first_name + " " + s.teacher.last_name}</td>
                                             <td className="bg-transparent">{s.days_of_week.map(d => d.code + ", ")}</td>
                                             <td className="bg-transparent">
                                                  {s.begin_time.slice(0, 5) + " - " + s.end_time.slice(0, 5)}
                                             </td>
                                             <td className="bg-transparent">{s.start_date} {"-"} {s.end_date !== null || undefined ? s.end_date : "Belgilanmagan"}</td>
                                             <td className="bg-transparent">{s.room.name}</td>
                                        </tr>
                                   ) : (
                                        <tr>
                                             <td colSpan={7} className="text-center border-bottom-0 fs-4">
                                                  Eski jadvallar yo‘q!
                                             </td>
                                        </tr>
                                   )
                              }
                         </tbody>
                    </Table>
               </div>
          </div>
     )
}

export default Schedule