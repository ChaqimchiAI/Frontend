import { useParams } from "react-router-dom"
import { useStudent } from "../../data/queries/students.queries"

const StudentDetaile = () => {
  const { id } = useParams()

  const { data: student, isLoading, error } = useStudent(id)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1 className="text-center mt-5 fw-bold text-muted">{student.last_name} {student.first_name}ning malumotlari yuklandi</h1>
    </div>
  )
}

export default StudentDetaile
