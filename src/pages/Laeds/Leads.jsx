import { Card, Nav, Row, Tab, Dropdown } from "react-bootstrap"
import { Icon } from "@iconify/react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { Input } from "../../components/Ui/Input";
import Notification from "../../components/Ui/Notification"
import Modal from "../../components/Ui/Modal"
import DataTable from "../../components/Ui/DataTable"
import { useNavigate } from "react-router-dom"

// API malumotlarini olish
import { useLeads, useUpdateLead, useCreateLead, useLeadsStats } from "../../data/queries/leads.queries"
import { useTeachersData } from "../../data/queries/teachers.queries";
import { useCourses } from "../../data/queries/courses.queries";
import CalendarSelector from "../../components/Ui/CalendarSelector";

const d = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"]

const Leads = () => {

     const navigate = useNavigate()


     const { data: leads = [], isLoading, error } = useLeads();
     const { mutate: createLead, isLoading: creating } = useCreateLead();
     const { mutate: updateLead } = useUpdateLead();
     const { data: stats } = useLeadsStats()
     const { data: teacherData = [] } = useTeachersData()
     const { data: coursesData } = useCourses()

     if (isLoading) return <div>Loading...</div>;
     if (error) return <div style={{ color: "red" }}>Xatolik: {error.message}</div>;

     const date = new Date()
     const today = date.toISOString().split("T")[0];

     const [opemModal, setOpemModal] = useState(false)
     const [otherD, setOtherD] = useState(false)
     const [selectOtherD, setSelectOtherD] = useState(false)
     const [openDropdown, setOpenDropdown] = useState(null)

     const [changeData, setChangeData] = useState({})
     const [FilterDates, setFilterDates] = useState({ start: null, end: null })

     const [leadsDate, setLeadsDate] = useState([])

     const [activeTab, setActiveTab] = useState('add')

     const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })


     const [newLidData, setNewLidData] = useState({
          id: leads.length + 1,
          first_name: "",
          last_name: "",
          phone: "",
          course: "",
          source: "",
          status: "new",
          create_at: date,
          week_days: [],
          days_type: "",
          comment: "",
          parent_name: "",
          parent_phone: "",
          teacher: "",
          updated_at: null,
          deleted_at: null
     })

     const registered = leads?.filter(lead => lead.status === "registered");
     const newLid = leads?.filter(lead => lead.status === "new");
     const lost = leads?.filter(lead => lead.status === "lost");
     const contacted = leads?.filter(lead => lead.status === "contacted");
     const interested = leads?.filter(lead => lead.status === "interested")

     // Status chart uchun
     const statusData = [
          { name: "Yangi", value: newLid.length, fill: "#3b82f6" },
          { name: "Qabul qilingan", value: registered.length, fill: "#10b981" },
          { name: "Qiziqgan", value: interested.length, fill: "#f59e0b" },
          { name: "Bekor qilingan", value: lost.length, fill: "#ef4444" },
          { name: "Bog'lanilgan", value: contacted.length, fill: "#9ea5ac" },
     ];

     const sources = {
          "Instagram": "#ec4899",
          "Telegram": "#06b6d4",
          "Facebook": "#10b981",
          "Tavsiya": "#f59e0b",
          "Banner": "#2f871c",
     }

     // Source chart uchun
     const sourceData = Object.keys(sources).map(source => ({
          name: source,
          value: leads.reduce((count, lead) => lead.source.name === source ? count + 1 : count, 0),
          fill: sources[source],
     }));



     // Bugungi lidlar
     const todaysLids = leads.filter(lead => lead.created_at.split("T")[0] === today);

     const handleSubmit = (e) => {
          e.preventDefault()
          if (!(newLidData.first_name && newLidData.last_name && newLidData.phone && newLidData.course && newLidData.source && newLidData.teacher && newLidData.week_days)) {
               alert("Asosiy ma'lumotlar to'ldiring!");
               return;
          }

          const { days_type, ...payload } = newLidData;

          createLead(payload)

          setNewLidData({
               first_name: "",
               last_name: "",
               phone: "",
               course: 2,
               source: "",
               status: "new",
               create_at: date,
               week_days: [],
               days_type: "",
               comment: "",
               parent_name: "",
               parent_phone: "",
               teacher: " ",
          });
          setOtherD(false)
          setNotif({ show: true, type: 'success', message: "Yangi lid muvoffaqyatli qo'shildi" })
     }

     // Ma'lumotlarni o'zgartirish modalini ochish 
     const handleChange = (e, id) => {
          e.stopPropagation()

          const data = leads.find(l => l.id === id)
          setChangeData(data)
          setOpemModal(true)
          setSelectOtherD(false)
     }



     // statusni ozgartirish
     const statusChange = (s, id) => {
          updateLead({ id, data: { status: s } });
     }



     const statusStyle = (s) => {
          let st = s === "new" ? { style: { background: "#3b82f6" }, t: "Yangi" }
               : s === "contacted" ? { style: { background: "#9ea5ac" }, t: "Bog'lanilgan" }
                    : s === "interested" ? { style: { background: "#f59e0b" }, t: "Qiziqish bildirgan" }
                         : s === "registered" ? { style: { background: "#10b981" }, t: "Guruhga qo'shilgan" }
                              : s === "lost" ? { style: { background: "#ef4444" }, t: "O'chirilgan" }
                                   : ""

          return st
     }


     // calendardan tanlangan kunlar boyicha malumotlarni chiqarish
     const handleDateChange = (range) => {
          // 1. Agar sana hali tanlanmagan bo'lsa, hammani ko'rsat
          if (!range || !range.start || !range.end) {
               setLeadsDate(leads);
               return;
          }

          // 2. Tanlangan vaqtlarni millisekundga o'tkazamiz
          const startTime = new Date(range.start).getTime();
          const endTime = new Date(range.end).getTime();

          // 3. ASL massiv (allLeads) dan qidiramiz
          const filtered = leads.filter((item) => {
               if (!item.created_at) return false;

               const itemTime = new Date(item.created_at).getTime();
               return itemTime >= startTime && itemTime <= endTime;
          });

          // 4. Faqat ekrandagi nusxani yangilaymiz
          setLeadsDate(filtered);
     };


     const days = (d) => {

          if (d === "b") {
               setOtherD(true)
               return
          }

          let selectedDays = d === "t" ? [1, 3, 5]
               : d === "j" ? [2, 4, 6]
                    : []

          setNewLidData(prev => ({
               ...prev,
               days_type: d,
               week_days: selectedDays
          }));
     }

     const otherDays = ({ i, checked }) => {
          setNewLidData(prev => {
               const filteredDays = (prev.week_days || []).filter(id => id !== i);

               return {
                    ...prev,
                    days_type: i,
                    week_days: checked ? [...filteredDays, i] : filteredDays
               };
          });
     }

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



               {/* Bildirishnoma */}
               {notif.show && (
                    <Notification
                         type={notif.type}
                         message={notif.message}
                         onClose={() => setNotif({ ...notif, show: false })}
                    />
               )}

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
                                        {leads.length}
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
                                        {registered.length}
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
                                        {newLid.length}
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
                                        {lost.length}
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
                                                  label="Ism"
                                                  placeholder="Ism..."
                                                  containerClassName="col"
                                                  value={newLidData.first_name}
                                                  onChange={(e) => setNewLidData({ ...newLidData, first_name: e.target.value })}
                                             />
                                             <Input
                                                  label="Familiya"
                                                  placeholder="Familiya..."
                                                  containerClassName="col"
                                                  value={newLidData.last_name}
                                                  onChange={(e) => setNewLidData({ ...newLidData, last_name: e.target.value })}
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
                                                            <option value={c.id}>{c.name}</option>
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
                                                       <option hidden value="">O'qituvchi tanlash</option>

                                                       {teacherData.map(t => (
                                                            <option value={t.id}>{t.first_name} {" "} {t.last_name}</option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </div>

                                        <div className="row mt-3">
                                             <div className="col d-flex flex-column">
                                                  <label htmlFor="days" className="form-label">
                                                       Dars Kunlari
                                                  </label>
                                                  {!otherD ? (
                                                       <select
                                                            id="days"
                                                            className="form-select"
                                                            value={newLidData.days_type}
                                                            onChange={(e) => days(e.target.value)}
                                                       >
                                                            <option hidden value="">Kun tanlash</option>
                                                            <option value="t">Toq kunlar</option>
                                                            <option value="j">Juft Kunlar</option>
                                                            <option value="b">Boshqa Kunlar</option>
                                                       </select>
                                                  ) : (
                                                       <div className="d-flex flex-column align-items-start ms-3">
                                                            <div className="d-flex">
                                                                 {d.map((day, i) => (
                                                                      <div className="d-flex align-items-center gap-1">
                                                                           <label className="form-label" htmlFor={i}>{day}</label>
                                                                           <input
                                                                                id={i}
                                                                                type="checkbox"
                                                                                className="form-check"
                                                                                onChange={(e) => otherDays({ i: i + 1, checked: e.target.checked })}
                                                                           />
                                                                           &nbsp;
                                                                      </div>
                                                                 ))}
                                                            </div>
                                                            <button
                                                                 type="button"
                                                                 className="btn btn-sm btn-outline-secondary mt-2"
                                                                 onClick={() => setOtherD(false)}
                                                            >
                                                                 Ortga
                                                            </button>
                                                       </div>
                                                  )}
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

                                                       {Object.keys(sources).map((s, i) => (
                                                            <option value={i + 1}>{s}</option>
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
                                                  onChange={(e) => setNewLidData({ ...newLidData, parent_name: e.target.value })}
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
                                                       onChange={(e) => setNewLidData({ ...newLidData, comment: e.target.value })}
                                                  >
                                                  </textarea>
                                             </div>
                                        </div>

                                        <div className="d-flex align-self-end my-3">
                                             <button

                                                  type="submit"
                                                  style={{ background: "#0085db" }}
                                                  disabled={
                                                       !(newLidData.first_name && newLidData.last_name && newLidData.phone && newLidData.course && newLidData.teacher && newLidData.source && newLidData.week_days)}
                                                  className="btn btn-sm px-3 py-2 fs-3 text-white"
                                             >
                                                  {creating ? "Saqlanmoqda..." : "Saqlash"}
                                             </button>
                                        </div>
                                   </form>
                              </Row>
                         </Tab.Pane>

                         {/* Lidlar ro'yhati */}
                         <Tab.Pane eventKey="list">
                              <div className="row gap-3 px-3">
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

                              <div className="card card-body px-4">
                                   <div className="d-flex flex-column">
                                        <div className="d-flex flex-column gap-1">
                                             <h4 className="fs-6">
                                                  Lidlar ro'yhati
                                             </h4>
                                             <span className="text-muted">
                                                  Barcha lidlar ma'lumotlari
                                             </span>
                                        </div>

                                        <CalendarSelector onRangeSelect={handleDateChange} />
                                   </div>

                                   <DataTable
                                        data={leadsDate.length > 0 ? leadsDate : leads}
                                        columns={["№", "Ism", "Telefon", "Holati", "Yaratilgan vaqti", "O'qituvchi", "Kurs", "Vaqti", "Amallar"]}
                                        searchKeys={["first_name", "last_name", "phone"]}
                                   >
                                        {(currentDate) =>
                                             currentDate.map((lid, index) => (
                                                  <tr
                                                       key={index}
                                                       className="cursor-pointer"
                                                       onClick={() => navigate(`/leads/${lid.id}`)}
                                                  >
                                                       <td>{lid.id}</td>
                                                       <td>{lid?.first_name + " " + lid?.last_name}</td>
                                                       <td>{lid.phone}</td>
                                                       <td>
                                                            <Dropdown
                                                                 show={openDropdown === index}
                                                                 onToggle={() => {
                                                                      setOpenDropdown(openDropdown === index ? null : index)
                                                                 }}
                                                                 onClick={(e) => e.stopPropagation()}
                                                            >
                                                                 <Dropdown.Toggle
                                                                      className="no-caret"
                                                                      style={{ background: "transparent", border: "none" }}
                                                                 >
                                                                      <div
                                                                           style={{
                                                                                padding: "3px 7px",
                                                                                borderRadius: "15px",
                                                                                background: statusStyle(lid?.status).style.background,
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                color: "white",
                                                                                cursor: "pointer",
                                                                                fontSize: "12px"
                                                                           }}
                                                                      >
                                                                           {statusStyle(lid?.status).t}
                                                                      </div>
                                                                 </Dropdown.Toggle>

                                                                 <Dropdown.Menu>
                                                                      {[
                                                                           { k: "new", label: "Yangi", c: "#3b82f6" },
                                                                           { k: "contacted", label: "Bog'lanilgan", c: "#9ea5ac" },
                                                                           { k: "interested", label: "Qiziqish bildirgan", c: "#f59e0b" },
                                                                           { k: "registered", label: "Guruhga qo'shilgan", c: "#10b981" },
                                                                           { k: "lost", label: "O'chirilgan", c: "#ef4444" }
                                                                      ].map(o => (
                                                                           <Dropdown.Item
                                                                                key={o.k}
                                                                                onClick={() => statusChange(o.k, lid?.id)}
                                                                                className="no-hover-effect"
                                                                                style={{ padding: "5px 10px" }}
                                                                           >
                                                                                <span
                                                                                     style={{
                                                                                          color: "#fff",
                                                                                          fontWeight: "500",
                                                                                          padding: "3px 7px",
                                                                                          borderRadius: "15px",
                                                                                          background: o.c,
                                                                                          fontSize: "12px"
                                                                                     }}
                                                                                >
                                                                                     {o.label}
                                                                                </span>
                                                                           </Dropdown.Item>
                                                                      ))}
                                                                 </Dropdown.Menu>
                                                            </Dropdown>
                                                       </td>
                                                       <td>
                                                            {lid?.created_at?.split("T")[0].split("-").reverse().join(".")}

                                                       </td>
                                                       <td>
                                                            {teacherData.find(t => t.id === Number(lid.teacher))?.first_name}
                                                            {" "}
                                                            {teacherData.find(t => t.id === Number(lid.teacher))?.last_name}
                                                       </td>
                                                       <td>{lid?.course?.name}</td>
                                                       <td className="text-capitalize">
                                                            {lid?.week_days?.map(d => d.code + ", ")}
                                                       </td>
                                                       <td className="d-flex align-items-center gap-1 text-center cursor-pointer">
                                                            <span
                                                                 className="py-2 px-2 d-flex justify-content-center align-items-center rounded-2 dots"
                                                                 title="Tahrirlash"
                                                                 onClick={(e) => handleChange(e, lid.id)}
                                                            >
                                                                 <Icon icon="line-md:pencil-twotone" height="22" />
                                                            </span>
                                                       </td>
                                                  </tr>
                                             ))
                                        }
                                   </DataTable>
                              </div>
                         </Tab.Pane>

                    </Tab.Content>
               </Tab.Container>
          </>
     )
}

export default Leads