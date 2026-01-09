import { Card, Nav, Row, Tab } from "react-bootstrap"
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import leadsData from "../../data/Leads.json"
import coursesData from "../../data/Course.json"
import teacherData from "../../data/Teachers.json"
import { Icon } from "@iconify/react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { Input } from "../../components/Ui/Input";
import Notification from "../../components/Ui/Notification"
import Modal from "../../components/Ui/Modal"
import DataTable from "../../components/Ui/DataTable"

const Leads = () => {
     const today = new Date().toISOString().split("T")[0];
     const time = new Date().toTimeString().slice(0, 5);

     const [opemModal, setOpemModal] = useState(false)

     const [changeData, setChangeData] = useState({})

     const [activeTab, setActiveTab] = useState('add')

     const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })
     const [newLidData, setNewLidData] = useState({
          id: leadsData.length + 1,
          name: "",
          phone: "",
          course: "",
          source: "",
          status: "Yangi",
          date: `${today} | ${time}`,
          time: "",
          description: "",
          parent: "",
          parent_phone: "",
          teacher: ""
     })

     const approved = leadsData.filter(lead => lead.status === "Tasdiqlangan")
     const newlid = leadsData.filter(lead => lead.status === "Yangi")
     const cancel = leadsData.filter(lead => lead.status === "Bekor qilingan")
     const canceled = leadsData.filter(lead => lead.status === "Rad etildi")

     const statusData = [
          { name: "Yangi", value: newlid.length, fill: "#3b82f6" },
          { name: "Tasdiqlangan", value: approved.length, fill: "#10b981" },
          { name: "Rad etildi", value: canceled.length, fill: "#f59e0b" },
          { name: "Bekor qilingan", value: cancel.length, fill: "#ef4444" },
     ]


     const sources = {
          "Ko'chadan": "#3b82f6",
          "Instagram": "#ec4899",
          "Telegram": "#06b6d4",
          "Tanish": "#10b981",
          "Tavsiya": "#f59e0b",
          "Reklama": "#2f871c",
     }

     const sourceData = Object.keys(sources).map(source => ({
          name: source,
          value: leadsData.reduce(
               (count, lead) => lead.source === source ? count + 1 : count,
               0
          ),
          fill: sources[source],
     }))


     const todaysLids = leadsData.filter(lead => lead.date === today)



     // *************************************
     // **    Yangi Lead qo'shish uchun    **
     // *************************************


     const handleSubmit = (e) => {
          e.preventDefault()
          if (!(newLidData.name || newLidData.phone || newLidData.course || newLidData.teacher || newLidData.time)) {
               alert("Asosiy ma'lumotlar to'ldirilmagan :(")
          }

          leadsData.push(newLidData)
          setNewLidData({
               name: "",
               phone: "",
               course: "",
               source: "",
               status: "Yangi",
               date: today,
               time: "",
               description: "",
               parent: "",
               parent_phone: "",
               teacher: ""
          })
          setNotif({ show: true, type: 'success', message: "Yangi lid muvoffaqyatli qo'shildi" })
     }

     // Ma'lumotlarni o'zgartirish modalini ochish 

     const handleChange = (id) => {
          const data = leadsData.find(l => l.id === id)
          setChangeData(data)
          setOpemModal(true)
     }



     return (
          <>

               {/* Ma'lumotni tahrirlash uchun modal */}

               {opemModal &&
                    <Modal
                         title={`${changeData?.name} ning ma'lumotlarini yangilash!`}
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
                                        label="Ismi"
                                        defaultValue={changeData?.name}
                                   />
                                   <Input
                                        label="Telifon raqam"
                                        defaultValue={changeData?.phone}
                                   />
                                   <div className="d-flex flex-column">
                                        <label htmlFor="course" className="form-label">
                                             Kurs
                                        </label>
                                        <select
                                             id="course"
                                             className="form-select"
                                             value={changeData.course}
                                             onChange={(e) => setChangeData({ ...changeData, course: e.target.value })}
                                        >
                                             <option hidden>Kurs tanlash</option>

                                             {coursesData.map(c => (
                                                  <option value={c.courseName}>{c.courseName}</option>
                                             ))}
                                        </select>
                                   </div>
                                   <div className="d-flex flex-column mt-3">
                                        <label htmlFor="course" className="form-label">
                                             O'qituvchisi
                                        </label>
                                        <select
                                             id="course"
                                             className="form-select"
                                             value={changeData.teacher}
                                             onChange={(e) => setChangeData({ ...changeData, teacher: e.target.value })}
                                        >
                                             <option hidden>O'qituvchi tanlash</option>

                                             {teacherData.map(c => (
                                                  <option value={c.name}>{c.name}</option>
                                             ))}
                                        </select>
                                   </div>
                              </div>
                              <div
                                   style={{ width: "1px", height: "auto", background: "#2b364cff" }}
                              >

                              </div>
                              <div className="d-flex flex-column w-50 gap-3">
                                   <span className="fw-bold align-self-end text-white-50">
                                        Boshqa
                                   </span>
                                   {/* <div className="d-flex flex-column gap-1">
                                        <input type="date"defaultValue={changeData?.birthday} />
                                   </div>
                                   <div className="d-flex flex-column gap-1">
                                        <label htmlFor="subject">Subject</label>
                                        <input type="text" id="subject" className="form-control" defaultValue={Teacher?.subject} />
                                   </div>
                                   <div className="d-flex flex-column gap-1">
                                        <label htmlFor="class">Class</label>
                                        <input type="text" id="class" className="form-control" defaultValue={Teacher?.class} />
                                   </div> */}
                              </div>

                         </div>
                         <div className="d-flex justify-content-end gap-3 mt-3">
                              <button
                                   className="btn btn-outline-danger mt-1"
                                   onClick={() => setOpemModal(false)}
                              >
                                   Close
                              </button>
                              <button
                                   className="btn btn-outline-success mt-1"
                                   // onClick={handleSaveChanges}
                              >
                                   Save Changes
                              </button>
                         </div>
                    </Modal>
               }



               {/* Bildirishnoma */}

               {notif.show && (
                    <Notification
                         type={notif.type}
                         message={notif.message}
                         onClose={() => setNotif({ ...notif, show: false })}
                    />
               )}


               <BreadcrumbComponent currentPage="Leads" />

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
                                        {leadsData.length}
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
                                        {approved.length}
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
                                        {newlid.length}
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
                                        {todaysLids.length}
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
                                        {cancel.length}
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

               <div className="row gap-3 px-4">
                    <Card className="col px-1 lidCard">
                         <Card.Body>
                              <h4 className="fs-6" style={{ fontWeight: "900" }}>
                                   Lidlar Holati
                              </h4>

                              <ResponsiveContainer width="100%" height={300}>
                                   <PieChart>
                                        <Pie
                                             data={statusData}
                                             cx="50%"
                                             cy="50%"
                                             labelLine={false}
                                             label={(entry) => entry.name}
                                             outerRadius={100}
                                             fill="#8884d8"
                                             dataKey="value"
                                        >
                                             {statusData.map((entry, index) => (
                                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                   </PieChart>
                              </ResponsiveContainer>
                         </Card.Body>
                    </Card>
                    <Card className="col px-1 lidCard">
                         <Card.Body>
                              <h4 className="fs-6" style={{ fontWeight: "900" }}>
                                   Lidlar Manbai
                              </h4>

                              <ResponsiveContainer width="100%" height={300}>
                                   <PieChart>
                                        <Pie
                                             data={sourceData}
                                             cx="50%"
                                             cy="50%"
                                             labelLine={false}
                                             label={(entry) => entry.name}
                                             outerRadius={100}
                                             fill="#8884d8"
                                             dataKey="value"
                                        >
                                             {sourceData.map((entry, index) => (
                                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                   </PieChart>
                              </ResponsiveContainer>
                         </Card.Body>
                    </Card>
               </div>

               <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>

                    {/* Tabar navigatsiyasi */}
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

                    <Tab.Content className="mt-4">

                         {/* Yangi lid qo'shish */}
                         <Tab.Pane eventKey="add">
                              <Row className="card card-body px-3">
                                   <div className="d-flex flex-column gap-1">
                                        <h4 className="fs-6">
                                             Yangi lid qo'shish
                                        </h4>
                                        <span className="text-muted">
                                             Yangi lid ma'lumotlarini kiritish
                                        </span>
                                   </div>

                                   <form
                                        onSubmit={handleSubmit}
                                        className="d-flex form-control flex-column mt-3"
                                   >

                                        <div className="row">
                                             <Input
                                                  label="Ismi"
                                                  placeholder="Ism..."
                                                  containerClassName="col"
                                                  value={newLidData.name}
                                                  onChange={(e) => setNewLidData({ ...newLidData, name: e.target.value })}
                                             />
                                             <Input
                                                  label="Telifon raqam"
                                                  placeholder="Raqam..."
                                                  containerClassName="col"
                                                  value={newLidData.phone}
                                                  onChange={(e) => setNewLidData({ ...newLidData, phone: e.target.value })}
                                             />
                                        </div>

                                        <div className="row">
                                             <div className="col d-flex flex-column">
                                                  <label htmlFor="course" className="form-label">
                                                       Kurs
                                                  </label>
                                                  <select
                                                       id="course"
                                                       className="form-select"
                                                       value={newLidData.course}
                                                       onChange={(e) => setNewLidData({ ...newLidData, course: e.target.value })}
                                                  >
                                                       <option hidden>Kurs tanlash</option>

                                                       {coursesData.map(c => (
                                                            <option value={c.courseName}>{c.courseName}</option>
                                                       ))}
                                                  </select>
                                             </div>
                                             <div className="col d-flex flex-column">
                                                  <label htmlFor="tacher" className="form-label">O'qituvchi</label>
                                                  <select
                                                       id="source"
                                                       className="form-select"
                                                       value={newLidData.teacher}
                                                       onChange={(e) => setNewLidData({ ...newLidData, teacher: e.target.value })}
                                                  >
                                                       <option hidden>O'qituvchi tanlash</option>

                                                       {teacherData.map(t => (
                                                            <option value={t.name}>{t.name}</option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </div>

                                        <div className="row mt-3">
                                             <div className="col d-flex flex-column">
                                                  <label htmlFor="days" className="form-label">
                                                       Dars Kunlari
                                                  </label>
                                                  <select
                                                       id="days"
                                                       className="form-select"
                                                       value={newLidData.time}
                                                       onChange={(e) => setNewLidData({ ...newLidData, time: e.target.value })}
                                                  >
                                                       <option hidden>Kun tanlash</option>
                                                       <option value="Juft Kunlar">Juft Kunlar</option>
                                                       <option value="Toq kunlar">Toq kunlar</option>
                                                       <option value="Ya, Pa, Sh">Ya, Pa, Sh</option>
                                                       <option value="Boshqa Kunlar">Boshqa Kunlar</option>
                                                  </select>
                                             </div>
                                             <div className="col d-flex flex-column">
                                                  <label htmlFor="source" className="form-label">Manba</label>
                                                  <select
                                                       id="source"
                                                       className="form-select"
                                                       value={newLidData.source}
                                                       onChange={(e) => setNewLidData({ ...newLidData, source: e.target.value })}
                                                  >
                                                       <option hidden>Bizni qanday topdingiz ?</option>

                                                       {Object.keys(sources).map(s => (
                                                            <option value={s}>{s}</option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </div>

                                        <div className="row mt-3">
                                             <Input
                                                  label="Ota-onasining ismi"
                                                  placeholder="Ism..."
                                                  value={newLidData.parent}
                                                  containerClassName="col"
                                                  onChange={(e) => setNewLidData({ ...newLidData, parent: e.target.value })}
                                             />
                                             <Input
                                                  label="Ota-onasining telifon raqami"
                                                  placeholder="Raqam..."
                                                  value={newLidData.parent_phone}
                                                  containerClassName="col"
                                                  onChange={(e) => setNewLidData({ ...newLidData, parent_phone: e.target.value })}
                                             />
                                        </div>

                                        <div className="row mt-1">
                                             <div className="col-6">
                                                  <label htmlFor="desc" className="form-label">Izoh</label>
                                                  <textarea
                                                       id="desc"
                                                       placeholder="Izoh..."
                                                       value={newLidData.description}
                                                       className="form-control"
                                                       style={{ resize: "none", height: "80px" }}
                                                       onChange={(e) => setNewLidData({ ...newLidData, description: e.target.value })}
                                                  >
                                                  </textarea>
                                             </div>
                                        </div>

                                        <div className="d-flex align-self-end my-3">
                                             <button

                                                  type="submit"
                                                  style={{ background: "#0085db" }}
                                                  disabled={!(newLidData.name && newLidData.phone && newLidData.course && newLidData.teacher && newLidData.time)}
                                                  className="btn btn-sm px-3 py-2 fs-3 text-white"
                                             >
                                                  Saqlash
                                             </button>
                                        </div>
                                   </form>
                              </Row>
                         </Tab.Pane>


                         {/* Lidlar ro'yhati */}
                         <Tab.Pane eventKey="list">
                              <Row className="card card-body px-3">
                                   <div className="d-flex flex-column gap-1">
                                        <h4 className="fs-6">
                                             Lidlar ro'yhati
                                        </h4>
                                        <span className="text-muted">
                                             Barcha lidlar ma'lumotlari
                                        </span>
                                   </div>

                                   <DataTable
                                        data={leadsData}
                                        columns={["№", "Ism", "Telefon", "Holati", "Yaratilgan vaqti", "Kurs", "O'qituvchisi","Vaqti", "Amallar"]}
                                        searchKeys={["name", "time"]}
                                   >
                                        {(currentDate) =>
                                             currentDate.map((lid, index) => (
                                                  <tr key={index}>
                                                       <td>{lid.id}</td>
                                                       <td>{lid.name}</td>
                                                       <td>{lid.phone}</td>
                                                       <td>
                                                            <span
                                                                 style={{
                                                                      color: statusData.find(d => d.name === lid.status).fill,
                                                                      backgroundColor: `${statusData.find(d => d.name === lid.status).fill}30`
                                                                 }}
                                                                 className="px-2 py-1 rounded-4 fs-3 cursor-pointer"
                                                            >
                                                                 {lid.status}
                                                            </span>
                                                       </td>
                                                       <td>{lid.date}</td>
                                                       <td>{lid.course}</td>
                                                       <td>{lid.teacher}</td>
                                                       <td>{lid.time }</td>
                                                       <td className="d-flex align-items-center gap-1 text-center cursor-pointer">
                                                            <span
                                                                 className="py-2 px-2 d-flex justify-content-center align-items-center rounded-2 dots"
                                                                 title="Tahrirlash"
                                                                 onClick={() => handleChange(lid.id)}
                                                            >
                                                                 <Icon icon="line-md:pencil-twotone" height="22" />
                                                            </span>
                                                            <span
                                                                 className="py-2 px-2 d-flex justify-content-center align-items-center rounded-2 dots"
                                                                 title="Izoh"
                                                            >
                                                                 <Icon icon="fluent:comment-28-regular" height="22" />
                                                            </span>
                                                       </td>
                                                  </tr>
                                             ))
                                        }
                                   </DataTable>
                              </Row>
                         </Tab.Pane>

                    </Tab.Content>
               </Tab.Container>
          </>
     )
}

export default Leads