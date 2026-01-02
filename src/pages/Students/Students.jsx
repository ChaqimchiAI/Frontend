import { Card } from "react-bootstrap"
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import { Icon } from "@iconify/react"
import { Link } from "react-router-dom"
import studentsData from "../../data/Students.json"
import DataTable from "../../components/Ui/DataTable"


const Students = () => {
  return (
    <>
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