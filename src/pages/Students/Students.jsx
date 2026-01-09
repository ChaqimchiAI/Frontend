import { Card } from "react-bootstrap"
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import { Icon } from "@iconify/react"
import { Link } from "react-router-dom"
import studentsData from "../../data/Students.json"
import DataTable from "../../components/Ui/DataTable"
import { useState } from "react"
import Modal from "../../components/Ui/Modal"

const Students = () => {
  const [addModal, setAddModal] = useState(false)

  const handleAdd = () => {
    setAddModal(true)
  }

  return (
    <>

      {/* yangi student qoshish uchun modal */}

      {addModal &&
        <Modal
          title="Yangi o'quvchi qo'shish"
          close={setAddModal}
          anima={addModal}
          width="50%"
        >
          
        </Modal>
      }


      <BreadcrumbComponent currentPage="All Students" />

      <Card>
        <DataTable
          title="All Student Data"
          data={studentsData}
          columns={[
            "Profile",
            "Parents",
            "Birthday",
            "Phone",
            "Email",
            "View"
          ]}
          searchKeys={["name", "parent", "phone", "email"]}
          button={
            <button
              className="btn btn-sm fs-3 text-white py-2"
              style={{ background: "#0085DB" }}
              onClick={handleAdd}
            >
              <span>
                <Icon icon="mdi:plus" className="me-2" fontSize={20} />
              </span>
              Yangi qo'shish
            </button>
          }
        >
          {(currentStudent) =>
            currentStudent.map(student => (
              <tr key={student.id}>
                <td className="d-flex">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="rounded-circle"
                    width={50}
                    height={50}
                  />
                  <div className="ms-2">
                    <span className="fw-bold text-white">{student.name}</span>
                    <p className="mb-0">
                      Class: <span className="text-muted">{student.class}</span>
                    </p>
                  </div>
                </td>
                <td>
                  {student.parent}
                </td>
                <td>
                  {student.birthday}
                </td>
                <td>{student.phone}</td>
                <td>{student.email}</td>
                <td>
                  <Link
                    to={`/student/${student.id}`}
                    title="view"
                  >
                    <Icon icon="mdi:eye-outline" fontSize={25} />
                  </Link>
                </td>
              </tr>
            ))
          }
        </DataTable>
      </Card>
    </>
  )
}

export default Students