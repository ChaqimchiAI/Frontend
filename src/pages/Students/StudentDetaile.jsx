import { Card, Nav, Row, Tab } from "react-bootstrap"
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Icon } from "@iconify/react"
import Modal from "../../components/Ui/Modal"
import studentsData from "../../data/Students.json"
import Notification from "../../components/Ui/Notification"

const colorStyles = ["#4bd08b", "#fb977d", "#f6c85f", "#0085db"]

const StudentDetaile = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [Student, setStudent] = useState(null)
  const [EditModal, setEditModal] = useState(false)
  const [DelateModal, setDelateModal] = useState(false)
  const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })
  const [activeTab, setActiveTab] = useState('reports')
  useEffect(() => {
    const student = studentsData.find(t => t.id === parseInt(id))
    setStudent(student)
  }, [id])

  const getGrade = (v) => {
    if (v >= 90) return { letter: 'A', color: '#3ad97a', remarks: v > 50 ? "Pass" : "Fail" }
    if (v >= 75) return { letter: 'B', color: '#f6c85f', remarks: v > 50 ? "Pass" : "Fail" }
    if (v >= 50) return { letter: 'C', color: '#ff8a72', remarks: v > 50 ? "Pass" : "Fail" }
    return { letter: 'E', color: '#2fb3ff', remarks: v > 50 ? "Pass" : "Fail" }
  }

  const codeForSkill = (skill, idx) => {
    const map = { learning: 'M', communication: 'S', creativity: 'E', attendance: 'B' }
    const prefix = map[skill] || 'SK'
    return `${prefix}${100 + idx}`
  }

  const delateTeacher = (teacherId) => {
    const delateData = studentsData.findIndex(t => t.id === teacherId)
    studentsData.splice(delateData, 1)
    navigate("/students", { state: { notif: { show: true, type: 'deleted', message: 'Student deleted' } } })
  }

  const handleSaveChanges = () => {
    setEditModal(false)
    setNotif({ show: true, type: 'edited', message: 'Teacher details saved' })
  }

  return (
    <>

      {
        EditModal && (
          <Modal
            title="Edit Student"
            close={setEditModal}
            anima={EditModal}
            width="60%"
          >
            <div className="d-flex justify-content-between gap-3 mt-2">
              <div className="d-flex flex-column w-50 gap-3">
                <span className="fw-bold align-self-end text-white-50">
                  Shaxsiy
                </span>
                <div className="d-flex flex-column gap-1">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" className="form-control" defaultValue={Student?.name} />
                </div>
                <div className="d-flex flex-column gap-1">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" className="form-control" defaultValue={Student?.email} />
                </div>
                <div className="d-flex flex-column gap-1">
                  <label htmlFor="phone">Phone</label>
                  <input type="text" id="phone" className="form-control" defaultValue={Student?.phone} />
                </div>
              </div>
              <div
                style={{width: "1px", height: "auto", background: "#2b364cff"}}
              >

              </div>
              <div className="d-flex flex-column w-50 gap-3">
                <span className="fw-bold align-self-end text-white-50">
                  Boshqa
                </span>
                <div className="d-flex flex-column gap-1">
                  <label htmlFor="subject">Parents</label>
                  <input type="text" id="subject" className="form-control" defaultValue={Student?.parent} />
                </div>
                <div className="d-flex flex-column gap-1">
                  <label htmlFor="birthday">Birthday</label>
                  <input type="date" id="birthday" className="form-control" defaultValue={Student?.birthday} />
                </div>
                <div className="d-flex flex-column gap-1">
                  <label htmlFor="class">Class</label>
                  <input type="text" id="class" className="form-control" defaultValue={Student?.class} />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-3 mt-3">
              <button
                className="btn btn-outline-danger mt-1"
                onClick={() => setEditModal(false)}
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
        )
      }


      {/* Ma'lumotni o'chirish uchun */}
      {
        DelateModal && (
          <Modal
            title="Delete Student"
            close={setDelateModal}
            anima={DelateModal}
          >
            <div className="d-flex flex-column gap-3 mt-2">
              <p>Are you sure you want to delete {Student?.name}?</p>
              <div className="d-flex justify-content-end gap-3">
                <button
                  className="btn btn-outline-secondary mt-1"
                  onClick={() => setDelateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-outline-danger mt-1"
                  onClick={() => delateTeacher(Student.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )
      }


      {notif.show && (
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      )}

      <BreadcrumbComponent currentPage="Student Detail" />

      <div className="d-flex flex-column flex-md-row gap-5">
        <Card className="w-30">
          <Card.Body>
            <div className="d-flex flex-column justify-content-center align-items-center text-center gap-3">
              <img
                src={Student?.image}
                alt={Student?.name}
                className="rounded-24 "
                width={110}
                height={110}
              />
              <h5>
                {Student?.name}<br />
                <small
                  className="fw-normal"
                  style={{
                    borderRadius: '20px',
                    padding: "5px 8px",
                    background: "#0f273e",
                    color: "#338bf0ff",
                    fontSize: "13px"
                  }}
                >
                  {Student?.role}
                </small>
              </h5>
            </div>

            <div className="d-flex flex-column gap-3">
              <h6 className="border-bottom py-2">
                Details
              </h6>
              <ul className="">
                {
                  Student && Object.entries(Student).map(([key, value]) => {
                    if (key === 'role' || key === 'image' || key === 'skils') {
                      return null
                    }
                    return (
                      <li key={key} className="d-flex justify-content-start gap-2 mb-4">
                        <span className="text-capitalize">{key.replace('_', ' ')}:</span>
                        <span>{value}</span>
                      </li>
                    )
                  })
                }
              </ul>
            </div>

            <div className="d-flex justify-content-between">
              <button
                className="btn w-45 text-white"
                style={{ background: "#0085db" }}
                onClick={() => setEditModal(true)}
              >
                <Icon icon="tabler:edit" width="24" height="24" />
                Tahrirlash
              </button>
              <button
                className="btn w-45 text-white"
                style={{ background: "#fb977d" }}
                onClick={() => setDelateModal(true)}
              >
                <Icon icon="tabler:trash" width="24" height="24" />
                O'chirish
              </button>
            </div>
          </Card.Body>
        </Card>

        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <div className="d-flex flex-column gap-4" style={{ width: "65.5%" }}>

            <Nav variant="pills" className="mb-3 d-flex" style={{ gap: 12 }}>
              <Nav.Item>
                <Nav.Link
                  eventKey="reports"
                  style={activeTab === 'reports' ? { background: '#0085db', color: '#fff', borderRadius: 24, padding: '8px 14px' } : { color: '#9fb0c0', background: 'transparent' }}
                >
                  Qobilyatlari
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="Fees"
                  style={activeTab === 'Fees' ? { background: '#0085db', color: '#fff', borderRadius: 24, padding: '8px 14px' } : { color: '#9fb0c0', background: 'transparent' }}
                >
                  Fees
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="w-100">

              <Tab.Pane eventKey="reports">
                <Row>
                  <Card >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Qobilyatlari</h5>
                        <small className="text-muted">Section: {Student?.section}</small>
                      </div>

                      <div className="table-responsive">
                        <table className="table table-borderless mb-0">
                          <thead>
                            <tr className="text-muted small">
                              <th>Code</th>
                              <th>Subject Name</th>
                              <th>Marks</th>
                              <th>Grade</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Student && Object.entries(Student.skils).map(([skill, value], index) => {
                              const { letter, color, remarks } = getGrade(value)
                              const code = codeForSkill(skill, index)
                              return (
                                <tr key={skill} className="align-middle">
                                  <td className="fw-normal">{code}</td>
                                  <td className="text-capitalize">{skill.replace('_', ' ')}</td>
                                  <td style={{ width: '40%' }}>
                                    <div className="d-flex align-items-center gap-3">
                                      <small className="text-muted">{value}%</small>
                                      <div className="progress flex-fill" style={{ height: '10px', background: '#0c2733', borderRadius: '10px' }}>
                                        <div
                                          className="progress-bar"
                                          role="progressbar"
                                          style={{ width: `${value}%`, background: colorStyles[index % colorStyles.length], borderRadius: '10px' }}
                                          aria-valuenow={value}
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ color: color, fontWeight: 700 }}>{letter}</td>
                                  <td>
                                    <span style={{ color: remarks === 'Pass' ? '#3ad97a' : '#ff6b6b', fontWeight: 700 }}>
                                      {remarks}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Row>
              </Tab.Pane>


              <Tab.Pane eventKey="Fees">
                <Row>
                  <Card className="w-60">
                    <Card.Body>
                      <h5>Fees Information</h5>
                      <p>Fees details will be displayed here.</p>
                    </Card.Body>
                  </Card>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>

    </>
  )
}

export default StudentDetaile