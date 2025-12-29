import { Card } from "react-bootstrap"
import Pagination from '@mui/material/Pagination'
import BreadcrumbComponent from "../../components/Ui/BreadcrumbComponent"
import EntriesSelect from "../../components/Ui/EntriesSelect"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { Link } from "react-router-dom"
import teachersData from "../../data/Array.json"


const count = [10, 25, 50, 100]

const Teachers = () => {
  const [sliceTch, setsliceTch] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLast = currentPage * sliceTch
  const indexOfFirst = indexOfLast - sliceTch
  const [currentTeachers, setcurrentTeacher] = useState(teachersData.slice(indexOfFirst, indexOfLast))
  const totalPages = Math.ceil(teachersData.length / sliceTch)

  const handlePageChange = (page) => setCurrentPage(page)
  const handleEntriesChange = (value) => {
    setsliceTch(Number(value))
    setCurrentPage(1)
  }

  const search = (e) => {
    const query = e.target.value.toLowerCase()
    const filteredTeachers = teachersData.filter(teacher =>
      teacher.name.toLowerCase().includes(query) ||
      teacher.subject.toLowerCase().includes(query) ||
      teacher.email.toLowerCase().includes(query)
    )
    setCurrentPage(1)
    setcurrentTeacher(filteredTeachers)
  }

  return (
    <>
      <BreadcrumbComponent currentPage="All Teachers" />

      <Card>
        <Card.Body>
          <h5>All Teachers Data</h5>
          <EntriesSelect options={count} value={sliceTch} onChange={handleEntriesChange} />
          <div className="d-flex justify-content-end">
            <input
              type="search"
              className="form-control my-3 align-self-end w-25"
              placeholder="Search teachers..."
              onChange={(e) => search(e)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Profile</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Birthday</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">View</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.map(teacher => (
                  <tr key={teacher.id}>
                    <td className="d-flex ">
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="rounded-circle"
                        width="50"
                        height="50"
                      />
                      <div className="d-flex flex-column ms-2">
                        <span className="fw-bold text-white">
                          {teacher.name}
                        </span>
                        <p>
                          Class: <span className="text-muted">{teacher.class}</span>
                        </p>
                      </div>
                    </td>
                    <td>{teacher.subject}</td>
                    <td>{teacher.birthday}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phone}</td>
                    <td>
                      <Link to={`/teacher/${teacher.id}`}>
                        <Icon icon="mdi:eye-outline" className="fs-7 cursor-pointer text-hover-primary" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Showing {Math.min(indexOfFirst + 1, teachersData.length)} to {Math.min(indexOfLast, teachersData.length)} of {teachersData.length} entries</span>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <div>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, value) => handlePageChange(value)}
                  variant="outlined"
                  color="primary"
                  shape="rounded"
                  siblingCount={1}
                  boundaryCount={1}
                  size="small"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'rgba(255,255,255,0.85)',
                      backgroundColor: 'transparent',
                      border: 'none'
                    },
                    '& .MuiPaginationItem-root:hover': {
                      backgroundColor: 'rgba(255,255,255,0.06)'
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#0d6efd',
                      color: '#fff'
                    },
                    '& .MuiPaginationItem-ellipsis': {
                      color: 'rgba(255,255,255,0.6)'
                    },
                    '& .Mui-disabled': {
                      opacity: 0.65,
                      color: 'rgba(255,255,255,0.6)'
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default Teachers

