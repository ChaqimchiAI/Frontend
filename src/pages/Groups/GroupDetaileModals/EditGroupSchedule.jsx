import { Button, Form, Spinner } from "react-bootstrap"
import Modal from "../../../components/Ui/Modal"
import { Input } from "../../../components/Ui/Input"
import { useDeleteGroupSchedule, useEditGroupSchedule } from "../../../data/queries/group.queries";
import { useState } from "react";
import SelectDay from "../../../components/Ui/SelectDay";

const EditGroupSchedule = ({
    changeActiveItem,
    setChangeActiveItem,
    currentSchedule,
    setCurrentSchedule,
    d,
    roomData,
    teacherData,
    id,
    setNotif
}) => {

    // dars jadvalini tahrirlash
    const { mutate: editGroupSchedule, isLoading: editingSchedule } = useEditGroupSchedule();

    // dars jadvalini o'chirish
    const { mutate: deleteGroupSchedule, isLoading: deletingSchedule } = useDeleteGroupSchedule();

    const [delate, setDelate] = useState(false);

    // kunni raqamlarga o'tkazish
    const normalizeDays = (days) => {
        if (!Array.isArray(days)) return [];

        // agar allaqachon raqam bo‘lsa
        if (typeof days[0] === "number") return days;

        // agar object bo‘lsa
        const map = {
            Du: 1,
            Se: 2,
            Cho: 3,
            Pay: 4,
            Ju: 5,
            Sha: 6,
            Ya: 7
        };

        return days.map(d => map[d.code]);
    };

    // jadvalni tahrirlash
    const updateSchedule = (e) => {
        e.preventDefault();

        if (
            !currentSchedule.begin_time ||
            !currentSchedule.end_time ||
            !currentSchedule.start_date ||
            !currentSchedule.days_of_week?.length ||
            !currentSchedule.room ||
            !currentSchedule.teacher
        ) {
            setNotif({ show: true, type: 'error', message: "Barcha maydonlarni to'ldiring!" })
            return;
        }

        if (!id) {
            setNotif({ show: true, type: "error", message: "Guruh IDsi topilmadi" });
            return;
        }
        const dataToSend = {
            days_of_week: normalizeDays(currentSchedule.days_of_week),
            begin_time: currentSchedule.begin_time,
            end_time: currentSchedule.end_time,
            teacher:
                typeof currentSchedule.teacher === "object"
                    ? currentSchedule.teacher.id
                    : currentSchedule.teacher,
            room:
                typeof currentSchedule.room === "object"
                    ? currentSchedule.room.id
                    : currentSchedule.room,
            start_date: currentSchedule.start_date,
            end_date: currentSchedule.end_date || null,
            is_active: currentSchedule.is_active
        };


        editGroupSchedule(
            { id, scheduleId: currentSchedule.id, data: dataToSend },
            {
                onSuccess: () => {
                    setChangeActiveItem(false)
                    setNotif({ show: true, type: 'success', message: "Jadval muvoffaqyatli tahrirlandi" })
                },
                onError: (err) => {
                    console.error(err);
                    setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                }
            }
        )
    };

    const deleteSchedule = () => {
        deleteGroupSchedule(
            { id, scheduleId: currentSchedule.id },
            {
                onSuccess: () => {
                    setDelate(false)
                    setChangeActiveItem(false)
                    setNotif({ show: true, type: 'success', message: "Jadval muvoffaqyatli o'chirildi" })
                },
                onError: (err) => {
                    console.error(err);
                    setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                }
            }
        )
    }

    return (
        <>

            {delate &&
                <Modal
                    title="Jadvalni o'chirish"
                    close={setDelate}
                    anima={delate}
                    width="30%"
                    zIndex={150}
                >
                    <p className="fs-3 mt-2">Jadvalni o'chirishga ishonchingiz komilmi?</p>
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            className="btn btn-sm py-2 px-4 fw-bold border"
                            onClick={() => setDelate(false)}
                        >
                            Yo'q
                        </button>
                        <button
                            className="btn btn-sm py-2 px-4 fw-bold"
                            style={{ backgroundColor: "#cd3232", color: "#fff" }}
                            onClick={deleteSchedule}
                        >
                            {deletingSchedule ? <Spinner animation="border" size="sm" /> : "Ha"}
                        </button>
                    </div>
                </Modal>
            }

            <Modal
                title="Jadvalni tahrirlash"
                close={setChangeActiveItem}
                anima={changeActiveItem}
                width="30%"
                zIndex={100}
            >
                <Form className="d-flex flex-column gap-3">

                    <div className="mt-3">
                        <SelectDay
                            data={currentSchedule}
                            setData={setCurrentSchedule}
                            field="days_of_week"
                        />
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Input
                            required
                            type="time"
                            label="Boshlanish vaqti"
                            containerClassName="w-50"
                            value={currentSchedule?.begin_time}
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, begin_time: e.target.value })}
                        />
                        <span>
                            -
                        </span>
                        <Input
                            type="time"
                            label="Tugash vaqvi"
                            containerClassName="w-50"
                            value={currentSchedule?.end_time}
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, end_time: e.target.value })}
                        />
                    </div>

                    <div className="">
                        <label htmlFor="teacher" className="form-label">O'qituvchi</label>
                        <select
                            required
                            id="teacher"
                            className="form-select"
                            value={currentSchedule?.teacher?.id}
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, teacher: Number(e.target.value) })}
                        >
                            <option hidden value="">
                                O'qituvchi
                            </option>

                            {teacherData?.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.first_name + " " + teacher.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="">
                        <label htmlFor="room" className="form-label">Xona</label>
                        <select
                            required
                            id="room"
                            className="form-select"
                            value={currentSchedule?.room?.id}
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, room: Number(e.target.value) })}
                        >
                            <option hidden value="">
                                Xona
                            </option>

                            {roomData?.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Input
                            type="date"
                            label="Boshlanish sanasi"
                            required
                            containerClassName="w-50"
                            value={currentSchedule?.start_date}
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, start_date: e.target.value })}
                        />
                        <span>
                            -
                        </span>
                        <Input
                            type="date"
                            label="Tugash sanasi"
                            containerClassName="w-50"
                            value={currentSchedule?.end_date}
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, end_date: e.target.value })}
                        />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-4">
                            Joriy jadval
                        </span>

                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            className="fs-5 cursor-pointer"
                            defaultChecked={!currentSchedule?.is_active}
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, is_active: e.target.checked })}
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button
                            className="btn btn-sm py-2 px-3 delete"
                            style={{ border: "2px solid #cd3232", background: "#cd323210", color: "#cd3232" }}
                            onClick={(e) => { e.preventDefault(); setDelate(true) }}
                        >
                            Jadvalni o'chirish
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm py-2 px-4"
                            style={{ background: "#e5e5e5", color: "#000" }}
                            onClick={() => setChangeActiveItem(false)}
                        >
                            Orqaga
                        </button>
                        <button
                            type="submit"
                            className="btn btn-sm py-2 px-4"
                            style={{ background: "#0085db", color: "#fff" }}
                            onClick={updateSchedule}
                        >
                            {editingSchedule ? <Spinner animation="border" size="sm" /> : "Saqlash"}
                        </button>
                    </div>
                </Form>
            </Modal>

            {/* Style */}
            <style>
                {`.delete {
                    transition: 0.3s;
                }

                .delete:hover {
                    background: #cd323220 !important;
                }`}
            </style>
        </>
    )
}

export default EditGroupSchedule