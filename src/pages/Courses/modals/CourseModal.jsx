import { useState, useEffect } from "react";
import Modal from "../../../components/Ui/Modal";
import { useCreateCourse, useEditCourse } from "../../../data/queries/courses.queries";
import { Input } from "../../../components/Ui/Input";
import { Form, Spinner, Row, Col } from "react-bootstrap";

const CourseModal = ({ show, setShow, setNotif, editData = null }) => {
    const isEdit = !!editData;
    const { mutate: createCourse, isPending: creatingCourse } = useCreateCourse();
    const { mutate: editCourse, isPending: updatingCourse } = useEditCourse();

    const initialState = {
        name: "",
        price: "",
        description: "",
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (editData && show) {
            setFormData({
                name: editData.name || "",
                price: editData.price || "",
                description: editData.description || "",
            });
        } else if (!isEdit && show) {
            setFormData(initialState);
        }
    }, [editData, show]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            price: formData.price,
            description: formData.description,
        };

        const mutation = isEdit ? editCourse : createCourse;
        const actionPayload = isEdit ? { id: editData.id, data: payload } : payload;

        mutation(actionPayload, {
            onSuccess: () => {
                setNotif({ show: true, type: "success", message: `Kurs muvaffaqiyatli ${isEdit ? "tahrirlandi" : "qo'shildi"}!` });
                setShow(false);
            },
            onError: (err) => {
                console.error(err);
                setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
            }
        });
    };

    const isLoading = creatingCourse || updatingCourse;

    return (
        <Modal
            title={isEdit ? "Kursni tahrirlash" : "Yangi kurs qo'shish"}
            close={() => setShow(false)}
            anima={show}
            width="40%"
            zIndex={1050}
        >
            <Form onSubmit={handleSubmit} className="p-2">
                <Row className="g-3">
                    <Col md={12}>
                        <Input
                            label="Kurs nomi *"
                            value={formData.name}
                            placeholder="Kurs nomini kiriting"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </Col>
                    <Col md={12}>
                        <Input
                            label="Narxi (UZS) *"
                            type="number"
                            value={formData.price}
                            placeholder="Narxni kiriting"
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </Col>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fs-3 fw-medium">Tavsif</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                placeholder="Kurs haqida qisqacha ma'lumot..."
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ resize: "none" }}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button
                        type="button"
                        onClick={() => setShow(false)}
                        className="btn btn-sm px-4 py-2 text-black"
                        style={{ background: "#fff" }}
                    >
                        Orqaga
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm px-4 py-2 text-white fw-bold d-flex align-items-center gap-2"
                        disabled={isLoading}
                        style={{ background: "#0085db", borderRadius: "8px" }}
                    >
                        {isLoading ? <Spinner size="sm" /> : (isEdit ? "O'zgarishlarni saqlash" : "Saqlash")}
                    </button>
                </div>
            </Form>
        </Modal>
    );
};

export default CourseModal;
