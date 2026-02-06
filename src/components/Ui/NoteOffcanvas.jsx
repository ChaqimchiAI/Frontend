import { useState } from "react";
import { Offcanvas, Form, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useCreateStudentNote, useStudentNotes } from "../../data/queries/students.queries";
import { useTheme } from "../../Context/Context"; // O'zingizni manzilingizga moslang

const NoteOffcanvas = ({ show, handleClose, student }) => {
    const { theme } = useTheme();
    const [note, setNote] = useState("");

    // Hook'lar
    const { data: notes, isLoading } = useStudentNotes(student.id);

    const { mutate: addNote, isPending: adding } = useCreateStudentNote();

    // Dark/Light ranglar mantiqi
    const isDark = theme === false; // image_5a0f3f.png dagi kabi dark rejim
    const bgColor = isDark ? "##111c2d" : "#ffffff";
    const textColor = isDark ? "#ffffffd9" : "#212529";
    const borderColor = isDark ? "rgba(255,255,255,0.1)" : "#dee2e6";
    const inputBg = isDark ? "#111827" : "#f8f9fa";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!note.trim()) return;

        addNote(
            {
                id: student.id,
                data: { text: note }
            },
            {
                onSuccess: () => {
                    setNote("");
                },
                onError: (err) => {
                    console.error(err);
                }
            }
        );
    };

    return (
        <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            style={{
                backgroundColor: bgColor,
                color: textColor,
                borderLeft: `1px solid ${borderColor}`,
                width: "400px"
            }}
        >
            <Offcanvas.Header closeButton closeVariant={isDark ? "white" : undefined}>
                <Offcanvas.Title className="fs-6 fw-bold d-flex align-items-center gap-2">
                    {student?.first_name} {student?.last_name}
                </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body className="d-flex flex-column" style={{ height: "100%" }}>
                {/* Izohlar ro'yxati */}
                <div className="flex-grow-1 overflow-auto mb-3 pe-2">
                    {isLoading ? (
                        <div className="text-center mt-5">
                            <Spinner animation="border" size="sm" variant="primary" />
                        </div>
                    ) : notes?.length > 0 ? (
                        notes.map((item) => (
                            <div
                                key={item.id}
                                className="p-3 mb-2 rounded border shadow-sm"
                                style={{
                                    backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                                    borderColor: borderColor
                                }}
                            >
                                <p className="small mb-2" style={{ lineHeight: "1.5" }}>{item.text}</p>
                                <div className="d-flex justify-content-between align-items-center opacity-75" style={{ fontSize: '11px' }}>
                                    <span className="fw-medium text-primary d-flex align-items-center gap-1">
                                        <Icon icon="solar:user-bold" />
                                        {item.admin || "Admin"}
                                    </span>
                                    <span className="text-muted">
                                        {item.date || new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted mt-5 small">
                            <Icon icon="solar:chat-line-broken" width="40" className="opacity-25 mb-2" />
                            <p>Hozircha hech qanday izoh yo'q</p>
                        </div>
                    )}
                </div>

                {/* Yangi izoh yozish qismi */}
                <Form onSubmit={handleSubmit} className="border-top pt-3" style={{ borderColor: borderColor }}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Izoh qoldiring..."
                            style={{
                                backgroundColor: inputBg,
                                color: textColor,
                                borderColor: borderColor,
                                fontSize: "14px",
                                resize: "none"
                            }}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </Form.Group>
                    <button
                        type="submit"
                        className="btn btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ background: "#0085db", color: "#fff", border: "none" }}
                        disabled={adding || !note.trim()}
                    >
                        {adding ? <Spinner animation="border" size="sm" /> : "Saqlash"}
                    </button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default NoteOffcanvas;