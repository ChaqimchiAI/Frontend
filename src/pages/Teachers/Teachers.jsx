import { Card } from "react-bootstrap"
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import { Icon } from "@iconify/react"
import { Link } from "react-router-dom"
import teachersData from "../../data/Teachers.json"
import DataTable from "../../components/Ui/DataTable"

const Teachers = () => {

  return (
    <>
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

