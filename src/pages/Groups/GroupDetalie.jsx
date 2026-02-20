import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTheme } from "../../Context/Context"
import Back from "../../components/Ui/Back";
import { Card, Dropdown, Nav, Spinner, Tab } from "react-bootstrap";
import Modal from "../../components/Ui/Modal";
import StudentsTable from "./Components/StudentsTable";
import AttendenceTable from "./Components/AttendenceTable";
import Schedule from "./Components/Schedule";
import Notification from "../../components/Ui/Notification";

import { useDeleteGroup, useEditGroup, useGroup, useGroupSchedule, useGroupStudents } from "../../data/queries/group.queries"
import { useRoomsData } from "../../data/queries/room.queries"
import { useTeachersData } from "../../data/queries/teachers.queries"
import { useCourses } from "../../data/queries/courses.queries"
import { useLeads } from "../../data/queries/leads.queries";
// import { useStudentsData } from "../../data/queries/students.queries";

import { useGroupAttendances, useStudentAttendances, useAttendances, useCreateAttendance } from "../../data/queries/attendances.queries";

import EditGroup from "./GroupDetaileModals/EditGroup";
import AddNewStudents from "./GroupDetaileModals/AddNewStudents";
import EditGroupSchedule from "./GroupDetaileModals/EditGroupSchedule";
import AddNewSchedule from "./GroupDetaileModals/AddNewSchedule";

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

     // leadslarni olish
     const { data: leads } = useLeads()
     const leadsData = leads?.results

     // guruhdagi o'quvchilarni olish
     const { data: studentsData } = useGroupStudents(id)


     // =========== Edited ============

     // guruhni tahrirlash
     const { mutate: editGroup, isLoading: editing } = useEditGroup();

     // =========== Deleted ============
     const { mutate: deleteGroup, isLoading: deleting } = useDeleteGroup();

     const [addNewUser, setAddNewUser] = useState(false)
     const [changeGroup, setChangeGroup] = useState(false)
     const [addSchedule, setAddSchedule] = useState(false)
     const [delateGroup, setDelateGroup] = useState(false)
     const [changeAttande, setChangeAttande] = useState([])

     const [searchLead, setSearchLead] = useState(leadsData)
     const [changeGroupDate, setChangeGroupDate] = useState({})
     const [currentSchedule, setCurrentSchedule] = useState({})


     const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })

     const [activeTab, setActiveTab] = useState("students")
     const [changeActiveItem, setChangeActiveItem] = useState(false)

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
               lead.first_name.toLowerCase().includes(value.toLowerCase()) ||
               lead.last_name.toLowerCase().includes(value.toLowerCase()) ||
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

          editGroup(
               { id: id, data: dataToSend },
               {
                    onSuccess: () => {
                         setNotif({ show: true, type: "edited", message: "Guruh ma'lumotlari tahrirlandi" })
                         setChangeGroup(false)
                    },
                    onError: (err) => {
                         console.error(err)
                         setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                    }
               }
          );
     }

     useEffect(() => {
          const currentItem = schedule_items?.active?.find(s => s.id == changeActiveItem)

          setCurrentSchedule(currentItem)
     }, [changeActiveItem])

     const t = currentGroup?.schedule_items?.active?.at(-1); // ohirgi dars jadvalini olish

     // delate group
     const DelateGroup = () => {
          deleteGroup(
               id,
               {
                    onSuccess: () => {
                         setNotif({ show: true, type: 'deleted', message: "Guruh muvoffaqyatli o'chirildi" })
                         setDelateGroup(false)
                         window.history.back()
                    },
                    onError: (err) => {
                         console.error(err)
                         setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                    }
               }
          )
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
                         id={id}
                         setNotif={setNotif}
                    />
               )}


               {/* Dars Jadvallarini tahrirlash */}
               {changeActiveItem && (
                    <EditGroupSchedule
                         changeActiveItem={changeActiveItem}
                         setChangeActiveItem={setChangeActiveItem}
                         currentSchedule={currentSchedule}
                         setCurrentSchedule={setCurrentSchedule}
                         d={d}
                         roomData={roomData}
                         teacherData={teacherData}
                         id={id}
                         setNotif={setNotif}
                    />
               )}


               {/* yangi jadval qoshish uchun */}
               {addSchedule && (
                    <AddNewSchedule
                         addSchedule={addSchedule}
                         setAddSchedule={setAddSchedule}
                         teacherData={teacherData}
                         roomData={roomData}
                         d={d}
                         id={id}
                         setNotif={setNotif}
                    />
               )}


               {/* modal for delate group */}
               {delateGroup && (
                    <Modal
                         title="Guruhni o'chirish"
                         close={setDelateGroup}
                         anima={delateGroup}
                         width="30%"
                         zIndex={100}
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

               <div className="d-flex w-100 justify-content-between align-items-start pe-3">
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

               <div className="d-flex pt-4 justify-content-between align-items-center gap-3 pe-3">
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

                    <Tab.Content className="mt-3 pe-3">
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

                                        <StudentsTable currentStudents={studentsData} groupId={id} setNotif={setNotif} />
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
                                             days_of_week={t?.days_of_week}
                                             scheduleId={t?.id}
                                             id={id}
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