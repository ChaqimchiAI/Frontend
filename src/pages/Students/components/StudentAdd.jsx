import { useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { Input } from "../../../components/Ui/Input";
import { useCreateStudent } from "../../../data/queries/students.queries";
import { useBranchesData } from "../../../data/queries/branches.queries";

const StudentAdd = ({ close, setNotif }) => {
    const { data: branches } = useBranchesData();
    const bracnchesData = branches?.results || [];        

    const { mutate: createStudent, isPending: isCreating } = useCreateStudent();
    const [serverErrors, setServerErrors] = useState({});

    const [changeData, setChangeData] = useState({
        first_name: "",
        last_name: "",
        middle_name: "",
        parent_name: "",
        phone: "",
        parent_phone: "",
        date_of_birth: "",
        address: "",
        description: "",
        image: null,
        branch: null// Backend so'rayotgan majburiy maydon
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setServerErrors({});

        // Backendga kerak bo'lmagan maydonlarni ajratish
        const { parent_name, ...payload } = changeData;

        createStudent(payload, {
            onSuccess: () => {
                close(false);
                setNotif({ show: true, message: "O'quvchi muvaffaqiyatli qo'shildi", type: "success" });
            },
            onError: (error) => {
                if (error.response?.status === 400) {
                    // Xatoliklarni statega yozish
                    setServerErrors(error.response.data?.data || {});
                }
                setNotif({ show: true, message: "Ma'lumotlarni to'ldirishda xatolik!", type: "error" });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-2">
            <div className="p-3 rounded-3" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.05)" }}>
                {/* 1-Qator: Ism, Familiya, Telefon */}
                <Row className="mb-3">
                    <Col md={4}>
                        <Input
                            label="Ism *"
                            defaultValue={changeData.first_name}
                            onChange={(e) => setChangeData({ ...changeData, first_name: e.target.value })}
                            placeholder="Ism..."
                            required
                            error={serverErrors?.first_name?.[0]}
                        />
                    </Col>
                    <Col md={4}>
                        <Input
                            label="Familiya *"
                            defaultValue={changeData.last_name}
                            onChange={(e) => setChangeData({ ...changeData, last_name: e.target.value })}
                            placeholder="Familiya..."
                            required
                            error={serverErrors?.last_name?.[0]}
                        />
                    </Col>
                    <Col md={4}>
                        <Input
                            label="Telefon raqam *"
                            defaultValue={changeData.phone}
                            onChange={(e) => setChangeData({ ...changeData, phone: e.target.value })}
                            placeholder="Raqam..."
                            required
                            error={serverErrors?.phone?.[0]}
                        />
                    </Col>
                </Row>

                {/* 2-Qator: Otasining ismi, Tug'ilgan sana */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Input
                            label="Otasining ismi (Sharfi)"
                            defaultValue={changeData.middle_name}
                            onChange={(e) => setChangeData({ ...changeData, middle_name: e.target.value })}
                            placeholder="Otasining ismi..."
                            error={serverErrors?.middle_name?.[0]}
                        />
                    </Col>
                    <Col md={6}>
                        <Input
                            label="Tug'ilgan sana *"
                            type="date"
                            defaultValue={changeData.date_of_birth}
                            onChange={(e) => setChangeData({ ...changeData, date_of_birth: e.target.value })}
                            required
                            error={serverErrors?.date_of_birth?.[0]}
                        />
                    </Col>
                </Row>

                {/* 3-Qator: Ota-onasining ismi va telefoni */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Input
                            label="Ota-onasining ismi"
                            defaultValue={changeData.parent_name}
                            onChange={(e) => setChangeData({ ...changeData, parent_name: e.target.value })}
                            placeholder="Ism..."
                            error={serverErrors?.parent_name?.[0]}
                        />
                    </Col>
                    <Col md={6}>
                        <Input
                            label="Ota-onasining telefon raqami"
                            defaultValue={changeData.parent_phone}
                            onChange={(e) => setChangeData({ ...changeData, parent_phone: e.target.value })}
                            placeholder="Raqam..."
                            error={serverErrors?.parent_phone?.[0]}
                        />
                    </Col>
                </Row>

                {/* 4-Qator: Manzil va Branch (Filial) */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Input
                            label="Manzil"
                            defaultValue={changeData.address}
                            onChange={(e) => setChangeData({ ...changeData, address: e.target.value })}
                            placeholder="Manzil..."
                            error={serverErrors?.address?.[0]}
                        />
                    </Col>
                    <Col md={6} className="d-flex flex-column gap-2">
                        <label htmlFor="branch">Filial *</label>
                        <select
                            id="branch"
                            className="form-select"
                            value={changeData.branch}
                            onChange={(e) => setChangeData({ ...changeData, branch: Number(e.target.value) })}
                            required
                        >
                            <option value="" hidden>Tanlang</option>
                            {bracnchesData.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                        <div className="invalid-feedback">
                            {serverErrors?.branch?.[0]}
                        </div>
                    </Col>
                </Row>

                {/* 5-Qator: Izoh */}
                <Row>
                    <Col md={12}>
                        <label className="mb-1 small opacity-75">Izoh</label>
                        <textarea
                            className={`form-control ${serverErrors?.description ? 'is-invalid' : ''}`}
                            style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
                            rows={3}
                            placeholder="Izoh..."
                            onChange={(e) => setChangeData({ ...changeData, description: e.target.value })}
                        />
                        {serverErrors?.description && (
                            <div className="invalid-feedback">{serverErrors.description[0]}</div>
                        )}
                    </Col>
                </Row>
            </div>

            {/* Pastki tugmalar */}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                    type="submit"
                    className="btn btn-sm fs-3 px-4 py-2"
                    style={{ background: "#0085db", color: "#fff", border: "none" }}
                    disabled={isCreating}
                >
                    {isCreating ? <Spinner size="sm" /> : "Saqlash"}
                </button>
            </div>
        </form>
    );
};

export default StudentAdd;