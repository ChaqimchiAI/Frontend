import { Card, Spinner, Form } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Input } from "../../components/Ui/Input";
import { useNotification } from "../../Context/NotificationContext";
import Modal from "../../components/Ui/Modal";

// API Queries
import { 
    useEditLead, 
    useLeads, 
    useLeadsStats, 
    useLeadsSources // Manbalar uchun yangi query
} from "../../data/queries/leads.queries";
import { useTeachersData } from "../../data/queries/teachers.queries";
import { useCourses } from "../../data/queries/courses.queries";

// Components
import NewLead from "./components/NewLead";
import LeadsLists from "./components/LeadsLists";
import SelectDay from "../../components/Ui/SelectDay";

// Sening statik ranglar xaritang
const LeadSourceColors = {
    "Instagram": "#ec4899",
    "Telegram": "#06b6d4",
    "Facebook": "#10b981",
    "Tavsiya": "#f59e0b",
    "Banner": "#2f871c",
};

const Leads = () => {
    const { setNotif } = useNotification();
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: "",
        start_date: "",
        end_date: "",
        period: "",
        search: ""
    });

    // ─── DATA FETCHING ───
    const { data, isLoading, error } = useLeads(filters);
    const { data: stats } = useLeadsStats(filters);
    const { data: courses } = useCourses();
    const { data: teachers } = useTeachersData();
    const { data: sources } = useLeadsSources(); // Backenddan manbalarni olamiz

    const leads = data?.results || [];
    const totalCount = data?.count || 0;
    const coursesData = courses?.results || [];
    const teacherData = teachers?.results || [];
    const sourcesData = sources?.results || []; // [ {id: 1, name: "Instagram"}, ... ]

    // ─── MUTATIONS ───
    const { mutate: editLead, isPending: editLeadPending } = useEditLead();

    // ─── LOCAL STATES ───
    const [opemModal, setOpemModal] = useState(false);
    const [show, setShow] = useState(false);
    const [changeData, setChangeData] = useState({});

    if (isLoading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <div className="p-4 text-danger text-center">Xatolik yuz berdi: {error.message}</div>;

    // ─── HANDLERS ───
    const changeLeadsData = (e) => {
        e.preventDefault();

        // Faqat eng muhim maydonlar majburiy
        if (!changeData.first_name || !changeData.phone) {
            setNotif({ show: true, type: "warn", message: "Ism va Telefon raqam majburiy!" });
            return;
        }

        const dataToSend = {
            first_name: changeData.first_name,
            last_name: changeData.last_name || "",
            phone: changeData.phone,
            // Kurs: ID yuboramiz, bo'sh bo'lsa null
            course: (changeData.course?.id || changeData.course) ? Number(changeData.course?.id || changeData.course) : null,
            // MANBA: ID yuboramiz (Backend 400 bermasligi uchun)
            source: (changeData.source?.id || changeData.source) ? Number(changeData.source?.id || changeData.source) : null,
            teacher: (changeData.teacher?.id || changeData.teacher) ? Number(changeData.teacher?.id || changeData.teacher) : null,
            // Hafta kunlari: ID massiviga aylantiramiz
            week_days: (changeData.week_days || []).map(d => (typeof d === 'object' ? d.id : d)),
            comment: changeData.comment || "",
            parent_name: changeData.parent_name || "",
            parent_phone: changeData.parent_phone || ""
        };

        editLead(
            { id: changeData.id, data: dataToSend },
            {
                onSuccess: () => {
                    setNotif({ show: true, type: "success", message: "Lid muvaffaqiyatli yangilandi!" });
                    setOpemModal(false);
                    setChangeData({});
                },
                onError: (err) => {
                    console.error(err);
                    const msg = err.response?.data?.data?.source?.[0] || "Xatolik yuz berdi!";
                    setNotif({ show: true, type: "error", message: msg });
                }
            }
        );
    };

    return (
        <>
            {/* ─── EDIT MODAL ─── */}
            {opemModal && (
                <Modal
                    title={`${changeData?.first_name || "Lid"} tahrirlash`}
                    close={() => { setOpemModal(false); setChangeData({}); }}
                    anima={opemModal}
                    width="60%"
                    zIndex={100}
                >
                    <Form onSubmit={changeLeadsData} className="px-2">
                        <div className="row g-4 mt-1">
                            {/* Chap Ustun: Shaxsiy ma'lumotlar */}
                            <div className="col-md-6 border-end">
                                <h6 className="fw-bold text-primary mb-3">Asosiy ma'lumotlar</h6>
                                <Input
                                    label="Ism *"
                                    value={changeData?.first_name || ""}
                                    onChange={(e) => setChangeData({ ...changeData, first_name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Familya"
                                    value={changeData?.last_name || ""}
                                    onChange={(e) => setChangeData({ ...changeData, last_name: e.target.value })}
                                />
                                <Input
                                    label="Telefon raqam *"
                                    value={changeData?.phone || ""}
                                    onChange={(e) => setChangeData({ ...changeData, phone: e.target.value })}
                                    required
                                />

                                <div className="mt-3">
                                    <label className="form-label small fw-bold">Kurs (Ixtiyoriy)</label>
                                    <select
                                        className="form-select"
                                        value={changeData?.course?.id || changeData?.course || ""}
                                        onChange={(e) => setChangeData({ ...changeData, course: e.target.value })}
                                    >
                                        <option value="">Kurs tanlanmagan</option>
                                        {coursesData.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mt-3">
                                    <label className="form-label small fw-bold">Kelgan joyi (Manba)</label>
                                    {/* Rangli badge-lar - Sening ranglaring backend nomlari bilan bog'landi */}
                                    <div className="d-flex flex-wrap gap-1 mb-2">
                                        {sourcesData.map(s => (
                                            <span 
                                                key={s.id}
                                                className={`badge cursor-pointer p-1 ${(changeData.source?.id || changeData.source) == s.id ? 'ring-2 border border-dark scale-110' : 'opacity-75'}`}
                                                style={{ 
                                                    background: LeadSourceColors[s.name] || "#6c757d", 
                                                    fontSize: '10px',
                                                    transition: '0.2s'
                                                }}
                                                onClick={() => setChangeData({ ...changeData, source: s.id })}
                                            >
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                    <select
                                        className="form-select"
                                        value={changeData?.source?.id || changeData?.source || ""}
                                        onChange={(e) => setChangeData({ ...changeData, source: e.target.value })}
                                    >
                                        <option value="">Manbani tanlang</option>
                                        {sourcesData.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* O'ng Ustun: Dars va Ota-ona */}
                            <div className="col-md-6">
                                <h6 className="fw-bold text-primary mb-3">Dars va Aloqa</h6>
                                
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Hafta kunlari</label>
                                    <SelectDay
                                        data={changeData}
                                        setData={setChangeData}
                                        field="week_days"
                                    />
                                </div>

                                <Input
                                    label="Ota-onasi ismi"
                                    value={changeData?.parent_name || ""}
                                    onChange={(e) => setChangeData({ ...changeData, parent_name: e.target.value })}
                                />
                                <Input
                                    label="Ota-onasi telefoni"
                                    value={changeData?.parent_phone || ""}
                                    onChange={(e) => setChangeData({ ...changeData, parent_phone: e.target.value })}
                                />

                                <div className="mt-3">
                                    <label className="form-label small fw-bold">Izoh</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Lid bo'yicha qo'shimcha eslatmalar..."
                                        style={{ resize: "none" }}
                                        value={changeData?.comment || ""}
                                        onChange={(e) => setChangeData({ ...changeData, comment: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4 py-2"
                                onClick={() => { setOpemModal(false); setChangeData({}); }}
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-5 py-2 fw-bold"
                                disabled={editLeadPending}
                            >
                                {editLeadPending ? <Spinner size="sm" animation="border" /> : "Saqlash"}
                            </button>
                        </div>
                    </Form>
                </Modal>
            )}

            {/* ─── MAIN UI ─── */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Lidlar</h4>
                    <p className="text-muted small">Barcha potentsial o'quvchilar ro'yxati</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShow(true)}>
                    <Icon icon="qlementine-icons:plus-16" width="18" />
                    Yangi lid qo'shish
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                {[
                    { label: "Jami Lidlar", val: stats?.display_count, color: "#0095db", icon: "charm:person" },
                    { label: "Guruhga qo'shildi", val: stats?.statuses?.registered, color: "#198754", icon: "prime:check-square" },
                    { label: "Yangi Lidlar", val: stats?.new_leads_count, color: "#00676f", icon: "qlementine-icons:plus-16" },
                    { label: "Bugungilar", val: stats?.today_count, color: "#9647fd", icon: "pajamas:calendar" }
                ].map((item, i) => (
                    <div className="col-md-3" key={i}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="d-flex justify-content-between align-items-center p-3">
                                <div>
                                    <div className="text-muted small fw-bold">{item.label}</div>
                                    <h3 className="fw-bold mb-0 mt-1" style={{ color: item.color }}>{item.val || 0}</h3>
                                </div>
                                <div className="p-2 rounded-3" style={{ background: `${item.color}15`, color: item.color }}>
                                    <Icon icon={item.icon} width="24" />
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            <LeadsLists
                leads={leads}
                stats={stats}
                totalCount={totalCount}
                filters={filters}
                setFilters={setFilters}
                setOpemModal={setOpemModal}
                setChangeData={setChangeData}
            />

            {show && <NewLead setNotif={setNotif} setShow={setShow} show={show} />}
        </>
    );
};

export default Leads;