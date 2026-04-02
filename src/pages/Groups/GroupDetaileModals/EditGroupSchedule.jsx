import { useEffect, useState } from "react"; 
import { Button, Form, Spinner } from "react-bootstrap"
import Modal from "../../../components/Ui/Modal"
import { Input } from "../../../components/Ui/Input"
import { useDeleteGroupSchedule, useEditGroupSchedule } from "../../../data/queries/group.queries";
import SelectDay from "../../../components/Ui/SelectDay";

const EditGroupSchedule = ({
    changeActiveItem,
    setChangeActiveItem,
    currentSchedule,
    setCurrentSchedule,
    schedule_items, 
    roomData,
    teacherData,
    id,
    setNotif
}) => {
    // isLoading o'rniga isPending (React Query 5+)
    const { mutate: editGroupSchedule, isPending: editingSchedule } = useEditGroupSchedule();
    const { mutate: deleteGroupSchedule, isPending: deletingSchedule } = useDeleteGroupSchedule();
    const [delate, setDelate] = useState(false);

    // --- MANA SHU JOYI KUNLARNI "YONDIRIB" BERADI ---
    useEffect(() => {
        if (changeActiveItem && schedule_items?.active) {
            const item = schedule_items.active.find(s => s.id == changeActiveItem);
            if (item) {
                setCurrentSchedule({
                    ...item,
                    // Lid tahrirlashdagi kabi kunlarni ID-ga o'tkazamiz
                    days_of_week: item.days_of_week?.map(d => (typeof d === 'object' ? d.id : d)) || [],
                    // Selectlar Selected turishi uchun ID-ga o'tkazamiz
                    teacher: typeof item.teacher === 'object' ? item.teacher.id : item.teacher,
                    room: typeof item.room === 'object' ? item.room.id : item.room,
                });
            }
        }
    }, [changeActiveItem, schedule_items, setCurrentSchedule]);

    const normalizeDays = (days) => {
        if (!Array.isArray(days)) return [];
        return days.map(day => (typeof day === "object" ? day.id : day));
    };

    const updateSchedule = (e) => {
        e.preventDefault();
        
        if (!currentSchedule?.begin_time || !currentSchedule?.end_time || !currentSchedule?.days_of_week?.length || !currentSchedule?.room || !currentSchedule?.teacher) {
            setNotif({ show: true, type: 'warn', message: "Barcha maydonlarni to'ldiring!" })
            return;
        }

        const dataToSend = {
            days_of_week: normalizeDays(currentSchedule.days_of_week),
            begin_time: currentSchedule.begin_time,
            end_time: currentSchedule.end_time,
            teacher: typeof currentSchedule.teacher === "object" ? currentSchedule.teacher.id : currentSchedule.teacher,
            room: typeof currentSchedule.room === "object" ? currentSchedule.room.id : currentSchedule.room,
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
                onError: () => setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
            }
        )
    };

    const deleteSchedule = () => {
        deleteGroupSchedule({ id, scheduleId: currentSchedule.id }, {
            onSuccess: () => {
                setDelate(false); setChangeActiveItem(false);
                setNotif({ show: true, type: 'success', message: "Jadval muvoffaqyatli o'chirildi" })
            }
        })
    }

    return (
        <>
            {delate && (
                <Modal title="Jadvalni o'chirish" close={setDelate} anima={delate} width="30%" zIndex={150}>
                    <p className="fs-3 mt-2">Jadvalni o'chirishga ishonchingiz komilmi?</p>
                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-sm py-2 px-4 fw-bold border" onClick={() => setDelate(false)}>Yo'q</button>
                        <button type="button" className="btn btn-sm py-2 px-4 fw-bold text-white" style={{ backgroundColor: "#cd3232" }} onClick={deleteSchedule}>
                            {deletingSchedule ? <Spinner animation="border" size="sm" /> : "Ha"}
                        </button>
                    </div>
                </Modal>
            )}

            <Modal title="Jadvalni tahrirlash" close={setChangeActiveItem} anima={changeActiveItem} width="30%" zIndex={100}>
                <Form className="d-flex flex-column gap-3" onSubmit={updateSchedule}>
                    <div className="mt-3">
                        {/* data bo'sh bo'lsa xato bermasligi uchun || {} */}
                        <SelectDay data={currentSchedule || {}} setData={setCurrentSchedule} field="days_of_week" />
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Input label="Boshlanish vaqti" type="time" containerClassName="w-50" value={currentSchedule?.begin_time || ""} onChange={(e) => setCurrentSchedule({ ...currentSchedule, begin_time: e.target.value })} />
                        <span>-</span>
                        <Input label="Tugash vaqvi" type="time" containerClassName="w-50" value={currentSchedule?.end_time || ""} onChange={(e) => setCurrentSchedule({ ...currentSchedule, end_time: e.target.value })} />
                    </div>

                    <div>
                        <label className="form-label">O'qituvchi</label>
                        <select
                            className="form-select"
                            // Controlled bo'lishi uchun faqat value, defaultChecked o'chirildi
                            value={typeof currentSchedule?.teacher === 'object' ? currentSchedule?.teacher?.id : currentSchedule?.teacher || ""}
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, teacher: Number(e.target.value) })}
                        >
                            <option hidden value="">O'qituvchi</option>
                            {teacherData?.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="form-label">Xona</label>
                        <select
                            className="form-select"
                            value={typeof currentSchedule?.room === 'object' ? currentSchedule?.room?.id : currentSchedule?.room || ""}
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, room: Number(e.target.value) })}
                        >
                            <option hidden value="">Xona</option>
                            {roomData?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Input label="Boshlanish sanasi" type="date" containerClassName="w-50" value={currentSchedule?.start_date || ""} onChange={(e) => setCurrentSchedule({ ...currentSchedule, start_date: e.target.value })} />
                        <span>-</span>
                        <Input label="Tugash sanasi" type="date" containerClassName="w-50" value={currentSchedule?.end_date || ""} onChange={(e) => setCurrentSchedule({ ...currentSchedule, end_date: e.target.value })} />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-4">Joriy jadval</span>
                        <Form.Check
                            type="switch"
                            // checked ishlatildi
                            checked={currentSchedule?.is_active || false} 
                            onChange={(e) => setCurrentSchedule({ ...currentSchedule, is_active: e.target.checked })}
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-sm py-2 px-3 delete" style={{ border: "2px solid #cd3232", background: "#cd323210", color: "#cd3232" }} onClick={() => setDelate(true)}>Jadvalni o'chirish</button>
                        <button type="button" className="btn btn-sm py-2 px-4" style={{ background: "#e5e5e5", color: "#000" }} onClick={() => setChangeActiveItem(false)}>Orqaga</button>
                        <button type="submit" className="btn btn-sm py-2 px-4 text-white" style={{ background: "#0085db" }}>
                            {editingSchedule ? <Spinner animation="border" size="sm" /> : "Saqlash"}
                        </button>
                    </div>
                </Form>
            </Modal>

            <style>{`.delete:hover { background: #cd323220 !important; transition: 0.3s; }`}</style>
        </>
    )
}

export default EditGroupSchedule;