import { Button, Spinner } from "react-bootstrap";
import Modal from "../../../../components/Ui/Modal";
import { Input } from "../../../../components/Ui/Input";

const TransactionModal = ({
    modal, // "payment" yoki "refund" (ilgarigi "withdraw" o'rniga)
    setModal,
    paymentType,
    setPaymentType,
    setAmount,
    comment,
    setComment,
    creatingStudentTransaction,
    handleTransaction
}) => {
    return (
        <Modal
            title={`${modal === "payment" ? "Balansni to'ldirish" : "Pul qaytarish (Refund)"}`}
            anima={modal}
            close={setModal}
            width="30%"
            zIndex={100}
        >
            {/* Faqat to'lov (kirim) bo'lganda radio tugmalar chiqadi */}
            {modal === "payment" && (
                <div className="d-flex gap-3 mt-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="cash"
                            value="cash"
                            checked={paymentType === "cash"}
                            onChange={(e) => setPaymentType(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="cash">Naqd</label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            id="card"
                            value="card"
                            checked={paymentType === "card"}
                            onChange={(e) => setPaymentType(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="card">Plastik</label>
                    </div>
                </div>
            )}

            <Input
                label="Summa"
                type="text"
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="Summa..."
                required
                disabled={creatingStudentTransaction}
                containerClassName="mt-2"
            />

            {/* Refund bo'lganda izoh majburiy bo'lgani yaxshi */}
            {modal === "refund" && (
                <Input
                    label="Qaytarish sababi (Izoh)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Masalan: Xato to'lov yoki o'quvchi ketgani uchun..."
                    disabled={creatingStudentTransaction}
                    containerClassName="mt-2"
                />
            )}

            <div className="mt-4 d-flex align-items-center gap-2 justify-content-end">
                <Button
                    className="btn btn-sm px-4 py-2 text-black border-0"
                    style={{ background: "#f7f7f7" }}
                    onClick={() => setModal(null)}
                >
                    Orqaga
                </Button>
                <Button
                    className={`btn btn-sm ${modal === "refund" ? "btn-warning" : "save-button"}`}
                    onClick={handleTransaction}
                    disabled={creatingStudentTransaction}
                >
                    {creatingStudentTransaction ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        modal === "payment" ? "To'ldirish" : "Qaytarish"
                    )}
                </Button>
            </div>
        </Modal>
    );
};

export default TransactionModal;