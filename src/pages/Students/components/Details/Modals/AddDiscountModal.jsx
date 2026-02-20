import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Spinner, Row } from "react-bootstrap";
import Modal from "../../../../../components/Ui/Modal";
import { Input } from "../../../../../components/Ui/Input";
import { ReactSelect } from "../../../../../components/Ui/ReactSelect";
import { useCreateStudentDiscount } from "../../../../../data/queries/billing.queries";

const AddDiscountModal = ({
    showAddDiscount,
    setShowAddDiscount,
    setNotif
}) => {
    const { id } = useParams();
    const { mutate: createStudentDiscount, isPending: creatingDiscount } = useCreateStudentDiscount(id);

    const [discount, setDiscount] = useState({
        amount: "",
        comment: "",
        total_uses: ""
    });

    const handleAddDiscount = () => {
        if (!discount.amount || !discount.total_uses) return;
        createStudentDiscount(discount, {
            onSuccess: () => {
                setNotif({ show: true, type: "success", message: "Chegirma muvaffaqiyatli qo'shildi!" });
                setDiscount({ amount: "", total_uses: "", comment: "" });
                setShowAddDiscount(false);
            },
            onError: (err) => {
                console.error(err);
                setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
            }
        });
    };

    return (
        <Modal
            title="Chegirma qo'shish"
            anima={showAddDiscount}
            close={setShowAddDiscount}
            width="30%"
            zIndex={100}
        >
            <Row>
                <Input
                    label="Chegirma summasi"
                    value={discount.amount}
                    onChange={(e) => setDiscount({ ...discount, amount: e.target.value.replace(/\D/g, '') })}
                    placeholder="Chegirma..."
                    required
                    disabled={creatingDiscount}
                    containerClassName="mt-2 col-8"
                />

                <ReactSelect
                    label="Muddat"
                    containerClassName="mt-2 col-4"
                    placeholder="Muddat"
                    value={discount.total_uses ? { value: discount.total_uses, label: `${discount.total_uses} oy` } : null}
                    options={[
                        { value: "1", label: "1 oy" },
                        { value: "2", label: "2 oy" },
                        { value: "3", label: "3 oy" },
                        { value: "4", label: "4 oy" },
                        { value: "5", label: "5 oy" },
                        { value: "6", label: "6 oy" },
                        { value: "7", label: "7 oy" },
                        { value: "8", label: "8 oy" },
                        { value: "9", label: "9 oy" },
                        { value: "10", label: "10 oy" },
                        { value: "11", label: "11 oy" },
                        { value: "12", label: "12 oy" },
                    ]}
                    onChange={(e) => setDiscount({ ...discount, total_uses: e.value })}
                />
            </Row>

            <label htmlFor="desc">Izoh</label>
            <textarea
                id="desc"
                className="form-control mt-2"
                style={{ resize: "none" }}
                placeholder="Izoh..."
                rows="3"
                value={discount.comment}
                onChange={(e) => setDiscount({ ...discount, comment: e.target.value })}
            ></textarea>

            <div className="mt-2 d-flex align-items-center gap-2 justify-content-end">
                <Button
                    className="btn btn-sm px-4 py-2 text-black border-0"
                    style={{ background: "#f9fafb" }}
                    onClick={() => setShowAddDiscount(false)}
                >
                    Orqaga
                </Button>
                <Button
                    className="btn btn-sm save-button"
                    onClick={handleAddDiscount}
                >
                    {creatingDiscount ? <Spinner animation="border" size="sm" /> : "Qo'shish"}
                </Button>
            </div>
        </Modal>
    );
};

export default AddDiscountModal;
