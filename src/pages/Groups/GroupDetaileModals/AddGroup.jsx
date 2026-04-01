import { Form, Spinner } from "react-bootstrap"
import Modal from "../../../components/Ui/Modal"
import { Input } from "../../../components/Ui/Input"
import { useCreateGroup } from "../../../data/queries/group.queries"
import { useState } from "react"
import { useCourses } from "../../../data/queries/courses.queries"

const AddGroup = ({ addGroup, setAddGroup, setNotif }) => {
    const { mutate: createGroup, isPending: createGroupLoading } = useCreateGroup()
    const { data: courses } = useCourses()
    
    // Xatolikni oldini olish uchun bo'sh massiv
    const courseData = courses?.results || []

    const [addNewGroup, setAddNewGroup] = useState({
        name: "",
        course: "",
        started_date: "",
        ended_date: "",
        status: "waiting", // Default ochilishi kutilmoqda
        description: "",
    })

    const handleAddNewGroup = (e) => {
        e.preventDefault()

        // To'g'ri tekshirish mantiqi
        if (!addNewGroup.name || !addNewGroup.course || !addNewGroup.started_date || !addNewGroup.status) {
            setNotif({ show: true, type: "warn", message: "Barcha majburiy maydonlarni to'ldiring!" })
            return
        }

        const payload = {
            name: addNewGroup.name,
            status: addNewGroup.status,
            course: Number(addNewGroup.course),
            branch: 1, // Default filial
            attendance_kpi: 0,
            exam_kpi: 0,
            homework_kpi: 0,
            students_count: 0,
            started_date: addNewGroup.started_date,
            ended_date: addNewGroup.ended_date || null,
            description: addNewGroup.description
        }

        createGroup(payload, {
            onSuccess: () => {
                setNotif({ show: true, type: "success", message: "Guruh muvaffaqiyatli qo‘shildi" })
                setAddGroup(false)
                setAddNewGroup({
                    name: "",
                    course: "",
                    started_date: "",
                    ended_date: "",
                    status: "waiting",
                    description: ""
                })
            },
            onError: (err) => {
                console.error(err)
                setNotif({ show: true, type: "error", message: "Guruh qo‘shishda xatolik yuz berdi!" })
            }
        })
    }

    return (
        <Modal
            title="Yangi guruh qo'shish"
            close={setAddGroup}
            anima={addGroup}
            width="35%"
            zIndex={100}
        >
            <Form className="mt-3" onSubmit={handleAddNewGroup}>
                <Form.Group className="mb-3">
                    <Input
                        label="Guruh nomi *"
                        required
                        value={addNewGroup.name}
                        placeholder="Masalan: Frontend N1"
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, name: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <label htmlFor="course" className="form-label small fw-medium">Kursni tanlang *</label>
                    <select
                        required
                        id="course"
                        className="form-select"
                        value={addNewGroup.course}
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, course: e.target.value })}
                    >
                        <option value="" hidden>Tanlang...</option>
                        {courseData.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </Form.Group>

                <div className="d-flex justify-content-between gap-3 mb-3">
                    <div className="w-50">
                        <Input
                            required
                            type="date"
                            label="Boshlanish sanasi *"
                            value={addNewGroup.started_date}
                            onChange={(e) => setAddNewGroup({ ...addNewGroup, started_date: e.target.value })}
                        />
                    </div>
                    <div className="w-50">
                        <Input
                            type="date"
                            label="Tugash sanasi"
                            value={addNewGroup.ended_date}
                            onChange={(e) => setAddNewGroup({ ...addNewGroup, ended_date: e.target.value })}
                        />
                    </div>
                </div>

                <Form.Group className="mb-3">
                    <label htmlFor="status" className="form-label small fw-medium">Guruh holati *</label>
                    <select
                        required
                        id="status"
                        className="form-select"
                        value={addNewGroup.status}
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, status: e.target.value })}
                    >
                        <option value="waiting">Ochilishi kutilmoqda</option>
                        <option value="active">Darslar davom etmoqda</option>
                        <option value="finished">Tugallangan</option>
                        <option value="paused">To‘xtatilgan</option>
                    </select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <label htmlFor="desc" className="form-label small fw-medium">Izoh</label>
                    <textarea
                        rows="3"
                        id="desc"
                        value={addNewGroup.description}
                        placeholder="Guruh haqida qo'shimcha ma'lumot..."
                        className="form-control"
                        style={{ resize: "none", fontSize: "14px" }}
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, description: e.target.value })}
                    ></textarea>
                </Form.Group>

                <div className="d-flex justify-content-end gap-2 mt-4 pb-2">
                    <button
                        type="button"
                        className="btn btn-light btn-sm py-2 px-4 border"
                        onClick={() => setAddGroup(false)}
                    >
                        Orqaga
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm py-2 px-4"
                        style={{ background: "#0085db", color: "#fff" }}
                        disabled={createGroupLoading}
                    >
                        {createGroupLoading ? <Spinner animation="border" size="sm" /> : "Guruhni saqlash"}
                    </button>
                </div>
            </Form>
        </Modal>
    )
}

export default AddGroup