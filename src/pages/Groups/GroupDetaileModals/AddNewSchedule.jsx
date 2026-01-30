import { Form, Spinner } from "react-bootstrap";
import Modal from "../../../components/Ui/Modal";
import { Input } from "../../../components/Ui/Input";
import { useCreateGroupSchedule } from "../../../data/queries/group.queries";
import { useState } from "react";

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

    const [special, setSpecial] = useState(false)

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

        try {
            createGroupSchedule({ id, data: dataToSend })

            setNotif({ show: true, type: 'success', message: "Jadval muvoffaqyatli qo'shildi" })

            setAddSchedule(!creatingSchedule ? true : false)

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
        }
        catch (err) {
            console.error(err);
            setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
        }
    }

    const formatDays = (value) => {
        if (value === "toqK") {
            setNewSchedlueItems({
                ...newSchedlueItems,
                days_of_week: [1, 3, 5],
            });
            setSpecial(false);
        }

        if (value === "juftK") {
            setNewSchedlueItems({
                ...newSchedlueItems,
                days_of_week: [2, 4, 6],
            });
            setSpecial(false);
        }

        if (value === "maxsusK") {
            setCurrentSchedule({
                ...currentSchedule,
                days_of_week: [],
            });
            setSpecial(true);
        }
    };

    // yangi jadval un checkbox dan kun tanlash
    const otherDays = ({ i, checked }) => {
        setNewSchedlueItems(prev => {
            const filteredDays = (prev.days_of_week || []).filter(id => id !== i);

            return {
                ...prev,
                days_of_week: checked ? [...filteredDays, i] : filteredDays
            };
        });
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
                    {!special ? (
                        <select
                            className="form-select"
                            onChange={(e) => formatDays(e.target.value)}
                        >
                            <option hidden value="">Kun tanlash</option>
                            <option value="toqK">Toq kunlar (Du, Cho, Ju)</option>
                            <option value="juftK">Juft kunlar (Se, Pay, Sha)</option>
                            <option value="maxsusK">Maxsus</option>
                        </select>
                    ) : (
                        <div className="d-flex flex-column align-items-start ms-3">
                            <div className="d-flex flex-wrap">
                                {d.map((day, i) => (
                                    <div className="d-flex align-items-center gap-1">
                                        <label className="form-label" htmlFor={i}>{day}</label>
                                        <input
                                            id={i}
                                            type="checkbox"
                                            className="form-check"
                                            onChange={(e) => otherDays({ i: i + 1, checked: e.target.checked })}
                                        />
                                        &nbsp;
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary mt-2"
                                onClick={() => {
                                    setSpecial(false);
                                    setNewSchedlueItems({ ...newSchedlueItems, days_of_week: [] })
                                }}
                            >
                                Ortga
                            </button>
                        </div>
                    )}
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