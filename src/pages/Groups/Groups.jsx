import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import { Form, Spinner, Table } from "react-bootstrap"
import Modal from "../../components/Ui/Modal"
import teacherData from "../../data/Teachers.json"
import roomData from "../../data/Rooms.json"
import { Input } from "../../components/Ui/Input"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../Context/Context"
import axios from "axios"
import Notification from "../../components/Ui/Notification"
import { useCreateGroup, useGroups } from "../../data/queries/group.queries"
import { useCourses } from "../../data/queries/courses.queries"

const Groups = () => {
  const navigate = useNavigate()

  const { theme } = useTheme()

  // Guruhlarni chaqirish
  const { data: groupsData, isLoading: groupsLoading } = useGroups()
  if (groupsLoading) return <div>Loading...</div>

  // kurslarni chaqirish
  const { data: courses } = useCourses()
  const courseData = courses?.results

  const { mutateAsync: createGroup, isPending: createGroupLoading } = useCreateGroup()

  const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })

  const [addGroup, setAddGroup] = useState(false)

  const [addNewGroup, setAddNewGroup] = useState({
    name: "",
    course_name: "",
    started_date: "",
    ended_date: "",
    status: "",
    description: "",
    course: 0,
    branch_name: "",
    branch: 0,
    attendance_kpi: 0,
    exam_kpi: 0,
    homework_kpi: 0,
    students_count: 0,
    schedule_items: "string"
  })

  // statusni tog'ri olish
  const Status = (s) => {
    let status = s === "active" ? "Faol"
      : s === "finished" ? "Tugallangan"
        : s === "waiting" ? "Kutilmoqda"
          : s === "paused" ? "To'xtatilgan"
            : "▬"

    return status
  }

  const handleAddNewGroup = (e) => {
    e.preventDefault()

    if ((addNewGroup.course_name || addNewGroup.name || addNewGroup.start_date || addNewGroup.status) === "") {
      setNotif({ show: true, type: "warn", message: "Barcha maydonlarni to'ldiring!" })
      return
    }

    const payload = {
      name: addNewGroup.name,
      status: addNewGroup.status,
      course: Number(addNewGroup.course),
      branch: 1,
      attendance_kpi: 0,
      exam_kpi: 0,
      homework_kpi: 0,
      students_count: 0,
      started_date: addNewGroup.started_date,
      ended_date: addNewGroup.ended_date || null
    }

    createGroup(payload, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "Guruh muvaffaqiyatli qo‘shildi" })
        setAddGroup(false)
        setAddNewGroup({
          name: "",
          course_name: "",
          started_date: "",
          ended_date: "",
          status: "",
          description: "",
          course: 0,
          branch_name: "",
          branch: 0,
          attendance_kpi: 0,
          exam_kpi: 0,
          homework_kpi: 0,
          students_count: 0,
          schedule_items: "string"
        })
      },
      onError: (err) => {
        console.error(err)
        setNotif({ show: true, type: "error", message: "Guruh qo‘shishda xatolik!" })
      }
    })
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

      {/* Modal for add new group */}
      {addGroup && (
        <Modal
          title="Yangi guruh qo'shish"
          close={setAddGroup}
          anima={addGroup}
          width="30%"
          zIndex={100}
        >
          <Form
            className="mt-3"
            onSubmit={handleAddNewGroup}
          >
            <Form.Group className="mb-3">
              <Input
                label="Guruh nomi"
                required
                placeholder="Guruh nomi..."
                onChange={(e) => setAddNewGroup({ ...addNewGroup, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <label htmlFor="course" className="form-label">Kurs</label>
              <select
                required
                id="course"
                className="form-select"
                onChange={(e) =>
                  setAddNewGroup({ ...addNewGroup, course: e.target.value })
                }
              >
                <option value="" hidden>Kurs tanlash</option>

                {courseData.map(c =>
                  <option value={c.id}>{c.name}</option>
                )}
              </select>
            </Form.Group>
            <div className="d-flex justify-content-between gap-3">
              <Input
                required
                type="date"
                label="Boshlanish sanasi"
                containerClassName="w-50"
                onChange={(e) => setAddNewGroup({ ...addNewGroup, started_date: e.target.value })}
              />
              <Input
                type="date"
                label="Tugash sanasi"
                containerClassName="w-50"
                onChange={(e) => setAddNewGroup({ ...addNewGroup, ended_date: e.target.value })}

              />
            </div>
            <Form.Group className="mb-3">
              <label htmlFor="status" className="form-label">Holati</label>
              <select
                required
                id="status"
                className="form-select"
                onChange={(e) => setAddNewGroup({ ...addNewGroup, status: e.target.value })}
              >
                <option value="active">Faol</option>
                <option value="finished">Tugagan</option>
                <option value="waiting">Kutilmoqda</option>
                <option value="paused">To'xtatilgan</option>
              </select>
            </Form.Group>
            <Form.Group className="mb-3">
              <label htmlFor="desc" className="form-label">Izoh</label>
              <textarea
                rows="3"
                id="desc"
                placeholder="Izoh..."
                className="form-control"
                style={{ resize: "none" }}
                onChange={(e) => setAddNewGroup({ ...addNewGroup, description: e.target.value })}
              ></textarea>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-sm py-2 px-4"
                style={{ background: "#e5e5e5", color: "#000" }}
                onClick={() => setAddGroup(false)}
              >
                Orqaga
              </button>
              <button
                type="submit"
                className="btn btn-sm py-2 px-4"
                style={{ background: "#0085db", color: "#fff" }}
                onClick={handleAddNewGroup}
              >
                {createGroupLoading ? <Spinner animation="border" size="sm"/> :  "Saqlash"}
              </button>
            </div>
          </Form>
        </Modal>
      )}


      <div className="d-flex w-100 justify-content-between align-items-start">
        <div className="d-flex align-items-start gap-2">
          <span
            style={{ width: "40px", height: "40px", color: "#05c9ff", borderRadius: "8px", background: "#00a0ea25" }}
            className="d-flex align-items-center justify-content-center "
          >
            <Icon icon="radix-icons:people" className="fs-6" />
          </span>
          <div className="d-flex flex-column">
            <h3 className="lh-1">Guruhlar</h3>
            <span>
              Jami {groupsData?.length} ta guruh
            </span>
          </div>
        </div>

        <button
          className="btn btn-sm text-white py-2 px-3 fs-3"
          style={{ background: "#0085db" }}
          onClick={() => setAddGroup(true)}
        >
          <Icon icon="qlementine-icons:plus-16" className="me-1" width="16" height="16" />
          Yangi guruh
        </button>
      </div>

      <div className="">
        <Table striped hover className="mt-4">
          <thead>
            <tr>
              <th>№</th>
              <th>Guruh nomi</th>
              <th>Kurs</th>
              <th>Kun</th>
              <th>Dars vaqti</th>
              <th>O'qituvchi</th>
              <th>O'quvchilar soni</th>
              <th>Xona</th>
              <th>Guruh holati</th>
            </tr>
          </thead>
          <tbody>
            {groupsData?.map((group) => {
              const t = group.schedule_items?.active?.at(-1)
              return (
                <tr
                  key={group.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/groups/${group.id}`)}
                >
                  <td className="text-capitalize">{group.id}</td>
                  <td className="text-capitalize">{group.name}</td>
                  <td className="text-capitalize">{group.course_name}</td>
                  <td className="text-capitalize">
                    {t?.days_of_week?.map(d => d.code).join(", ") || "-"}
                  </td>
                  <td className="text-capitalize">
                    {
                      t?.begin_time && t?.end_time ? t?.begin_time.slice(0, 5) + " - " + t?.end_time.slice(0, 5) : "-"
                    }
                  </td>
                  <td className="text-capitalize">
                    {
                      t?.teacher?.first_name && t?.teacher?.last_name
                        ? t?.teacher?.first_name + " " + t?.teacher?.last_name
                        : "-"
                    }
                  </td>
                  <td className="text-capitalize">
                    <Icon icon="radix-icons:people" className="fs-5 me-2" />
                    {group.student_count || 0}
                  </td>
                  <td className="text-capitalize">
                    {t?.room?.name || "-"}
                  </td>
                  <td className="text-capitalize">
                    <span className="px-3 fs-2 py-1 rounded-3 border" style={{ color: !theme ? "#fff" : "#000" }}>
                      {Status(group.status)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default Groups