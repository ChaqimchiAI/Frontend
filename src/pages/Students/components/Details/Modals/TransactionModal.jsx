import { Button, Spinner } from "react-bootstrap";
import Modal from "../../../../components/Ui/Modal";
import { Input } from "../../../../components/Ui/Input";

const TransactionModal = ({
    modal,
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
            title={`${modal === "payment" ? "To'lov qilish" : "Pul qaytarish"}`}
            anima={modal}
            close={setModal}
            width="30%"
            zIndex={100}
        >
            {modal === "payment" && (
                <div className="d-flex gap-3 mt-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="paymentType"
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
                            name="paymentType"
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
                placeholder="Summa"
                required
                disabled={creatingStudentTransaction}
                containerClassName="mt-2"
            />

            {modal === "withdraw" && (
                <Input
                    label="Izoh"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Izoh..."
                    disabled={creatingStudentTransaction}
                    containerClassName="mt-2"
                />
            )}

            <div className="mt-2 d-flex align-items-center gap-2 justify-content-end">
                <Button
                    className="btn btn-sm px-4 py-2 text-black border-0"
                    style={{ background: "#f7f7f7" }}
                    onClick={() => setModal(null)}
                >
                    Orqaga
                </Button>
                <Button
                    className="btn btn-sm save-button"
                    onClick={handleTransaction}
                >
                    {creatingStudentTransaction ? <Spinner animation="border" size="sm" /> : (modal === "payment" ? "To'lash" : "Qaytarish")}
                </Button>
            </div>
        </Modal>
    );
};

export default TransactionModal;
