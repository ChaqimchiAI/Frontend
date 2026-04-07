import React from "react";
import { Modal, Table, Badge, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useArchiveStudent } from "../../../data/queries/archive.queries";

const getGroupStatusBadge = (status) => {
    switch (status) {
        case "active":
            return <Badge bg="primary-subtle" className="text-primary border border-primary-subtle rounded-pill"><Icon icon="ph:student" className="me-1"/>Faol</Badge>;
        case "left":
            return <Badge bg="danger-subtle" className="text-danger border border-danger-subtle rounded-pill"><Icon icon="ph:door-open" className="me-1"/>Tark etgan</Badge>;
        case "frozen":
            return <Badge bg="warning-subtle" className="text-warning border border-warning-subtle rounded-pill"><Icon icon="ph:snowflake" className="me-1"/>Muzlatgan</Badge>;
        case "finished":
            return <Badge bg="success-subtle" className="text-success border border-success-subtle rounded-pill"><Icon icon="ph:check-circle" className="me-1"/>Bitirgan</Badge>;
        default:
            return <Badge bg="secondary-subtle" className="text-secondary border rounded-pill">{status}</Badge>;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

const StudentGroupsModal = ({ show, onHide, studentId }) => {
    const { data: student, isLoading, isError } = useArchiveStudent(studentId);

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="border-bottom-0 pb-0">
                <Modal.Title className="fw-bold">
                    O'quvchi guruhlari reyestri
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-2">
                {isLoading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <div className="mt-2 text-muted">Yuklanmoqda...</div>
                    </div>
                ) : isError || !student ? (
                    <div className="text-center py-5 text-danger opacity-75">
                        <Icon icon="solar:danger-circle-broken" width="48" className="mb-2" />
                        <div>Ma'lumot topilmadi yoxud xatolik yuz berdi.</div>
                    </div>
                ) : (
                    <>
                        <div className="d-flex align-items-center gap-3 mb-4 bg-light p-3 rounded">
                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
                                 style={{ background: "linear-gradient(45deg, #0981c2, #00c8ff)", width: "48px", height: "48px", fontSize: "18px", fontWeight: "bold" }}>
                                {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                            </div>
                            <div>
                                <h5 className="mb-0 fw-bold">{student.first_name} {student.last_name}</h5>
                                <div className="text-muted small">{student.phone}</div>
                            </div>
                        </div>

                        {!student.groups?.length ? (
                            <div className="text-center py-4 text-muted opacity-50">
                                <Icon icon="solar:folder-open-broken" width="48" className="mb-2" />
                                <div>O'quvchi birorta ham guruhga biriktirilmagan</div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="py-2 px-3 rounded-start">Guruh nomi</th>
                                            <th className="py-2 px-3">Kurs</th>
                                            <th className="py-2 px-3">Holati</th>
                                            <th className="py-2 px-3">Muddat</th>
                                            <th className="py-2 px-3 rounded-end">Sabab</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.groups.map(group => (
                                            <tr key={group.group_id}>
                                                <td className="px-3 fw-medium">
                                                    {group.group_name}
                                                </td>
                                                <td className="px-3 text-muted">
                                                    {group.course_name || "—"}
                                                </td>
                                                <td className="px-3">
                                                    {getGroupStatusBadge(group.status)}
                                                </td>
                                                <td className="px-3">
                                                    <div className="small d-flex flex-column">
                                                        <span className="text-success"><Icon icon="solar:calendar-add-linear"/> {formatDate(group.joined_date)}</span>
                                                        {group.left_date && <span className="text-danger mt-1"><Icon icon="solar:exit-linear"/> {formatDate(group.left_date)}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-3 text-muted small" style={{ maxWidth: '180px', whiteSpace: 'normal' }}>
                                                    {group.reason || "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default StudentGroupsModal;
