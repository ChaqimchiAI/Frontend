import { Card, Spinner } from "react-bootstrap"
import { Icon } from "@iconify/react"
import { useState } from "react";
import { Input } from "../../components/Ui/Input";
import Notification from "../../components/Ui/Notification"
import Modal from "../../components/Ui/Modal"

// API malumotlarini olish
import { useEditLead, useLeads, useLeadsStats } from "../../data/queries/leads.queries"
import { useTeachersData } from "../../data/queries/teachers.queries";
import { useCourses } from "../../data/queries/courses.queries";
import NewLead from "./components/NewLead";
import LeadsLists from "./components/LeadsLists";
import SelectDay from "../../components/Ui/SelectDay";

const Leads = () => {

     const [filters, setFilters] = useState({
          page: 1,
          limit: 10,
          status: "",
          start_date: "",
          end_date: "",
          period: "",
          search: ""
     });

     // lidlarni royxati
     const { data, isLoading, error } = useLeads(filters);
     const leads = data?.results || [];
     const totalCount = data?.count || 0;


     // lidlar boyicha statistika 
     const { data: stats } = useLeadsStats(filters)

     // lidlarni o'zgartirish
     const { mutate: editLead, isPending: editLeadPending } = useEditLead()

     // guruhlarni olish
     const { data: teachers } = useTeachersData()
     const teacherData = teachers?.results

     // kurslarni olish
     const { data: courses } = useCourses()
     const coursesData = courses?.results

     if (isLoading) return <div>Loading...</div>
     if (error) return <div style={{ color: "red" }}>Xatolik: {error.message}</div>

     const [opemModal, setOpemModal] = useState(false)
     const [show, setShow] = useState(false)

     const [changeData, setChangeData] = useState({})

     const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })

     // lead malumotlarini o'zgartirish
     const changeLeadsData = (e) => {
          e.preventDefault()

          if (!(
               changeData.first_name ||
               changeData.last_name ||
               changeData.phone ||
               changeData.course ||
               changeData.teacher ||
               changeData.week_days
          )) {
               setNotif({ show: true, type: "warn", message: "Asosiy joylarni to'ldiring!" })
               return
          }

          const dataToSend = {
               first_name: changeData.first_name,
               last_name: changeData.last_name,
               phone: changeData.phone,
               course: Number(changeData.course.id || changeData.course),
               teacher: Number(changeData.teacher),
               week_days: changeData.week_days.map(d => d?.id || d)
          }

          editLead(
               { id: changeData.id, data: dataToSend },
               {
                    onSuccess: () => {
                         setNotif({ show: true, type: "success", message: "Ma'lumotlar yangilandi!" })
                         setOpemModal(false)
                         setChangeData({})
                    },
                    onError: () => {
                         setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" })
                    }
               }
          )
     }

     return (
          <>

               {/* Bildirishnoma */}
               {notif.show && (
                    <Notification
                         type={notif.type}
                         message={notif.message}
                         onClose={() => setNotif({ ...notif, show: false })}
                    />
               )}


               {/* Ma'lumotni tahrirlash uchun modal */}
               {opemModal &&
                    <Modal
                         title={`${changeData?.first_name} ning ma'lumotlarini yangilash!`}
                         close={setOpemModal}
                         anima={opemModal}
                         width="50%"
                         zIndex={100}
                    >
                         <div className="d-flex justify-content-between gap-3 mt-2">
                              <div className="d-flex flex-column w-50">
                                   <span className="fw-bold align-self-end text-white-50">
                                        Asosiy
                                   </span>
                                   <Input
                                        label="Ism"
                                        defaultValue={changeData?.first_name}
                                        onChange={(e) => setChangeData({ ...changeData, first_name: e.target.value })}
                                        required
                                   />
                                   <Input
                                        label="Familya"
                                        defaultValue={changeData?.last_name}
                                        onChange={(e) => setChangeData({ ...changeData, last_name: e.target.value })}
                                        required
                                   />
                                   <Input
                                        label="Telifon raqam"
                                        defaultValue={changeData?.phone}
                                        onChange={(e) => setChangeData({ ...changeData, phone: e.target.value })}
                                        required
                                   />
                                   <div className="d-flex flex-column">
                                        <label htmlFor="course" className="form-label">
                                             Kurs
                                        </label>
                                        <select
                                             required
                                             id="course"
                                             className="form-select"
                                             value={changeData.course.id}
                                             onChange={(e) => setChangeData({ ...changeData, course: e.target.value })}
                                        >
                                             <option hidden>Kurs tanlash</option>

                                             {coursesData.map(c => (
                                                  <option value={c.id}>{c.name}</option>
                                             ))}
                                        </select>
                                   </div>
                                   <div className="d-flex flex-column mt-3">
                                        <label htmlFor="teacher" className="form-label">
                                             O'qituvchisi
                                        </label>
                                        <select
                                             required
                                             id="teacher"
                                             className="form-select"
                                             value={changeData.teacher}
                                             onChange={(e) => setChangeData({ ...changeData, teacher: e.target.value })}
                                        >
                                             <option hidden>O'qituvchi tanlash</option>

                                             {teacherData.map(c => (
                                                  <option value={c.id}>{c.first_name} &nbsp; {c.last_name}</option>
                                             ))}
                                        </select>
                                   </div>
                                   <div className="d-flex flex-column mt-3">
                                        <label htmlFor="time" className="form-label">
                                             Vaqti
                                        </label>

                                        <SelectDay
                                             data={changeData}
                                             setData={setChangeData}
                                             field="week_days"
                                        />

                                   </div>
                              </div>
                              <div
                                   style={{ width: "1px", height: "auto", background: "#2b364cff" }}
                              >

                              </div>
                              <div className="d-flex flex-column w-50">
                                   <span className="fw-bold align-self-end text-white-50">
                                        Boshqa
                                   </span>
                                   <Input
                                        label="Ota-onasi"
                                        defaultValue={changeData?.parent_name}
                                        onChange={(e) => setChangeData({ ...changeData, parent_name: e.target.value })}
                                   />
                                   <Input
                                        label="Ota-onasi telifon raqami"
                                        defaultValue={changeData?.parent_phone}
                                        onChange={(e) => setChangeData({ ...changeData, parent_phone: e.target.value })}
                                   />
                                   <div className="d-flex flex-column">
                                        <label htmlFor="desc" className="form-label">Izoh</label>
                                        <textarea
                                             id="desc"
                                             placeholder="Izoh"
                                             className="form-control"
                                             style={{ resize: "none", height: "130px" }}
                                             defaultValue={changeData.comment}
                                             onChange={(e) => setChangeData({ ...changeData, comment: e.target.value })}
                                        ></textarea>
                                   </div>
                              </div>

                         </div>
                         <div className="d-flex justify-content-end gap-2 mt-4">
                              <button
                                   type="button"
                                   className="btn btn-sm py-2 px-4"
                                   style={{ background: "#e5e5e5", color: "#000" }}
                                   onClick={() => setOpemModal(false)}
                              >
                                   Orqaga
                              </button>
                              <button
                                   type="submit"
                                   className="btn btn-sm py-2 px-4"
                                   style={{ background: "#0085db", color: "#fff" }}
                                   onClick={changeLeadsData}
                              >
                                   {editLeadPending ? <Spinner size="sm" type="border" /> : "Saqlash"}
                              </button>
                         </div>
                    </Modal>
               }

               {show && <NewLead setNotif={setNotif} setShow={setShow} show={show} />}

               <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mx-1 me-3 pb-3">
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


               <div className="row gap-2 ps pe-4" style={{ paddingLeft: "13px" }}>
                    <Card className="col lidCard">
                         <Card.Body className="d-flex justify-content-between align-items-center px-2 py-3">
                              <div className="d-flex flex-column gap-1">
                                   <span className="text-muted">
                                        Jami Lidlar
                                   </span>
                                   <span
                                        className="fs-8"
                                        style={{ color: "#0095db", fontWeight: "900" }}
                                   >
                                        {stats?.count || 0}
                                   </span>
                              </div>
                              <span
                                   style={{
                                        width: "50px",
                                        height: "50px",
                                        background: "#0095db30",
                                        color: "#0095db",
                                        borderRadius: "10px"
                                   }}
                                   className="d-flex justify-content-center align-items-center"
                              >
                                   <Icon icon="charm:person" width="25" height="25" />
                              </span>
                         </Card.Body>
                    </Card>
                    <Card className="col lidCard">
                         <Card.Body className="d-flex justify-content-between align-items-center px-2 py-3">
                              <div className="d-flex flex-column gap-1">
                                   <span className="text-muted">
                                        Guruhga qo'shilgan
                                   </span>
                                   <span
                                        className="fs-8 text-success"
                                        style={{ fontWeight: "900" }}
                                   >
                                        {stats?.statuses?.registered || 0}
                                   </span>
                              </div>
                              <span
                                   style={{
                                        width: "50px",
                                        height: "50px",
                                        background: "#0095db30",
                                        // color: "#0095db",
                                        borderRadius: "10px"
                                   }}
                                   className="d-flex justify-content-center align-items-center text-success bg-success-subtle"
                              >
                                   <Icon icon="prime:check-square" width="25" height="25" className="fw-bold" />
                              </span>
                         </Card.Body>
                    </Card>
                    <Card className="col lidCard">
                         <Card.Body className="d-flex justify-content-between align-items-center px-2 py-3">
                              <div className="d-flex flex-column gap-1">
                                   <span className="text-muted">
                                        Yangi Lidlar
                                   </span>
                                   <span
                                        className="fs-8"
                                        style={{ color: "#00676f", fontWeight: "900" }}
                                   >
                                        {stats?.statuses?.new || 0}
                                   </span>
                              </div>
                              <span
                                   style={{
                                        width: "50px",
                                        height: "50px",
                                        background: "#00676f30",
                                        color: "#00676f",
                                        borderRadius: "10px"
                                   }}
                                   className="d-flex justify-content-center align-items-center"
                              >
                                   <Icon icon="qlementine-icons:plus-16" width="25" height="25" />
                              </span>
                         </Card.Body>
                    </Card>
                    <Card className="col lidCard">
                         <Card.Body className="d-flex justify-content-between align-items-center px-2 py-3">
                              <div className="d-flex flex-column">
                                   <span className="text-muted">
                                        Bugun Qo'shilganlar
                                   </span>
                                   <span
                                        className="fs-8"
                                        style={{ color: "#9647fd", fontWeight: "900" }}
                                   >
                                        {stats?.today || 0}
                                   </span>
                              </div>
                              <span
                                   style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "10px",
                                        background: "#9647fd30",
                                        color: "#9647fd"
                                   }}
                                   className="d-flex justify-content-center align-items-center"
                              >
                                   <Icon icon="pajamas:calendar" width="25" height="25" />
                              </span>
                         </Card.Body>
                    </Card>
                    <Card className="col lidCard">
                         <Card.Body className="d-flex justify-content-between align-items-center px-2 py-3">
                              <div className="d-flex flex-column gap-1">
                                   <span className="text-muted">
                                        Bekor Qilingan
                                   </span>
                                   <span
                                        className="fs-8"
                                        style={{ color: "#dc4041", fontWeight: "900" }}
                                   >
                                        {stats?.statuses?.lost || 0}
                                   </span>
                              </div>
                              <span
                                   style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "10px",
                                        color: "#dc4041",
                                        background: "#dc404130"
                                   }}
                                   className="d-flex justify-content-center align-items-center"
                              >
                                   <Icon icon="material-symbols:person-cancel-outline-rounded" width="25" height="25" />
                              </span>
                         </Card.Body>
                    </Card>
               </div>

               {/* Lidlar ro'yhati */}
               <LeadsLists
                    leads={leads}
                    totalCount={totalCount}
                    filters={filters}
                    setFilters={setFilters}
                    setOpemModal={setOpemModal}
                    setChangeData={setChangeData}
                    setShow={setShow}
               />
          </>
     )
}

export default Leads