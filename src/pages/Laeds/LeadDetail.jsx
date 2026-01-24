import { useNavigate, useParams } from "react-router-dom"
import leadsData from "../../data/Leads.json"
import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import Modal from "../../components/Ui/Modal"

const LeadDetail = () => {
     const { id } = useParams()
     const navigate = useNavigate()


     const [addGroup, setAddGroup] = useState(false)
     const [removeLead, setRemoveLead] = useState(false)

     const [currentDate, setCurrentDate] = useState({})

     useEffect(() => {
          const currentLead = leadsData.find(l => l.id === Number(id))

          setCurrentDate(currentLead)
     }, [id])


     const handleRemoveLead = () => {
          leadsData.splice(leadsData.findIndex(l => l.id === Number(id)), 1)
          navigate("/leads")
     }


     return (
          <>
               {/* Modal for adding group */}
               {addGroup &&
                    <Modal
                         title="Guruhga qo'shish"
                         close={() => setAddGroup(false)}
                         anima={addGroup}
                         width="30%"
                    >
                         <div className="">
                              <label htmlFor="group">Guruh</label>
                              <select id="group" className="form-select mt-2">
                                   <option>Web Dasturlash</option>
                                   <option>Grafik Dizayn</option>
                                   <option>Digital Marketing</option>
                                   <option>IT Fundamentals</option>
                              </select>
                         </div>
                         <div className="mt-4 d-flex justify-content-end align-items-center gap-3">
                              <button
                                   className="btn btn-sm py-2 px-3"
                                   onClick={() => setAddGroup(false)}
                                   style={{ background: "#e0e0e0", color: "#000" }}
                              >
                                   Orqaga
                              </button>
                              <button
                                   className="btn btn-sm py-2 px-3"
                                   style={{ background: "#0085db", color: "#fff" }}
                              >
                                   Saqlash
                              </button>
                         </div>
                    </Modal>
               }

               {/* Modal for removing lead */}
               {removeLead &&
                    <Modal
                         title="O'quvchini ro'yhatdan o'chirish"
                         close={setRemoveLead}
                         anima={removeLead}
                         width="30%"
                    >
                         <div className="fs-3">
                              O'quvchini ro'yhatdan o'chirmoqchimisiz?
                         </div>
                         <div className="mt-4 d-flex justify-content-end align-items-center gap-3">
                              <button
                                   className="btn btn-sm py-2 px-3"
                                   onClick={() => setRemoveLead(false)}
                                   style={{ background: "#e0e0e0", color: "#000" }}
                              >
                                   Bekor qilish
                              </button>
                              <button
                                   className="btn btn-sm py-2 px-3"
                                   style={{ background: "#db0000", color: "#fff" }}
                                   onClick={handleRemoveLead}    
                              >
                                   O'chirish
                              </button>
                         </div>
                    </Modal>
               }



               <div className="card py-3 px-3">
                    <table>
                         <tr>
                              <td className="fs-3">
                                   <span>
                                        O'quvchini ismi:
                                   </span>
                                   <span className="ms-1 fw-bold">
                                        {currentDate?.name}
                                   </span>
                              </td>
                              <td className="fs-3">
                                   <span>
                                        Ro'yhatga olingan sanasi:
                                   </span>
                                   <span className="ms-1 fw-bold">
                                        {currentDate.date}
                                   </span>
                              </td>
                              <td className="fs-3">
                                   <span>
                                        Telefon raqam:
                                   </span>
                                   <span className="ms-1 fw-bold">
                                        {currentDate.phone}
                                   </span>
                              </td>
                              <td className="fs-3">
                                   <button className="btn btn-sm py-2 px-2 text-white" style={{ background: "#0085db" }}>
                                        <Icon icon="formkit:email" width="20" height="18" className="me-2" />
                                        <span className="fs-2">
                                             SMS Yuborish
                                        </span>
                                   </button>
                              </td>
                         </tr>
                    </table>
               </div>

               <div className="card py-3 px-3">
                    <table className="table">
                         <tr className="border-bottom">
                              <td className="py-2">Kurs</td>
                              <td className="py-2">Kun</td>
                              <td className="py-2">Ota-Onasi</td>
                              <td className="py-2">Ota-Onasining telifon raqami</td>
                              <td className="py-2">
                                   Izoh
                              </td>
                              <td></td>
                         </tr>
                         <tr >
                              <td>{currentDate.course}</td>
                              <td>{currentDate.time}</td>
                              <td>{currentDate.parent}</td>
                              <td>{currentDate.parent_phone}</td>
                              <td>{currentDate.description}</td>
                              <td className="d-flex justify-content-center align-items-center gap-2">
                                   <button
                                        className="btn btn-sm mt-3 d-flex justify-content-center align-items-center gap-1"
                                        style={{ border: "1px solid #09a73b", color: "#09a73b" }}
                                        title="Guruhga qo'shish"
                                        onClick={() => setAddGroup(true)}
                                   >
                                        <Icon icon="qlementine-icons:plus-16" color="#09a73b" width="16" height="16" />
                                        <span style={{ color: "#09a73b" }}>Guruhga qo'shish</span>
                                   </button>
                                   <button
                                        className="btn btn-sm mt-3 d-flex border-0 justify-content-center align-items-center gap-1"
                                        style={{ color: "#db0000" }}
                                        title="Rad etish"
                                        onClick={() => setRemoveLead(true)}
                                   >
                                        <Icon icon="flowbite:close-circle-outline" color="#db0000" width="18" height="18" />
                                        <span style={{ color: "#e01111" }}>Rad etish</span>
                                   </button>
                              </td>
                         </tr>
                    </table>
               </div>
          </>
     )
}

export default LeadDetail