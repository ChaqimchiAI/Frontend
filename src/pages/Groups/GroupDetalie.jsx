import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTheme } from "../../Context/Context"
import Back from "../../components/Ui/Back";
import { Card, Dropdown, Form, Nav, Spinner, Tab } from "react-bootstrap";
import studentsData from "../../data/Students.json"
import leadsData from "../../data/Leads.json"
import Modal from "../../components/Ui/Modal";
import { Input } from "../../components/Ui/Input";
import StudentsTable from "./Components/StudentsTable";
import AttendenceTable from "./Components/AttendenceTable";
import Schedule from "./Components/Schedule";
import axios from "axios";
import Notification from "../../components/Ui/Notification";

import { useDeleteGroup, useEditGroup, useEditGroupSchedule, useGroup, useGroupSchedule, useGroupScheduleById } from "../../data/queries/group.queries"
import { useRoomsData } from "../../data/queries/room.queries"
import { useTeachersData } from "../../data/queries/teachers.queries"
import { useCreateGroupSchedule } from "../../data/queries/group.queries"
import { useCourses } from "../../data/queries/courses.queries"
import EditGroup from "./GroupDetaileModals/EditGroup";
import AddNewStudents from "./GroupDetaileModals/AddNewStudents";
import EditGroupSchedule from "./GroupDetaileModals/EditGroupSchedule";

const d = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

