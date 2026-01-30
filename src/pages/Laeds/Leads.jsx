import { Card, Nav, Row, Tab } from "react-bootstrap"
import { Icon } from "@iconify/react"
import { useState } from "react";
import { Input } from "../../components/Ui/Input";
import Notification from "../../components/Ui/Notification"
import Modal from "../../components/Ui/Modal"

// API malumotlarini olish
import { useLeads, useLeadsStats } from "../../data/queries/leads.queries"
import { useTeachersData } from "../../data/queries/teachers.queries";
import { useCourses } from "../../data/queries/courses.queries";
import NewLead from "./components/NewLead";
import LeadsLists from "./components/LeadsLists";

const d = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

const Leads = () => {

     const [filters, setFilters] = useState({
          page: 1,
          limit: 10,
          status: "",
          source: "",
          start_date: "",
          end_date: "",
          period: ""
     });

     const { data, isLoading, error } = useLeads(filters);
     const leads = data?.results || [];
     const totalCount = data?.count || 0;

     const { data: stats } = useLeadsStats()     

     const { data: rawTeacherData } = useTeachersData()
     const { data: rawCoursesData } = useCourses()

     const teacherData = Array.isArray(rawTeacherData) ? rawTeacherData : [];
     const coursesData = Array.isArray(rawCoursesData) ? rawCoursesData : [];

     if (isLoading) return <div>Loading...</div>
     if (error) return <div style={{ color: "red" }}>Xatolik: {error.message}</div>

     const date = new Date()
     const today = date.toISOString().split("T")[0]

     const [opemModal, setOpemModal] = useState(false)
     const [selectOtherD, setSelectOtherD] = useState(false)

     const [changeData, setChangeData] = useState({})

     const [activeTab, setActiveTab] = useState('add')

     const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })

     const safeLeads = Array.isArray(leads) ? leads : [];
     const registered = safeLeads.filter(lead => lead.status === "registered")
     const newLid = safeLeads.filter(lead => lead.status === "new")
     const lost = safeLeads.filter(lead => lead.status === "lost")

     // lead malumotlarini tahrirlashda eski dars kunlarini aniqlash
     const findCurrentDays = (d) => {
          const days = d.map(d => d.code)

          if (days.join(",") === "Du,Cho,Ju") {
               return "t"
          }

          if (days.join(",") === "Se,Pay,Sha") {
               return "j"
          }

          setSelectOtherD(true)
          return
     }

     // yangi kunlarni aniqlash
     const changeDays = (id, isChecked) => {
          setChangeData(prev => {
               const currentDays = Array.isArray(prev.week_days) ? prev.week_days : [];

               const filtered = currentDays.filter(item => item.id !== id);

               return {
                    ...prev,
                    week_days: isChecked ? [...filtered, { id: id }] : filtered
               };
          });
     };

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
               alert("Asosiy joylarni to'ldiring!")
               return
          }



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
                                        {!selectOtherD ? (
                                             <select
                                                  id="time"
                                                  className="form-select"
                                                  value={findCurrentDays(changeData.week_days)}
                                                  onChange={(e) => changeDays(e.target.value)}
                                             >
                                                  <option hidden value="">Kun tanlash</option>
                                                  <option value="t">Toq kunlar</option>
                                                  <option value="j">Juft Kunlar</option>
                                                  <option value="b">Boshqa Kunlar</option>
                                             </select>
                                        ) : (
                                             <div className="d-flex flex-column align-items-start ms-3">
                                                  <div className="d-flex flex-wrap">
                                                       {d.map((day, i) => {
                                                            const dayId = i + 1;
                                                            return (
                                                                 <div className="d-flex align-items-center gap-1" key={i}>
                                                                      <label className="form-label" htmlFor={`day-${i}`}>{day}</label>
                                                                      <input
                                                                           id={`day-${i}`}
                                                                           type="checkbox"
                                                                           className="form-check"
                                                                           checked={changeData?.week_days?.some(item => item.id === dayId)}
                                                                           onChange={(e) => changeDays(dayId, e.target.checked)}
                                                                      />
                                                                      &nbsp;
                                                                 </div>
                                                            );
                                                       })}
                                                  </div>
                                                  <button
                                                       type="button"
                                                       className="btn btn-sm btn-outline-secondary mt-2"
                                                       onClick={() => setSelectOtherD(false)}
                                                  >
                                                       Ortga
                                                  </button>
                                             </div>
                                        )}
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
                                   Saqlash
                              </button>
                         </div>
                    </Modal>
               }

               <div className="row gap-2 px-4">
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
                                        {stats?.count}
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
                                        Tastiqlanganlar
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
                                        {stats?.statuses?.today || 0}
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

               <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>

                    {/* Tabbar navigatsiyasi */}
                    <Nav
                         variant="fill"
                         className="user-profile-tab mt-4 justify-content-center justify-content-md-start"
                    >
                         <Nav.Item
                              className="nav-item w-50"
                         >
                              <Nav.Link
                                   eventKey="add"
                                   className="nav-link d-flex justify-content-center align-items-center gap-1"
                              >
                                   <span className="d-none d-md-block">Yangi lid qo'shish</span>
                                   <Icon icon="uil:user-plus" width="24" height="24" />
                              </Nav.Link>
                         </Nav.Item>

                         <Nav.Item className="nav-item w-50">
                              <Nav.Link
                                   eventKey="list"
                                   className="nav-link d-flex align-items-center justify-content-center gap-1"
                              >
                                   <span className="d-none d-md-block">Lidlar Ro'yhati</span>
                                   <Icon icon="prime:list" width="24" height="24" />
                              </Nav.Link>
                         </Nav.Item>
                    </Nav>

                    <Tab.Content className="my-4 pb-2 px-3">

                         {/* Yangi lid qo'shish */}
                         <Tab.Pane eventKey="add">
                              <Row className="card card-body px-3">
                                   <NewLead setNotif={setNotif} />
                              </Row>
                         </Tab.Pane>

                         {/* Lidlar ro'yhati */}
                         <Tab.Pane eventKey="list">
                              <LeadsLists
                                   leads={leads}
                                   totalCount={totalCount}
                                   filters={filters}
                                   setFilters={setFilters}
                                   setOpemModal={setOpemModal}
                                   setSelectOtherD={setSelectOtherD}
                                   setChangeData={setChangeData}
                              />
                         </Tab.Pane>

                    </Tab.Content>
               </Tab.Container>
          </>
     )
}

export default Leads