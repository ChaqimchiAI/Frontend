import { useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import DataTable from "../../components/Ui/DataTable"
import examData from "../../data/Exams.json"
import { Icon } from "@iconify/react"
import Modal from "../../components/Ui/Modal"
import { Input } from "../../components/Ui/Input"
import Notification from "../../components/Ui/Notification"

const sections = ["A", "B", "C", "D", "E"]

const Schedule = () => {
  const [edit, setEdit] = useState(false)
  const [delate, setDelate] = useState(false)
  const [ChengeExam, setChengeExam] = useState({})
  const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })

  const handleEdit = (id) => {
    setEdit(id)
    const chengeExam = examData.find(ex => ex.id === id)
    setChengeExam(chengeExam)
  }

  const handleSaveChanges = () => {
    setEdit(false)
    setNotif({ show: true, type: 'edited', message: 'Teacher details saved' })
  }

  const delateExam = () => {
    setDelate(false)
    const delateData = examData.find(ex => ex.id === delate)
    examData.splice(delateData, 1)
    setNotif({ show: true, type: 'deleted', message: 'Delete exam successfully' })
  }


  return (
    <>


      {/* Ma'lumotlarni tahrirlash uchun */}

      {edit &&
        <Modal
          title="Tahrirlash"
          close={setEdit}
          anima={edit}
          width="50%"
        >
          <div className="d-flex gap-5 mt-3">
            <div className="d-flex flex-column w-40">
              <Input
                label="Sinf"
                placeholder="Sinf"
                value={ChengeExam.class}
                onChange={(e) => setChengeExam({ ...ChengeExam, class: e.target.value })}
              />
              <label htmlFor="section" className="form-label d-flex flex-column gap-2">
                <span>
                  Bo'lim
                </span>
                <select
                  id="section"
                  className="form-select"
                  value={ChengeExam.section}
                  onChange={(e) => setChengeExam({ ...ChengeExam, section: e.target.value })}
                >
                  {sections.map(s =>
                    <option value={s}>{s}</option>
                  )}
                </select>
              </label>
            </div>
            <div className="d-flex flex-column gap-3 w-35">
              <div className="d-flex flex-column">
                <label htmlFor="time" className="form-label">
                  Vaqti
                </label>
                <div className="d-flex align-content-center gap-3">
                  <Input
                    id="time"
                    type="time"
                    style={{ width: "110px" }}
                    value={ChengeExam.start_time}
                    onChange={(e) => setChengeExam({ ...ChengeExam, start_time: e.target.value })}
                  />
                  <span className="fs-7">:</span>
                  <Input
                    type="time"
                    style={{ width: "110px" }}
                    value={ChengeExam.end_time}
                    onChange={(e) => setChengeExam({ ...ChengeExam, end_time: e.target.value })}
                  />
                </div>
              </div>
              <Input
                type="date"
                label="Sana"
                value={ChengeExam.date}
                onChange={(e) => setChengeExam({ ...ChengeExam, date: e.target.value })}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3 mt-3">
            <button
              className="btn btn-outline-danger mt-1"
              onClick={() => setEdit(false)}
            >
              Close
            </button>
            <button
              className="btn btn-outline-success mt-1"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </Modal>
      }


      {/* Ma'lumitlarni o'chirish uchun */}

      {
        delate &&
        <Modal
          title="Testni o'chirish"
          close={setDelate}
          anima={delate}
          width="40%"
        >
          <div className="d-flex flex-column gap-3 mt-2">
            <p>Are you sure you want to delete?</p>
            <div className="d-flex justify-content-end gap-3">
              <button
                className="btn btn-outline-secondary mt-1"
                onClick={() => setDelate(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-outline-danger mt-1"
                onClick={delateExam}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      }


      {/* notification */}

      {notif.show && (
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      )}



      <BreadcrumbComponent currentPage="Exam schedule" />

      <Card>

        <DataTable
          title="All Exam Schedule"
          data={examData}
          columns={[
            "Test",
            "Vaqti",
            "Sana",
            "Amallar"
          ]}
          searchKeys={["class"]}
        >
          {(exams) =>
            exams.map(ex => (
              <tr key={ex.id}>
                <td>
                  <span className="fw-bold text-white">Class: {ex.class}</span>
                  <p className="mb-0">
                    Section: <span className="text-muted">{ex.section}</span>
                  </p>
                </td>
                <td>{ex.start_time + " - " + ex.end_time}</td>
                <td>{ex.date}</td>
                <td>
                  <div className="d-flex gap-1">
                    <a
                      class="btn btn-sm btn-outline-primary p-1 ms-2"
                      onClick={() => handleEdit(ex.id)}
                    >
                      <Icon icon="tabler:edit" width="20" height="20" />
                    </a>
                    <a
                      class="btn btn-sm btn-outline-danger p-1 ms-2"
                      onClick={() => setDelate(ex.id)}
                    >
                      <Icon icon="tabler:trash" width="20" height="20" />
                    </a>
                  </div>
                </td>
              </tr>
            ))
          }
        </DataTable>
      </Card>
    </>
  )
}

export default Schedule