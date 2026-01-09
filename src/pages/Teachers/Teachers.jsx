import { Card } from "react-bootstrap"
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import { Icon } from "@iconify/react"
import { Link } from "react-router-dom"
import teachersData from "../../data/Teachers.json"
import DataTable from "../../components/Ui/DataTable"
import Modal from "../../components/Ui/Modal"
import { useState } from "react"

const Teachers = () => {
  const [addModal, setAddModal] = useState(false)

  const handleAdd = () => {
    setAddModal(true)
  }

  return (
    <>
      { addModal && 
        <Modal
          title="Yangi ustoz qo'shish"
          close={setAddModal}
          anima={addModal}
          width="50%"
        >
          
        </Modal>
      }


      <BreadcrumbComponent currentPage="All Teachers" />

      <Card>
        <DataTable
          title="All Teachers Data"
          data={teachersData}
          columns={[
            "Profile",
            "Subject",
            "Birthday",
            "Email",
            "Phone",
            "View"
          ]}
          searchKeys={["name", "email", "subject", "phone"]}
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
          {(currentTeachers) =>
            currentTeachers.map(teacher => (
              <tr key={teacher.id}>
                <td className="d-flex">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="rounded-circle"
                    width="50"
                    height="50"
                  />
                  <div className="ms-2">
                    <span className="fw-bold text-white">{teacher.name}</span>
                    <p className="mb-0">
                      Class: <span className="text-muted">{teacher.class}</span>
                    </p>
                  </div>
                </td>
                <td>{teacher.subject}</td>
                <td>{teacher.birthday}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone}</td>
                <td>
                  <Link
                    to={`/teacher/${teacher.id}`}
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

export default Teachers

