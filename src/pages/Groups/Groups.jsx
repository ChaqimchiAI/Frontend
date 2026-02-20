import { Icon } from "@iconify/react"
import { useState } from "react"
import { Table } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../Context/Context"
import Notification from "../../components/Ui/Notification"
import { useCreateGroup, useGroups } from "../../data/queries/group.queries"
import { useCourses } from "../../data/queries/courses.queries"
import AddGroup from "./GroupDetaileModals/AddGroup"

const Groups = () => {
  const navigate = useNavigate()

  const { theme } = useTheme()

  // Guruhlarni chaqirish
  const { data: groupsData, isLoading: groupsLoading } = useGroups()
  if (groupsLoading) return <div>Loading...</div>

  const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })

  const [addGroup, setAddGroup] = useState(false)

  // statusni tog'ri olish
  const Status = (s) => {
    let status = s === "active" ? "Faol"
      : s === "finished" ? "Tugallangan"
        : s === "waiting" ? "Kutilmoqda"
          : s === "paused" ? "To'xtatilgan"
            : "▬"

    return status
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
        <AddGroup
          addGroup={addGroup}
          setAddGroup={setAddGroup}
          setNotif={setNotif}
        />
      )}


      <div className="d-flex w-100 justify-content-between align-items-start me-3">
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
          className="btn btn-sm text-white py-2 px-3 fs-3 me-3"
          style={{ background: "#0085db" }}
          onClick={() => setAddGroup(true)}
        >
          <Icon icon="qlementine-icons:plus-16" className="me-1" width="16" height="16" />
          Yangi guruh
        </button>
      </div>

      <div className="card card-body pt-0 mt-3 me-3">
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
                    {group.students_count || 0}
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