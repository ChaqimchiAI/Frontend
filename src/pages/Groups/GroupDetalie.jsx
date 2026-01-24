import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTheme } from "../../Context/Context"
import Back from "../../components/Ui/Back";
import { Card, Dropdown, Form, Nav, Tab } from "react-bootstrap";
import studentsData from "../../data/Students.json"
import leadsData from "../../data/Leads.json"
import Modal from "../../components/Ui/Modal";
import { Input } from "../../components/Ui/Input";
import StudentsTable from "./Components/StudentsTable";
import AttendenceTable from "./Components/AttendenceTable";
import Schedule from "./Components/Schedule";
import axios from "axios";
import Notification from "../../components/Ui/Notification";

const weekDays = [
     { code: "Du", full: "Dushanba" },
     { code: "Se", full: "Seshanba" },
     { code: "Cho", full: "Chorshanba" },
     { code: "Pay", full: "Payshanba" },
     { code: "Ju", full: "Juma" },
     { code: "Sha", full: "Shanba" },
];

const GroupDetalie = () => {
     const { id } = useParams()
     const { theme } = useTheme()

     const [addNewUser, setAddNewUser] = useState(false)
     const [changeGroup, setChangeGroup] = useState(false)
     const [addSchedule, setAddSchedule] = useState(false)
     const [special, setSpecial] = useState(false)
     const [delateGroup, setDelateGroup] = useState(false)
     const [changeAttande, setChangeAttande] = useState([])

     const [searchLead, setSearchLead] = useState(leadsData)
     const [changeGroupDate, setChangeGroupDate] = useState({})
     const [currentSchedule, setCurrentSchedule] = useState({})
     const [newSchedlueItems, setNewSchedlueItems] = useState({
          days_of_week: "",
          begin_time: "",
          end_time: "",
          teacher: "",
          room: "",
          start_date: "",
          end_date: "",
          is_active: true
     })

     const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })

     const [courseData, setCourseData] = useState([])
     const [currentGroup, setCurrentGroup] = useState([])
     const [currentStudents, setCurrentStudents] = useState([])
     const [schedule_items, setSchedule_items] = useState([])
     const [availabilitiyTeacher, setAvailabilitiyTeacher] = useState([])
     const [teacherData, setTeacherData] = useState([])
     const [roomData, setRoomData] = useState([])

     const [activeTab, setActiveTab] = useState("students")
     const [changeActiveItem, setChangeActiveItem] = useState(null)

     // get current group data
     const getGroups = async () => {
          try {
               const res = await fetch(`https://erpbackend.pythonanywhere.com//api/v1/groups/${id}/`, {
                    headers: {
                         'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    }
               })
               const data = await res.json()

               setCurrentGroup(data?.data)
               setChangeGroupDate(data?.data)
               setSchedule_items(data?.data?.schedule_items)
          }
          catch (err) {
               console.log(err);
          }
     }
     // get course data
     const getCourse = async () => {
          try {
               const res = await axios.get("https://erpbackend.pythonanywhere.com/api/v1/courses/", {
                    headers: {
                         'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    }
               })

               setCourseData(res?.data?.data)

          } catch (err) {
               console.error(err)
          }
     }

     // bo'sh ustozlarni api dan chaqirish
     // const getAvailabilitiyTeacher = async () => {
     //      try {
     //           const res = await axios.get("https://erpbackend.pythonanywhere.com/api/v1/teachers/availability/", {
     //                headers: {
     //                     'Authorization': `Bearer ${localStorage.getItem("access_token")}`
     //                }
     //           })

     //           setAvailabilitiyTeacher(res?.data.data)
     //           console.log(res?.data?.data);

     //      } catch (err) {
     //           console.error(err);

     //      }
     // }

     const getOtherThings = async () => {
          try {
               const resTeacher = await axios.get("https://erpbackend.pythonanywhere.com/api/v1/teachers/", {
                    headers: {
                         'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    }
               })

               const resRoom = await axios.get("https://erpbackend.pythonanywhere.com/api/v1/core/rooms/", {
                    headers: {
                         'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    }
               })


               setRoomData(resRoom?.data.data)
               setTeacherData(resTeacher?.data.data)
          } catch (err) {
               console.error(err);

          }
     }

     useEffect(() => {
          getGroups()
          getCourse()
          // getAvailabilitiyTeacher()
          getOtherThings()
     }, [])

     useEffect(() => {
          const studentsInGroup = studentsData.filter(st => st.group === currentGroup?.name)
          setCurrentStudents(studentsInGroup)
     }, [currentGroup])

     // statusni tog'ri olish
     const Status = (s) => {
          let status = s === "active" ? "Faol"
               : s === "finished" ? "Tugallangan"
                    : s === "waiting" ? "Kutilmoqda"
                         : s === "paused" ? "To'xtatilgan"
                              : "▬"

          return status
     }

     // lidlarni qidirish
     const handleSearch = (value) => {
          const filteredLeads = leadsData.filter(lead =>
               lead.name.toLowerCase().includes(value.toLowerCase()) ||
               lead.phone.includes(value)
          )
          setSearchLead(filteredLeads)
     }

     // for edit group info
     const saveGroupChanges = async (e) => {
          e.preventDefault()
          try {
               const dataToSend = {
                    name: changeGroupDate.name,
                    course: changeGroupDate.course,
                    branch: changeGroupDate.branch,
                    started_date: changeGroupDate.started_date,
                    ended_date: changeGroupDate.ended_date,
                    status: changeGroupDate.status,
                    attendance_kpi: changeGroupDate.attendance_kpi || 0,
                    exam_kpi: changeGroupDate.exam_kpi || 0,
                    homework_kpi: changeGroupDate.homework_kpi || 0,
                    students_count: changeGroupDate.students_count || 0
               }

               const { data } = await axios.patch(`https://erpbackend.pythonanywhere.com/api/v1/groups/${id}/`, dataToSend, {
                    headers: {
                         'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    }
               })

               setCurrentGroup(data?.data)

               setNotif({ show: true, type: "edited", message: "Guruh ma'lumotlari tahrirlandi" })

               setChangeGroup(false)
          } catch (err) {
               console.error("Xato:", err?.response?.data || err.message);
               setNotif({ show: true, type: 'error', message: err?.response?.data?.message || "Guruhni tahrirlashda xato" })
          }
     }

     useEffect(() => {
          const currentItem = schedule_items?.active?.find(s => s.id == changeActiveItem)

          setCurrentSchedule(currentItem)
     }, [changeActiveItem])

     const t = currentGroup?.schedule_items?.active?.at(-1); // ohirgi dars jadvalini olish

     // dars kunlarini togrilash
     const formatDays = (value) => {
          if (value === "toqK") {
               setNewSchedlueItems({
                    ...newSchedlueItems,
                    days_of_week: [
                         { code: "Du", full: "Dushanba" },
                         { code: "Cho", full: "Chorshanba" },
                         { code: "Ju", full: "Juma" },
                    ],
               });
               setSpecial(false);
          }

          if (value === "juftK") {
               setNewSchedlueItems({
                    ...newSchedlueItems,
                    days_of_week: [
                         { code: "Se", full: "Seshanba" },
                         { code: "Pay", full: "Payshanba" },
                         { code: "Sha", full: "Shanba" },
                    ],
               });
               setSpecial(false);
          }

          if (value === "maxsusK") {
               setNewSchedlueItems({
                    ...newSchedlueItems,
                    days_of_week: [],
               });
               setSpecial(true);
          }
     };

     // dars kunlarini tahrirlash
     const handleEditDays = (value) => {
          if (value === "toqK") {
               setCurrentSchedule({
                    ...currentSchedule,
                    days_of_week: [
                         { code: "Du", full: "Dushanba" },
                         { code: "Cho", full: "Chorshanba" },
                         { code: "Ju", full: "Juma" },
                    ],
               });
               setSpecial(false);
          } else if (value === "juftK") {
               setCurrentSchedule({
                    ...currentSchedule,
                    days_of_week: [
                         { code: "Se", full: "Seshanba" },
                         { code: "Pay", full: "Payshanba" },
                         { code: "Sha", full: "Shanba" },
                    ],
               });
               setSpecial(false);
          } else if (value === "maxsusK") {
               // maxsus tanlangan bo‘lsa, eski kunlar saqlanishi mumkin
               setCurrentSchedule({
                    ...currentSchedule,
                    days_of_week: [],
               });
               setSpecial(true);
          }
     };

     // yangi jadval un checkbox dan kun tanlash
     const toggleDay = (day) => {
          const exists = newSchedlueItems.days_of_week.some(
               (d) => d.code === day.code
          );

          setNewSchedlueItems({
               ...newSchedlueItems,
               days_of_week: exists
                    ? newSchedlueItems.days_of_week.filter(
                         (d) => d.code !== day.code
                    )
                    : [...newSchedlueItems.days_of_week, day],
          });
     };

     // jadvalni tahrirlashda checkbox dan kun tanlash
     const toggleEditDay = (day) => {
          const exists = currentSchedule?.days_of_week?.some(
               (d) => d.code === day.code
          );

          setCurrentSchedule({
               ...newSchedlueItems,
               days_of_week: exists
                    ? currentSchedule?.days_of_week?.filter(
                         (d) => d.code !== day.code
                    )
                    : [...currentSchedule.days_of_week, day],
          });
     };

     // add new schedule
     const handleAddNewSchedule = async (e) => {
          e.preventDefault()

          if (
               !newSchedlueItems.begin_time ||
               !newSchedlueItems.end_time ||
               !newSchedlueItems.start_date ||
               !newSchedlueItems.days_of_week?.length ||
               !newSchedlueItems.room?.id ||
               !newSchedlueItems.teacher?.id
          ) {
               alert("Barcha maydonlarni to'ldiring!")
          }
          else {
               try {
                    const dataToSend = {
                         days_of_week: newSchedlueItems.days_of_week,
                         begin_time: newSchedlueItems.begin_time,
                         end_time: newSchedlueItems.end_time,
                         teacher: newSchedlueItems.teacher,
                         room: newSchedlueItems.room,
                         start_date: newSchedlueItems.start_date,
                         end_date: newSchedlueItems.end_date || null,
                         is_active: newSchedlueItems.is_active
                    }

                    const { data } = await axios.post(`https://erpbackend.pythonanywhere.com/api/v1/groups/${id}/schedules/`, dataToSend, {
                         headers: {
                              'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                         }
                    })

                    setSchedule_items([...schedule_items, data?.data])

                    setNotif({ show: true, type: 'success', message: "Jadval muvoffaqyatli qo'shild" })

                    setAddSchedule(false)

                    setNewSchedlueItems({
                         days_of_week: "",
                         begin_time: "",
                         end_time: "",
                         teacher: {},
                         room: {},
                         start_date: "",
                         end_date: "",
                         is_active: true
                    })
               } catch (err) {
                    console.error("Xato:", err?.response?.data || err.message);
               }
          }
     }

     // delate group
     const DelateGroup = async () => {
          try {
               await axios.delete(`https://erpbackend.pythonanywhere.com/api/v1/groups/${id}/`, {
                    headers: {
                         'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    }
               })
               setNotif({ show: true, type: 'deleted', message: "Guruh muvoffaqyatli o'chirildi" })
               setDelateGroup(false)

               // Bosh sahifaga yo'naltiritish
               window.history.back()
          } catch (err) {
               console.error(err)
               setNotif({ show: true, type: 'error', message: "Guruhni o'chirishda xato" })
          }
     }

     const teacher = (id) => {
          const teacherObj = teacherData.find(t => t.id === Number(id))

          setNewSchedlueItems({ ...newSchedlueItems, teacher: teacherObj })
     }

     const room = (id) => {
          const roomObj = roomData.find(r => r.id === Number(id))

          setNewSchedlueItems({ ...newSchedlueItems, room: roomObj })
     }

     console.log(newSchedlueItems)


     return (
          <div onClick={() => changeAttande ? setChangeAttande([]) : setChangeAttande(changeAttande)}>

               {/* Bildirishnoma */}
               {notif.show && (
                    <Notification
                         type={notif.type}
                         message={notif.message}
                         onClose={() => setNotif({ ...notif, show: false })}
                    />
               )}

               {/* Guruh malumotlarini tahrirlash */}
               {changeGroup && (
                    <Modal
                         title="Guruh ma'lumotlarini tahrirlash"
                         close={setChangeGroup}
                         anima={changeGroup}
                         width="30%"
                    >
                         <Form className="mt-3" onSubmit={saveGroupChanges}>
                              <Form.Group className="mb-3">
                                   <Input
                                        label="Guruh nomi"
                                        required
                                        placeholder="Guruh nomi..."
                                        value={changeGroupDate.name}
                                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, name: e.target.value })}

                                   />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                   <label htmlFor="course" className="form-label">Kurs</label>
                                   <select
                                        required
                                        id="course"
                                        className="form-select"
                                        value={changeGroupDate.course}
                                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, course: e.target.value })}
                                   >
                                        <option value="" hidden>Kurs tanlash</option>
                                        {courseData.map(c =>
                                             <option key={c.id} value={c.id}>{c.name}</option>
                                        )}
                                   </select>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                   <Input
                                        label="Filial"
                                        required
                                        placeholder="Filial nomi..."
                                        value={changeGroupDate.branch}
                                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, branch: e.target.value })}
                                   />
                              </Form.Group>
                              <div className="d-flex justify-content-between gap-3">
                                   <Input
                                        required
                                        type="date"
                                        label="Boshlanish sanasi"
                                        containerClassName="w-50"
                                        value={changeGroupDate.started_date}
                                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, started_date: e.target.value })}
                                   />
                                   <Input
                                        type="date"
                                        label="Tugash sanasi"
                                        containerClassName="w-50"
                                        value={changeGroupDate.ended_date}
                                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, ended_date: e.target.value })}

                                   />
                              </div>
                              <Form.Group className="mb-3">
                                   <label htmlFor="status" className="form-label">Holati</label>
                                   <select
                                        required
                                        id="status"
                                        className="form-select"
                                        value={changeGroupDate.status}
                                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, status: e.target.value })}
                                   >
                                        <option value="active">Faol</option>
                                        <option value="finished">Tugagan</option>
                                        <option value="waiting">Kutilmoqda</option>
                                        <option value="paused">To'xtatilgan</option>
                                   </select>
                              </Form.Group>
                              <div className="d-flex justify-content-between gap-3">
                                   <div style={{ flex: 1 }}>
                                        <label className="form-label">Talabalar soni</label>
                                        <input
                                             type="number"
                                             className="form-control"
                                             value={changeGroupDate.students_count || 0}
                                             onChange={(e) => setChangeGroupDate({ ...changeGroupDate, students_count: parseInt(e.target.value) || 0 })}
                                        />
                                   </div>
                                   <div style={{ flex: 1 }}>
                                        <label className="form-label">Davomat KPI (%)</label>
                                        <input
                                             type="number"
                                             className="form-control"
                                             value={changeGroupDate.attendance_kpi || 0}
                                             onChange={(e) => setChangeGroupDate({ ...changeGroupDate, attendance_kpi: parseInt(e.target.value) || 0 })}
                                        />
                                   </div>
                              </div>
                              <div className="d-flex justify-content-between gap-3 mt-3">
                                   <div style={{ flex: 1 }}>
                                        <label className="form-label">Imtihon KPI (%)</label>
                                        <input
                                             type="number"
                                             className="form-control"
                                             value={changeGroupDate.exam_kpi || 0}
                                             onChange={(e) => setChangeGroupDate({ ...changeGroupDate, exam_kpi: parseInt(e.target.value) || 0 })}
                                        />
                                   </div>
                                   <div style={{ flex: 1 }}>
                                        <label className="form-label">Uyga vazifa KPI (%)</label>
                                        <input
                                             type="number"
                                             className="form-control"
                                             value={changeGroupDate.homework_kpi || 0}
                                             onChange={(e) => setChangeGroupDate({ ...changeGroupDate, homework_kpi: parseInt(e.target.value) || 0 })}
                                        />
                                   </div>
                              </div>
                              <div className="d-flex justify-content-end gap-2 mt-4">
                                   <button
                                        type="button"
                                        className="btn btn-sm py-2 px-4"
                                        style={{ background: "#e5e5e5", color: "#000" }}
                                        onClick={() => setChangeGroup(false)}
                                   >
                                        Orqaga
                                   </button>
                                   <button
                                        type="submit"
                                        className="btn btn-sm py-2 px-4"
                                        style={{ background: "#0085db", color: "#fff" }}
                                        onClick={saveGroupChanges}
                                   >
                                        Saqlash
                                   </button>
                              </div>
                         </Form>
                    </Modal>
               )}


               {/* Yangi o'quvchi qoshish */}
               {addNewUser && (
                    <Modal
                         title="Guruhga yangi o'quvchi qo'shish"
                         close={setAddNewUser}
                         anima={addNewUser}
                         width="35%"
                    >
                         <Input
                              label="O'quvchini Lidlar ro'yxatidan tanlang"
                              placeholder="Lidlarni qidirish..."
                              type="search"
                              onChange={(e) => handleSearch(e.target.value)}
                         />
                         <div className="d-flex flex-column gap-15 mt-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                              {searchLead.map(lead => (
                                   <div
                                        className="d-flex justify-content-between align-items-center p-2 border rounded-3"
                                        key={lead.id}
                                   >
                                        <div className="d-flex align-items-center gap-3">
                                             <span
                                                  style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#0881c2", color: "#fff" }}
                                                  className="d-flex align-items-center justify-content-center fs-4"
                                             >
                                                  {lead.name.charAt(0)}
                                             </span>
                                             <div className="d-flex flex-column">
                                                  <span className="fw-medium">{lead.name}</span>
                                                  <span className="fs-3">{lead.phone}</span>
                                             </div>
                                        </div>
                                        <button
                                             className="btn btn-sm"
                                             style={{ background: "#0881c2", color: "#fff" }}
                                        >
                                             <Icon icon="prime:user-plus" width="20" height="20" className="me-2" />
                                             Qo'shish
                                        </button>
                                   </div>
                              ))}
                         </div>
                    </Modal>
               )}


               {/* Dars Jadvallarini tahrirlash */}
               {changeActiveItem && (
                    <Modal
                         title="Jadvalni tahrirlash"
                         close={setChangeActiveItem}
                         anima={changeActiveItem}
                         width="30%"
                    >
                         <Form className="d-flex flex-column gap-3">

                              <div className="mt-3">
                                   {!special ? (
                                        <>
                                             <label htmlFor="days" className="form-label">
                                                  Dars kunlari
                                             </label>
                                             <select
                                                  id="days"
                                                  className="form-select"
                                                  value={
                                                       currentSchedule?.days_of_week?.some((d) => d.code === "Du") ? "toqK" :
                                                            currentSchedule?.days_of_week?.some((d) => d.code === "Se") ? "juftK" :
                                                                 currentSchedule?.days_of_week?.length > 0 ? "maxsusK" : ""
                                                  }
                                                  onChange={(e) => handleEditDays(e.target.value)}
                                             >
                                                  <option hidden value="">
                                                       Kun tanlash
                                                  </option>
                                                  <option value="toqK">Toq kunlar (Du, Cho, Ju)</option>
                                                  <option value="juftK">Juft Kunlar (Se, Pay, Sha)</option>
                                                  <option value="maxsusK">Maxsus</option>
                                             </select>
                                        </>
                                   ) : (
                                        <>
                                             <label className="form-label">Hafta kunlarini tanlang</label>
                                             <div className="d-flex flex-wrap gap-3 mb-2">
                                                  {weekDays.map((day) => (
                                                       <div className="form-check" key={day.code}>
                                                            <input
                                                                 className="form-check-input"
                                                                 type="checkbox"
                                                                 checked={currentSchedule?.days_of_week?.some(
                                                                      (d) => d.code === day.code
                                                                 )}
                                                                 onChange={() => toggleEditDay(day)}
                                                            />
                                                            <label className="form-check-label">{day.full}</label>
                                                       </div>
                                                  ))}
                                             </div>
                                             <button
                                                  type="button"
                                                  className="btn btn-sm btn-outline-secondary mt-2"
                                                  onClick={() => setSpecial(false)} // Ortga
                                             >
                                                  Ortga
                                             </button>
                                        </>
                                   )}
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                   <Input
                                        required
                                        type="time"
                                        label="Boshlanish vaqti"
                                        containerClassName="w-50"
                                        value={currentSchedule?.begin_time}
                                   />
                                   <span>
                                        -
                                   </span>
                                   <Input
                                        type="time"
                                        label="Tugash vaqvi"
                                        containerClassName="w-50"
                                        value={currentSchedule?.end_time}
                                   />
                              </div>

                              <div className="">
                                   <label htmlFor="teacher" className="form-label">O'qituvchi</label>
                                   <select id="teacher" required className="form-select">
                                        <option hidden>
                                             O'qituvchi
                                        </option>
                                   </select>
                              </div>

                              <div className="">
                                   <label htmlFor="room" className="form-label">Xona</label>
                                   <select id="room" required className="form-select">
                                        <option hidden>
                                             Xona
                                        </option>
                                   </select>
                              </div>

                              <div className="d-flex align-items-center gap-2">
                                   <Input
                                        type="date"
                                        label="Boshlanish sanasi"
                                        required
                                        containerClassName="w-50"
                                        value={currentSchedule?.start_time}
                                   />
                                   <span>
                                        -
                                   </span>
                                   <Input
                                        type="date"
                                        label="Tugash sanasi"
                                        containerClassName="w-50"
                                        value={currentSchedule?.ended_time}
                                   />
                              </div>

                              <div className="d-flex justify-content-end gap-2 mt-4">
                                   <button
                                        type="button"
                                        className="btn btn-sm py-2 px-4"
                                        style={{ background: "#e5e5e5", color: "#000" }}
                                        onClick={() => setChangeActiveItem(false)}
                                   >
                                        Orqaga
                                   </button>
                                   <button
                                        type="submit"
                                        className="btn btn-sm py-2 px-4"
                                        style={{ background: "#0085db", color: "#fff" }}
                                   // onClick={}
                                   >
                                        Saqlash
                                   </button>
                              </div>
                         </Form>
                    </Modal>
               )}


               {/* yangi jadval qoshish uchun */}
               {addSchedule && (
                    <Modal
                         title="Yangi jadval qo'shish"
                         close={setAddSchedule}
                         anima={addSchedule}
                         width="30%"
                    >
                         <Form className="d-flex flex-column gap-3" onSubmit={handleAddNewSchedule}>

                              <div className="mt-3">
                                   {!special ? (
                                        <>
                                             <label className="form-label">Dars kunlari</label>
                                             <select
                                                  className="form-select"
                                                  onChange={(e) => formatDays(e.target.value)}
                                             >
                                                  <option hidden value="">Kun tanlash</option>
                                                  <option value="toqK">Toq kunlar (Du, Cho, Ju)</option>
                                                  <option value="juftK">Juft kunlar (Se, Pay, Sha)</option>
                                                  <option value="maxsusK">Maxsus</option>
                                             </select>
                                        </>
                                   ) : (
                                        <>
                                             <label className="form-label">Hafta kunlarini tanlang</label>

                                             <div className="d-flex flex-wrap gap-3 mb-2">
                                                  {weekDays.map((day) => (
                                                       <div className="form-check" key={day.code}>
                                                            <input
                                                                 className="form-check-input"
                                                                 type="checkbox"
                                                                 checked={newSchedlueItems.days_of_week.some(
                                                                      (d) => d.code === day.code
                                                                 )}
                                                                 onChange={() => toggleDay(day)}
                                                            />
                                                            <label className="form-check-label">
                                                                 {day.full}
                                                            </label>
                                                       </div>
                                                  ))}
                                             </div>

                                             {/* Ortga tugma */}
                                             <button
                                                  type="button"
                                                  className="btn btn-sm btn-outline-secondary mt-2"
                                                  onClick={() => setSpecial(false)} // select rejimiga qaytadi
                                             >
                                                  Ortga
                                             </button>
                                        </>
                                   )}
                              </div>

                              <div className="d-flex align-items-center gap-2">
                                   <Input
                                        required
                                        type="time"
                                        label="Boshlanish vaqti"
                                        containerClassName="w-50"
                                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, begin_time: e.target.value })}
                                   />
                                   <span>
                                        -
                                   </span>
                                   <Input
                                        required
                                        type="time"
                                        label="Tugash vaqvi"
                                        containerClassName="w-50"
                                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, end_time: e.target.value })}
                                   />
                              </div>

                              <div className="">
                                   <label htmlFor="teacher" className="form-label">O'qituvchi</label>
                                   <select
                                        required
                                        id="teacher"
                                        className="form-select"
                                        onChange={(e) => teacher(e.target.value)}
                                   >
                                        <option hidden value="">
                                             O'qituvchi
                                        </option>
                                        {teacherData.map(t => (
                                             <option value={t.id}>{t.first_name + " " + t.last_name}</option>
                                        ))}
                                   </select>
                              </div>

                              <div className="">
                                   <label htmlFor="room" className="form-label">Xona</label>
                                   <select
                                        required
                                        id="room"
                                        className="form-select"
                                        onChange={(e) => room(e.target.value)}
                                   >
                                        <option hidden value="">
                                             Xona
                                        </option>
                                        {roomData.map(r => (
                                             <option value={r.id}>{r.name}</option>
                                        ))}
                                   </select>
                              </div>

                              <div className="d-flex align-items-center gap-2">
                                   <Input
                                        required
                                        type="date"
                                        label="Boshlanish sanasi"
                                        containerClassName="w-50"
                                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, start_date: e.target.value })}

                                   />
                                   <span>
                                        -
                                   </span>
                                   <Input
                                        type="date"
                                        label="Tugash sanasi"
                                        containerClassName="w-50"
                                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, end_date: e.target.value })}
                                   />
                              </div>

                              <div className="d-flex justify-content-between align-items-center">
                                   <span className="fs-4">
                                        Joriy jadval
                                   </span>

                                   <Form.Check // prettier-ignore
                                        type="switch"
                                        id="custom-switch"
                                        className="fs-5"
                                        defaultChecked={newSchedlueItems.is_active}
                                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, is_active: e.target.checked })}
                                   />
                              </div>

                              <div className="d-flex justify-content-end gap-2 mt-4">
                                   <button
                                        type="button"
                                        className="btn btn-sm py-2 px-4"
                                        style={{ background: "#e5e5e5", color: "#000" }}
                                        onClick={() => setAddSchedule(false)}
                                   >
                                        Orqaga
                                   </button>
                                   <button
                                        type="submit"
                                        className="btn btn-sm py-2 px-4"
                                        style={{ background: "#0085db", color: "#fff" }}
                                        onClick={handleAddNewSchedule}
                                   >
                                        Saqlash
                                   </button>
                              </div>
                         </Form>
                    </Modal>
               )}


               {/* modal for delate group */}
               {delateGroup && (
                    <Modal
                         title="Guruhni o'chirish"
                         close={setDelateGroup}
                         anima={delateGroup}
                         width="30%"
                    >
                         <p>
                              Rostdan ham ushbu guruhni o'chirmoqchimisiz?
                         </p>
                         <div className="d-flex justify-content-end gap-3">
                              <button
                                   className="btn btn-outline-secondary mt-1"
                                   onClick={() => setDelateGroup(false)}
                              >
                                   Orqaga
                              </button>
                              <button
                                   className="btn btn-outline-danger mt-1"
                                   onClick={DelateGroup}
                              >
                                   O'chirish
                              </button>
                         </div>
                    </Modal>
               )}




               <Back />

               <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="d-flex align-items-start gap-2">
                         <span
                              style={{ width: "45px", height: "45px", color: "#05c9ff", borderRadius: "8px", background: "#00a0ea25" }}
                              className="d-flex align-items-center justify-content-center "
                         >
                              <Icon icon="famicons:book-outline" width="25" height="25" />
                         </span>
                         <div className="d-flex flex-column">
                              <h3 className="lh-1 d-flex align-items-center gap-3">
                                   {currentGroup?.name}

                                   <span
                                        className="fs-2 px-2 py-1 text-capitalize py-1 rounded-3 border"
                                        style={{ color: !theme ? "#fff" : "#000" }}
                                   >
                                        {Status(currentGroup?.status)}
                                   </span>
                              </h3>
                              <span>
                                   {currentGroup?.description}
                              </span>
                         </div>
                    </div>

                    <div className="d-flex gap-3">
                         <button
                              className="btn btn-sm border py-2 px-3 fs-3"
                              style={{ color: !theme ? "#fff" : "#05112b" }}
                              onClick={() => setChangeGroup(true)}
                              id="bg-primary"
                         >
                              <Icon icon="line-md:pencil" className="me-1" width="20" height="20" />
                              Tahrirlash
                         </button>

                         <button
                              className="btn btn-sm py-2 px-3 fs-3"
                              style={{ border: "2px solid #cd3232", color: "#cd3232" }}
                              onClick={() => setDelateGroup(true)}
                         >
                              <Icon icon="iconamoon:trash" width="24" className="me-1" height="24" />
                              O'chirish
                         </button>
                    </div>
               </div>

               <div className="d-flex pt-4 justify-content-between align-items-center gap-3">
                    <div
                         className="card card-hover px-4 border py-4"
                         style={{ width: "33%" }}
                    >
                         <span className="fs-2">
                              <Icon icon="mage:user" width="18" height="18" className="me-2" />
                              O'qituvchi
                         </span>
                         <h6 className="fs-5 mt-2 text-capitalize">
                              {t ? `${t.teacher.first_name} ${t.teacher.last_name}` : "O'qituvchi"}
                         </h6>
                    </div>

                    <div
                         className="card card-hover px-4 border py-4"
                         style={{ width: "33%" }}
                    >
                         <spam className="fs-2">
                              <Icon icon="radix-icons:people" width="18" height="18" className="me-2" />
                              O'quvchilar
                         </spam>
                         <h6 className="fs-5 mt-2">{currentGroup?.students_count + " ta"}</h6>
                    </div>

                    <div
                         className="card card-hover px-4 border py-4"
                         style={{ width: "33%" }}
                    >
                         <spam className="fs-2">
                              <Icon icon="tabler:clock" width="18" height="18" className="me-2" />
                              Jadval
                         </spam>
                         <Dropdown autoClose="outside inside" className="mt-2">
                              <Dropdown.Toggle className={`fs-4 ${!theme ? "text-white" : "text-black"}`} style={{ background: 'transparent', border: 'none', padding: '0' }}>
                                   {
                                        t?.days_of_week.map(d => " " + d.code) && t?.begin_time.slice(0, 5) !== "undifined" ? t?.days_of_week.map(d => " " + d.code) + " | " + t?.begin_time.slice(0, 5) : "Belgilanmagan"
                                   }
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                   {currentGroup?.schedule_items?.active?.map(item => (
                                        <Dropdown.Item className="fs-4 rounded-2">
                                             {" " + item.days_of_week.map(d => d.code) + " | " + item.begin_time.slice(0, 5)}
                                        </Dropdown.Item>
                                   ))}
                              </Dropdown.Menu>
                         </Dropdown>
                    </div>

                    <div
                         className="card card-hover px-4 border py-4"
                         style={{ width: "33%" }}
                    >
                         <spam className="fs-2">
                              <Icon icon="lucide:calendar" width="18" height="18" className="me-2" />
                              Boshlanish
                         </spam>
                         <h6 className="fs-3 mt-2">
                              {currentGroup?.started_date || "Belgilanmagan"} {" | "} {currentGroup?.ended_date || "Belgilanmagan"}
                         </h6>
                    </div>

                    <div
                         className="card card-hover px-4 border py-4"
                         style={{ width: "33%" }}
                    >
                         <spam className="fs-2">
                              <Icon icon="simple-line-icons:diamond" width="16" height="15" className="me-2" />
                              Kurs
                         </spam>
                         <h6 className="fs-4 mt-2">
                              {currentGroup?.course_name || "Belgilanmagan"}
                         </h6>
                    </div>
               </div>

               <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="d-flex flex-column gap-2">
                    {/* Tabs Navigaye */}
                    <div
                         style={{ padding: "8px", background: theme ? "#f1f1f1" : "#111c2d", borderRadius: "8px", width: "365px" }}
                    >
                         <Nav variant="pills">
                              <Nav.Item>
                                   <Nav.Link
                                        eventKey="students"
                                        style={{
                                             cursor: "pointer",
                                             background: activeTab === "students" && !theme ? "#15263a" : activeTab === "students" && theme ? "#fff" : "transparent",
                                             color: activeTab === "students" && !theme ? "#fff" : theme ? "#000" : "#fff",
                                             borderRadius: "8px",
                                             fontSize: "14px"
                                        }}
                                   >
                                        <Icon icon="radix-icons:people" width="15" height="15" className="me-2" />
                                        O'quvchilar
                                   </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                   <Nav.Link
                                        eventKey="attendence"
                                        style={{
                                             cursor: "pointer",
                                             background: activeTab === "attendence" && !theme ? "#15263a" : activeTab === "attendence" && theme ? "#fff" : "transparent",
                                             color: activeTab === "attendence" && !theme ? "#fff" : theme ? "#000" : "#fff",
                                             borderRadius: "8px",
                                             fontSize: "14px"
                                        }}
                                   >
                                        <Icon icon="lucide:clipboard-list" width="15" height="15" className="me-2" />
                                        Davomat
                                   </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                   <Nav.Link
                                        eventKey="schedule"
                                        style={{
                                             cursor: "pointer",
                                             background: activeTab === "schedule" && !theme ? "#15263a" : activeTab === "schedule" && theme ? "#fff" : "transparent",
                                             color: activeTab === "schedule" && !theme ? "#fff" : theme ? "#000" : "#fff",
                                             borderRadius: "8px",
                                             fontSize: "14px"
                                        }}
                                   >
                                        <Icon icon="ion:calendar-outline" width="18" height="18" className="me-2" />
                                        Jadval
                                   </Nav.Link>
                              </Nav.Item>
                         </Nav>
                    </div>

                    <Tab.Content className="mt-3">
                         <Tab.Pane eventKey="students">
                              {/* O'quvchilar ro'yxati shu yerda bo'ladi */}
                              <Card>
                                   <Card.Body>
                                        <div className="d-flex align-items-center justify-content-between">
                                             <h5 className="fs-4 fw-medium">
                                                  <Icon icon="radix-icons:people" width="20" height="20" color="#00c8ff" className="me-2" />
                                                  O'quvchilar ro'yxati
                                             </h5>

                                             <button
                                                  className="btn btn-sm fs-3 py-2"
                                                  style={{ background: "#0881c2", color: "#fff" }}
                                                  onClick={() => setAddNewUser(true)}
                                             >
                                                  <Icon icon="prime:user-plus" width="20" height="20" className="me-2" />
                                                  O'quvchi qo'shish
                                             </button>
                                        </div>

                                        <StudentsTable currentStudents={currentStudents} />
                                   </Card.Body>
                              </Card>
                         </Tab.Pane>
                         <Tab.Pane eventKey="attendence">
                              {/* Davomat jadvali shu yerda bo'ladi */}
                              <Card>
                                   <Card.Body>
                                        <h5 className="fs-4 fw-medium">
                                             <Icon icon="lucide:clipboard-list" width="20" height="20" color="#00c8ff" className="me-2" />
                                             Davomat jadvali
                                        </h5>

                                        <AttendenceTable
                                             studentsData={studentsData}
                                             currentStudents={currentStudents}
                                             setCurrentStudents={setCurrentStudents}
                                             days_of_week={t?.days_of_week}
                                        />

                                   </Card.Body>
                              </Card>
                         </Tab.Pane>
                         <Tab.Pane eventKey="schedule">
                              <Card>
                                   <Card.Body>
                                        <div className="d-flex align-items-center justify-content-between">
                                             <h5 className="fs-4 fw-medium">
                                                  <Icon icon="ion:calendar-outline" width="20" height="20" color="#00c8ff" className="me-2" />
                                                  Dars jadvali
                                             </h5>

                                             <button
                                                  className="btn btn-sm fs-3 py-2"
                                                  style={{ background: "#0881c2", color: "#fff" }}
                                                  onClick={() => setAddSchedule(true)}
                                             >
                                                  <Icon icon="prime:user-plus" width="20" height="20" className="me-2" />
                                                  Jadval qo'shish
                                             </button>
                                        </div>

                                        <Schedule schedule_items={schedule_items} setChange_items={setChangeActiveItem} />
                                   </Card.Body>
                              </Card>
                         </Tab.Pane>
                    </Tab.Content>
               </Tab.Container>
          </div >
     )
}

export default GroupDetalie