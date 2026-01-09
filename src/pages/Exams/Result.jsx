import { Card } from "react-bootstrap"
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import DataTable from "../../components/Ui/DataTable"
import studentsData from "../../data/Students.json"
import { Icon } from "@iconify/react"
import { Link } from "react-router-dom"

const Result = () => {
  return (
    <>
      <BreadcrumbComponent currentPage="Exam result" />

      <Card>
        <DataTable
          title="Exam Results"
          data={studentsData}
          columns={[
            "Examination Name",
            "Grade",
            "Internal Marks",
            "External Marks",
            "Total",
            "Remarks",
            "View"
          ]}
          searchKeys={["name", "internal_marks", "external_marks", "total", "remarks"]}
        >
          {(currentExams) =>
            currentExams.map(ex => (
              <tr key={ex.id}>
                <td className="d-flex">
                  <img
                    src={ex.image}
                    alt={ex.name}
                    className="rounded-circle"
                    width={50}
                    height={50}
                  />
                  <div className="ms-2">
                    <span className="fw-bold text-white">{ex.name}</span>
                    <p className="mb-0">
                      Class: <span className="text-muted">{ex.class}</span>
                    </p>
                  </div>
                </td>
                <td>
                  {ex?.exam_result?.grade}
                </td>
                <td>
                  {ex?.exam_result?.internal_marks}
                </td>
                <td>
                  {ex?.exam_result?.external_marks}
                </td>
                <td>
                  {ex?.exam_result?.total}
                </td>
                <td>
                  <span
                    className={ex?.exam_result?.total >= 50 ? "text-success" : "text-danger"}
                  >
                    {ex?.exam_result?.total >= 50 ? "Pass" : "Fail"}
                  </span>
                </td>
                <td>
                  <Link>
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

export default Result