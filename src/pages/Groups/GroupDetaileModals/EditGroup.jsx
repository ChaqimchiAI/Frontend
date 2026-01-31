import Modal from "../../../components/Ui/Modal"
import { Input } from "../../../components/Ui/Input"
import { Form, Spinner } from "react-bootstrap"

const EditGroup = ({
    changeGroup,
    setChangeGroup,
    changeGroupDate,
    setChangeGroupDate,
    saveGroupChanges,
    courseData,
    editing
}) => {
    return (
        <Modal
            title="Guruh ma'lumotlarini tahrirlash"
            close={setChangeGroup}
            anima={changeGroup}
            width="30%"
            zIndex={100}
        >
            <Form className="mt-3" onSubmit={saveGroupChanges}>
                <Form.Group className="mb-3">
                    <Input
                        label="Guruh nomi"
                        required
                        placeholder="Guruh nomi..."
                        value={changeGroupDate?.name}
                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, name: e.target.value })}

                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <label htmlFor="course" className="form-label">Kurs</label>
                    <select
                        required
                        id="course"
                        className="form-select"
                        value={changeGroupDate?.course}
                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, course: e.target.value })}
                    >
                        <option value="" hidden>Kurs tanlash</option>
                        {courseData.map(c =>
                            <option key={c.id} value={c.id}>{c.name}</option>
                        )}
                    </select>
                </Form.Group>
                <div className="d-flex justify-content-between gap-3">
                    <Input
                        required
                        type="date"
                        label="Boshlanish sanasi"
                        containerClassName="w-50"
                        value={changeGroupDate?.started_date}
                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, started_date: e.target.value })}
                    />
                    <Input
                        type="date"
                        label="Tugash sanasi"
                        containerClassName="w-50"
                        value={changeGroupDate?.ended_date}
                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, ended_date: e.target.value })}

                    />
                </div>
                <Form.Group className="mb-3">
                    <label htmlFor="status" className="form-label">Holati</label>
                    <select
                        required
                        id="status"
                        className="form-select"
                        value={changeGroupDate?.status}
                        onChange={(e) => setChangeGroupDate({ ...changeGroupDate, status: e.target.value })}
                    >
                        <option value="active">Faol</option>
                        <option value="finished">Tugagan</option>
                        <option value="waiting">Kutilmoqda</option>
                        <option value="paused">To'xtatilgan</option>
                    </select>
                </Form.Group>


                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                        type="button"
                        className="btn btn-sm py-2 px-4"
                        style={{ background: "#e5e5e5", color: "#000" }}
                        onClick={() => setChangeGroup(false)}
                    >
                        Orqaga
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm py-2 px-4"
                        style={{ background: "#0085db", color: "#fff" }}
                        onClick={saveGroupChanges}
                    >
                        {editing ? <Spinner animation="border" variant="primary" /> : "Saqlash"}
                    </button>
                </div>
            </Form>
        </Modal>
    )
}

export default EditGroup