const GroupDetalie = () => {
     const { id } = useParams()
     const { theme } = useTheme()

     // =========== Getted ============

     // guruhni chaqirish
     const { data: currentGroup } = useGroup(id)

     // xonalarni chaqirish
     const { data: rooms } = useRoomsData()
     const roomData = rooms?.results

     // o'qituvchilarni chaqirish
     const { data: teachers } = useTeachersData()
     const teacherData = teachers?.results

     // kursni chaqirish
     const { data: courses } = useCourses()
     const courseData = courses?.results

     // dars jadvvallarni olish
     const { data: schedule_items } = useGroupSchedule(id)

     // =========== Edited ============

     // guruhni tahrirlash
     const { mutate: editGroup, isLoading: editing } = useEditGroup();

     // dars jadvalini tahrirlash
     const { mutate: editGroupSchedule, isLoading: editingSchedule } = useEditGroupSchedule();

     // yangi jadvak qoshish uchun
     const { mutate: createGroupSchedule, isLoading: creatingSchedule } = useCreateGroupSchedule();

     // =========== Deleted ============
     const { mutate: deleteGroup, isLoading: deleting } = useDeleteGroup();

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
          days_of_week: [],
          begin_time: "",
          end_time: "",
          teacher: "",
          room: "",
          start_date: "",
          end_date: "",
          is_active: true
     })

     const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })

     const [currentStudents, setCurrentStudents] = useState([])
     const [availabilitiyTeacher, setAvailabilitiyTeacher] = useState([])

     const [activeTab, setActiveTab] = useState("students")
     const [changeActiveItem, setChangeActiveItem] = useState(false)

     useEffect(() => {
          const studentsInGroup = studentsData.filter(st => st.group === currentGroup?.name)
          setCurrentStudents(studentsInGroup)
     }, [currentGroup])

     useEffect(() => {
          setChangeGroupDate(currentGroup)
     }, [changeGroup])


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
     const saveGroupChanges = (e) => {
          e.preventDefault()

          if (!changeGroupDate.name || !changeGroupDate.course) {
               setNotif({ show: true, type: 'warn', message: "Kerakli barcha maydonlarni to'ldiring!" })
               return
          }

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

               editGroup({ id: id, data: dataToSend });


               setNotif({ show: true, type: "edited", message: "Guruh ma'lumotlari tahrirlandi" })

               setChangeGroup(false)
          } catch (err) {
               console.error(err)
               setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
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
                    days_of_week: [1, 3, 5],
               });
               setSpecial(false);
          }

          if (value === "juftK") {
               setNewSchedlueItems({
                    ...newSchedlueItems,
                    days_of_week: [2, 4, 6],
               });
               setSpecial(false);
          }

          if (value === "maxsusK") {
               setCurrentSchedule({
                    ...currentSchedule,
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
                    days_of_week: [1, 3, 5],
               });
               setSpecial(false);
          } else if (value === "juftK") {
               setCurrentSchedule({
                    ...currentSchedule,
                    days_of_week: [2, 4, 6],
               });
               setSpecial(false);
          } else if (value === "maxsusK") {
               setSpecial(true);
          }
     };

     // kunni raqamlarga o'tkazish
     const normalizeDays = (days) => {
          if (!Array.isArray(days)) return [];

          // agar allaqachon raqam bo‘lsa
          if (typeof days[0] === "number") return days;

          // agar object bo‘lsa
          const map = {
               Du: 1,
               Se: 2,
               Cho: 3,
               Pay: 4,
               Ju: 5,
               Sha: 6,
               Ya: 7
          };

          return days.map(d => map[d.code]);
     };

     // jadvalni tahrirlash
     const updateSchedule = (e) => {
          e.preventDefault();

          if (
               !currentSchedule.begin_time ||
               !currentSchedule.end_time ||
               !currentSchedule.start_date ||
               !currentSchedule.days_of_week?.length ||
               !currentSchedule.room ||
               !currentSchedule.teacher
          ) {
               setNotif({ show: true, type: 'error', message: "Barcha maydonlarni to'ldiring!" })
               return;
          }

          if (!id) {
               setNotif({ show: true, type: "error", message: "Guruh IDsi topilmadi" });
               return;
          }

          try {

               const dataToSend = {
                    days_of_week: normalizeDays(currentSchedule.days_of_week),
                    begin_time: currentSchedule.begin_time,
                    end_time: currentSchedule.end_time,
                    teacher:
                         typeof currentSchedule.teacher === "object"
                              ? currentSchedule.teacher.id
                              : currentSchedule.teacher,
                    room:
                         typeof currentSchedule.room === "object"
                              ? currentSchedule.room.id
                              : currentSchedule.room,
                    start_date: currentSchedule.start_date,
                    end_date: currentSchedule.end_date || null,
                    is_active: currentSchedule.is_active
               };


               editGroupSchedule({ id, scheduleId: currentSchedule.id, data: dataToSend })
               setChangeActiveItem(false)
               setNotif({ show: true, type: 'success', message: "Jadval muvoffaqyatli tahrirlandi" })
          } catch (err) {
               setNotif({ show: true, type: 'error', message: "Jadval tahrirlanmadi!" })
          }

     };

     // yangi jadval un checkbox dan kun tanlash
     const otherDays = ({ i, checked }) => {
          setNewSchedlueItems(prev => {
               const filteredDays = (prev.days_of_week || []).filter(id => id !== i);

               return {
                    ...prev,
                    days_of_week: checked ? [...filteredDays, i] : filteredDays
               };
          });
     }

     // add new schedule
     const handleAddNewSchedule = async (e) => {
          e.preventDefault()

          if (
               !newSchedlueItems.begin_time ||
               !newSchedlueItems.end_time ||
               !newSchedlueItems.start_date ||
               !newSchedlueItems.days_of_week?.length ||
               !newSchedlueItems.room ||
               !newSchedlueItems.teacher
          ) {
               setNotif({ show: true, type: 'warn', message: "Barcha maydonlarni to'ldiring!" })
               return
          }
          if (!id || id === 'undefined') {
               setNotif({ show: true, type: 'error', message: "Guruh IDsi topilmadi. Sahifani yangilang." });
               return;
          }
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

          try {
               createGroupSchedule({ id, data: dataToSend }).then(() => {
                    setAddSchedule(false)

                    setNotif({ show: true, type: 'success', message: "Jadval muvoffaqyatli qo'shildi" })

                    setNewSchedlueItems({
                         days_of_week: [],
                         begin_time: "",
                         end_time: "",
                         teacher: "",
                         room: "",
                         start_date: "",
                         end_date: "",
                         is_active: true
                    })
               })
          } catch (err) {
               console.log(err);
               setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
          }
     }

     // delate group
     const DelateGroup = () => {
          try {
               deleteGroup(id)

               setNotif({ show: true, type: 'deleted', message: "Guruh muvoffaqyatli o'chirildi" })
               setDelateGroup(deleting ? false : true)

               // Bosh sahifaga yo'naltiritish
               window.history.back()
          } catch (err) {
               console.error(err)
               setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
          }
     }

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
                    <EditGroup
                         changeGroup={changeGroup}
                         setChangeGroup={setChangeGroup}
                         changeGroupDate={changeGroupDate}
                         setChangeGroupDate={setChangeGroupDate}
                         saveGroupChanges={saveGroupChanges}
                         courseData={courseData}
                         editing={editing}
                    />
               )}


               {/* Yangi o'quvchi qoshish */}
               {addNewUser && (
                    <AddNewStudents
                         addNewUser={addNewUser}
                         setAddNewUser={setAddNewUser}
                         handleSearch={handleSearch}
                         searchLead={searchLead}
                    />
               )}


               {/* Dars Jadvallarini tahrirlash */}
               {changeActiveItem && (
                    <EditGroupSchedule
                         changeActiveItem={changeActiveItem}
                         setChangeActiveItem={setChangeActiveItem}
                         currentSchedule={currentSchedule}
                         setCurrentSchedule={setCurrentSchedule}
                         special={special}
                         setSpecial={setSpecial}
                         updateSchedule={updateSchedule}
                         d={d}
                         roomData={roomData}
                         teacherData={teacherData}
                         editing={editingSchedule}
                    />
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
                                   <label className="form-label">Dars kunlari</label>
                                   {!special ? (
                                        <select
                                             className="form-select"
                                             onChange={(e) => formatDays(e.target.value)}
                                        >
                                             <option hidden value="">Kun tanlash</option>
                                             <option value="toqK">Toq kunlar (Du, Cho, Ju)</option>
                                             <option value="juftK">Juft kunlar (Se, Pay, Sha)</option>
                                             <option value="maxsusK">Maxsus</option>
                                        </select>
                                   ) : (
                                        <div className="d-flex flex-column align-items-start ms-3">
                                             <div className="d-flex flex-wrap">
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
                                                  onClick={() => {
                                                       setSpecial(false);
                                                       setNewSchedlueItems({ ...newSchedlueItems, days_of_week: [] })
                                                  }}
                                             >
                                                  Ortga
                                             </button>
                                        </div>
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
                                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, teacher: Number(e.target.value) })}
                                   >
                                        <option hidden value="">
                                             O'qituvchi
                                        </option>
                                        {teacherData?.map(t => (
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
                                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, room: Number(e.target.value) })}
                                   >
                                        <option hidden value="">
                                             Xona
                                        </option>
                                        {roomData?.map(r => (
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
                                        {creatingSchedule ? <Spinner size="sm" animation="border" /> : "Saqlash"}
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
                         <p className="mt-2">
                              Rostdan ham ushbu guruhni o'chirmoqchimisiz?
                         </p>
                         <div className="d-flex justify-content-end gap-2 mt-4">
                              <button
                                   type="button"
                                   className="btn btn-sm py-2 px-4"
                                   style={{ background: "#e5e5e5", color: "#000" }}
                                   onClick={() => setDelateGroup(false)}
                              >
                                   Orqaga
                              </button>
                              <button
                                   type="submit"
                                   className="btn btn-sm py-2 px-4"
                                   style={{ background: "#cd3232", color: "#fff" }}
                                   onClick={DelateGroup}
                              >
                                   {deleting ? <Spinner size="sm" animation="border" /> : "O'chirish"}
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
                         className="card card-hover px-4 border py-4 z-3"
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