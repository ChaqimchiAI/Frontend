import { Form, Spinner } from "react-bootstrap";
import Modal from "../../../components/Ui/Modal";
import { Input } from "../../../components/Ui/Input";
import { useCreateGroupSchedule } from "../../../data/queries/group.queries";
import { useState } from "react";
import SelectDay from "../../../components/Ui/SelectDay";

const AddNewSchedule = ({
    addSchedule,
    setAddSchedule,
    teacherData,
    roomData,
    d,
    id,
    setNotif
}) => {


    const { mutate: createGroupSchedule, isPending: creatingSchedule } = useCreateGroupSchedule()

    const [newSchedlueItems, setNewSchedlueItems] = useState({
        days_of_week: [],
        begin_time: "",
        end_time: "",
        teacher: "",
        room: "",
        start_date: "",
        end_date: "",
        is_active: true
    })

    const handleAddNewSchedule = (e) => {
        e.preventDefault()

        if (
            !newSchedlueItems.begin_time ||
            !newSchedlueItems.end_time ||
            !newSchedlueItems.start_date ||
            !newSchedlueItems.days_of_week?.length ||
            !newSchedlueItems.room ||
            !newSchedlueItems.teacher
        ) {
            setNotif({ show: true, type: 'warn', message: "Barcha maydonlarni to'ldiring!" })
            return
        }
        if (!id || id === 'undefined') {
            setNotif({ show: true, type: 'error', message: "Guruh IDsi topilmadi. Sahifani yangilang." });
            return;
        }
        const dataToSend = {
            days_of_week: newSchedlueItems.days_of_week,
            begin_time: newSchedlueItems.begin_time,
            end_time: newSchedlueItems.end_time,
            teacher: newSchedlueItems.teacher,
            room: newSchedlueItems.room,
            start_date: newSchedlueItems.start_date,
            end_date: newSchedlueItems.end_date || null,
            is_active: newSchedlueItems.is_active
        }

        createGroupSchedule(
            { id, data: dataToSend },
            {
                onSuccess: () => {
                    setNotif({ show: true, type: 'success', message: "Jadval muvoffaqyatli qo'shildi" })
                    setAddSchedule(false)

                    setNewSchedlueItems({
                        days_of_week: [],
                        begin_time: "",
                        end_time: "",
                        teacher: "",
                        room: "",
                        start_date: "",
                        end_date: "",
                        is_active: true
                    })
                },
                onError: (err) => {
                    console.error(err)
                    setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                }
            }
        )
    }

    return (
        <Modal
            title="Yangi jadval qo'shish"
            close={setAddSchedule}
            anima={addSchedule}
            width="30%"
        >
            <Form className="d-flex flex-column gap-3" onSubmit={handleAddNewSchedule}>

                <div className="mt-3">
                    <label className="form-label">Dars kunlari</label>
                    <SelectDay 
                        data={addSchedule}
                        setData={setAddSchedule}
                        field="days_of_week"
                    />
                </div>

                <div className="d-flex align-items-center gap-2">
                    <Input
                        required
                        type="time"
                        label="Boshlanish vaqti"
                        containerClassName="w-50"
                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, begin_time: e.target.value })}
                    />
                    <span>
                        -
                    </span>
                    <Input
                        required
                        type="time"
                        label="Tugash vaqvi"
                        containerClassName="w-50"
                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, end_time: e.target.value })}
                    />
                </div>

                <div className="">
                    <label htmlFor="teacher" className="form-label">O'qituvchi</label>
                    <select
                        required
                        id="teacher"
                        className="form-select"
                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, teacher: Number(e.target.value) })}
                    >
                        <option hidden value="">
                            O'qituvchi
                        </option>
                        {teacherData?.map(t => (
                            <option value={t.id}>{t.first_name + " " + t.last_name}</option>
                        ))}
                    </select>
                </div>

                <div className="">
                    <label htmlFor="room" className="form-label">Xona</label>
                    <select
                        required
                        id="room"
                        className="form-select"
                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, room: Number(e.target.value) })}
                    >
                        <option hidden value="">
                            Xona
                        </option>
                        {roomData?.map(r => (
                            <option value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <Input
                        required
                        type="date"
                        label="Boshlanish sanasi"
                        containerClassName="w-50"
                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, start_date: e.target.value })}

                    />
                    <span>
                        -
                    </span>
                    <Input
                        type="date"
                        label="Tugash sanasi"
                        containerClassName="w-50"
                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, end_date: e.target.value })}
                    />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <span className="fs-4">
                        Joriy jadval
                    </span>

                    <Form.Check // prettier-ignore
                        type="switch"
                        id="custom-switch"
                        className="fs-5"
                        defaultChecked={newSchedlueItems.is_active}
                        onChange={(e) => setNewSchedlueItems({ ...newSchedlueItems, is_active: e.target.checked })}
                    />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                        type="button"
                        className="btn btn-sm py-2 px-4"
                        style={{ background: "#e5e5e5", color: "#000" }}
                        onClick={() => setAddSchedule(false)}
                    >
                        Orqaga
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm py-2 px-4"
                        style={{ background: "#0085db", color: "#fff" }}
                        onClick={handleAddNewSchedule}
                    >
                        {creatingSchedule ? <Spinner size="sm" animation="border" /> : "Saqlash"}
                    </button>
                </div>
            </Form>
        </Modal>
    )
}

export default AddNewSchedule