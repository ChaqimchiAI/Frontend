import { Card, Nav, Row, Tab } from "react-bootstrap"
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Icon } from "@iconify/react"
import Modal from "../../components/Ui/Modal"
import teachersData from "../../data/Array.json"
import Notification from "../../components/Ui/Notification"

const colorStyles = ["#4bd08b", "#fb977d", "#f6c85f", "#0085db"]

const TeacherDetaile = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [Teacher, setTeacher] = useState(null)
  const [EditModal, setEditModal] = useState(false)
  const [DelateModal, setDelateModal] = useState(false)
  const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })
  const [activeTab, setActiveTab] = useState('skills')
  useEffect(() => {
    const teacher = teachersData.find(t => t.id === parseInt(id))
    setTeacher(teacher)
  }, [id])

  const getGrade = (v) => {
    if (v >= 90) return { letter: 'A', color: '#3ad97a' }
    if (v >= 75) return { letter: 'B', color: '#f6c85f' }
    if (v >= 50) return { letter: 'C', color: '#ff8a72' }
    return { letter: 'E', color: '#2fb3ff' }
  }

  const delateTeacher = (teacherId) => {
    const delateData = teachersData.findIndex(t => t.id === teacherId)
    teachersData.splice(delateData, 1)
    console.log(teachersData);
    setNotif({ show: true, type: 'deleted', message: 'Teacher deleted' })
    setTimeout(() => navigate("/teachers"), 700)
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
            title="Edit Teacher"
            close={setEditModal}
            anima={EditModal}
          >
            <div className="d-flex flex-column gap-3 mt-2">
              <div className="d-flex flex-column gap-1">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" className="form-control" defaultValue={Teacher?.name} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" className="form-control" defaultValue={Teacher?.email} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="phone">Phone</label>
                <input type="text" id="phone" className="form-control" defaultValue={Teacher?.phone} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="birthday">Birthday</label>
                <input type="date" id="birthday" className="form-control" defaultValue={Teacher?.birthday} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" className="form-control" defaultValue={Teacher?.subject} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="class">Class</label>
                <input type="text" id="class" className="form-control" defaultValue={Teacher?.class} />
              </div>
              <div className="d-flex justify-content-end gap-3">
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
            </div>
          </Modal>
        )
      }

      {
        DelateModal && (
          <Modal
            title="Delete Teacher"
            close={setDelateModal}
            anima={DelateModal}
          >
            <div className="d-flex flex-column gap-3 mt-2">
              <p>Are you sure you want to delete {Teacher?.name}?</p>
              <div className="d-flex justify-content-end gap-3">
                <button
                  className="btn btn-outline-secondary mt-1"
                  onClick={() => setDelateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-outline-danger mt-1"
                  onClick={() => delateTeacher(Teacher.id)}
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
      
      <BreadcrumbComponent currentPage="Teacher Detail" />

      <div className="d-flex flex-column flex-md-row gap-5">
        <Card className="w-30">
          <Card.Body>
            <div className="d-flex flex-column justify-content-center align-items-center text-center gap-3">
              <img
                src={Teacher?.image}
                alt={Teacher?.name}
                className="rounded-24 "
                width={110}
                height={110}
              />
              <h5>
                {Teacher?.name}<br />
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
                  {Teacher?.role}
                </small>
              </h5>
            </div>

            <div className="d-flex flex-column gap-3">
              <h6 className="border-bottom py-2">
                Details
              </h6>
              <ul className="">
                {
                  Teacher && Object.entries(Teacher).map(([key, value]) => {
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
                  eventKey="skills"
                  style={activeTab === 'skills' ? { background: '#0085db', color: '#fff', borderRadius: 24, padding: '8px 14px' } : { color: '#9fb0c0', background: 'transparent' }}
                >
                  O'qituvchilik mahorati
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="salary"
                  style={activeTab === 'salary' ? { background: '#0085db', color: '#fff', borderRadius: 24, padding: '8px 14px' } : { color: '#9fb0c0', background: 'transparent' }}
                >
                  Salary
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="w-100">

              <Tab.Pane eventKey="skills">
                <Row>
                  <Card >
                    <Card.Body>
                      <h5>Skills</h5>
                      {Teacher && Object.entries(Teacher.skils).map(([skill, value], index) => {
                        const { letter, color } = getGrade(value)
                        return (
                          <div key={skill} className="d-flex align-items-center justify-content-between mb-3">
                            <div style={{ flex: 1 }}>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <h6 className="text-capitalize mb-0">{skill}</h6>
                                <span style={{ color: color, fontWeight: 700 }}>{letter}</span>
                              </div>

                              <div className="d-flex align-items-center gap-3">
                                <small className="text-muted">{value}%</small>
                                <div className="progress flex-fill" style={{ height: '12px', background: '#0c2733', borderRadius: '10px' }}>
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${value}%`, background: colorStyles[index], borderRadius: '10px' }}
                                    aria-valuenow={value}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </Card.Body>
                  </Card>
                </Row>
              </Tab.Pane>


              <Tab.Pane eventKey="salary">
                <Row>
                  <Card className="w-60">
                    <Card.Body>
                      <h5>Salary Information</h5>
                      <p>Salary details will be displayed here.</p>
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

export default TeacherDetaile