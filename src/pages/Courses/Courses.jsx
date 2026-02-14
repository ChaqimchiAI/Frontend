import { useState } from "react";
import { Spinner, Card, Row, Col, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useCourses, useDeleteCourses } from "../../data/queries/courses.queries";
import { useTheme } from "../../Context/Context";
import DataTable from "../../components/Ui/DataTable";
import Notification from "../../components/Ui/Notification";
import CourseModal from "./modals/CourseModal";
import Modal from "../../components/Ui/Modal";

const Courses = () => {
  const { theme } = useTheme();
  const isDark = !theme;

  const { data: courses, isLoading: gettingCoursesData } = useCourses();
  const coursesData = Array.isArray(courses) ? courses : courses?.results || [];

  const { mutate: deleteCourse } = useDeleteCourses();

  const [newCourse, setNewCourse] = useState(false);
  const [editCourse, setEditCourse] = useState(false);
  const [editCourseData, setEditCourseData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [notif, setNotif] = useState({ show: false, type: "", message: "" });

  if (gettingCoursesData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const handleDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete, {
        onSuccess: () => {
          setNotif({ show: true, type: "success", message: "Kurs muvaffaqiyatli o'chirildi!" });
          setDeleteModal(false);
          setCourseToDelete(null);
        },
        onError: () => {
          setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
          setDeleteModal(false);
        }
      });
    }
  };

  const openDeleteModal = (id) => {
    setCourseToDelete(id);
    setDeleteModal(true);
  };

  const listColumns = ["Kurs nomi", "Narxi (UZS)", "Tavsif", "Amallar"];

  return (
    <>
      {notif.show && <Notification type={notif.type} message={notif.message} onClose={() => setNotif({ ...notif, show: false })} />}

      {newCourse && <CourseModal show={newCourse} setShow={setNewCourse} setNotif={setNotif} />}

      {editCourse && <CourseModal setNotif={setNotif} setShow={setEditCourse} show={editCourse} editData={editCourseData} />}

      {deleteModal && (
        <Modal
          title="O'chirishni tasdiqlang"
          close={() => setDeleteModal(false)}
          anima={deleteModal}
          width="30%"
          zIndex={1060}
        >
          <p className="text-muted mt-2">Haqiqatan ham bu kursni o'chirib tashlamoqchimisiz?</p>
          <div className="d-flex justify-content-end gap-2 mt-1">
            <button
              className="btn btn-sm cencel-button"
              onClick={() => setDeleteModal(false)}
            >
              Orqaga
            </button>
            <button
              className="btn btn-sm delete-button"
              onClick={handleDelete}
            >
              Ha
            </button>
          </div>
        </Modal>
      )}

      <div className="card card-body" style={{ minHeight: "100vh" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Kurslar</h2>
            <p className="text-muted small mt-1">O'quv markazidagi barcha kurslar ro'yxati</p>
          </div>
          <button
            className="btn btn-sm px-4 py-2 text-white d-flex align-items-center gap-2"
            style={{ background: "#0085db", borderRadius: "8px" }}
            onClick={() => setNewCourse(true)}
          >
            <Icon icon="lucide:plus" className="fs-5" />
            Yangi kurs qo'shish
          </button>
        </div>

        <DataTable
          data={coursesData}
          columns={listColumns}
          searchKeys={["name", "description"]}
          onSearch={(v) => console.log("Search:", v)} // DataTable handles local search if totalCount is missing
        >
          {(currentData) =>
            currentData.map((course) => (
              <tr key={course.id} style={{ color: isDark ? "#e2e8f0" : "#000" }}>
                <td className="ps-4">
                  <div className="d-flex align-items-center gap-2">
                    <Icon icon="ph:book-duotone" className="text-primary fs-5" />
                    <span className="fw-semibold">{course.name}</span>
                  </div>
                </td>
                <td>{Number(course.price).toLocaleString()} UZS</td>
                <td className="text-muted small" style={{ maxWidth: "300px" }}>
                  <div className="text-truncate">{course.description || "-"}</div>
                </td>
                <td className="pe-4">
                  <div className="d-flex gap-2">
                    <button
                      className="rounded-3 border p-1"
                      title="Tahrirlash"
                      style={{ background: isDark ? "#15263a" : "#f5f5f5" }}
                      onClick={() => {
                        setEditCourse(true);
                        setEditCourseData(course);
                      }}
                    >
                      <Icon icon="lucide:edit" color="#fca130" />
                    </button>
                    <button
                      className="rounded-3 border p-1"
                      title="O'chirish"
                      style={{ background: isDark ? "#15263a" : "#f5f5f5" }}
                      onClick={() => openDeleteModal(course.id)}
                    >
                      <Icon icon="lucide:trash-2" color="#ef4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          }
        </DataTable>
      </div>

      <style>
        {`
        .glass-card {
          background: ${isDark ? "rgba(30, 41, 59, 0.7)" : "#ffffff"};
          backdrop-filter: blur(12px);
          border: 1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
          border-radius: 16px;
        }
        `}
      </style>
    </>
  );
};

export default Courses;