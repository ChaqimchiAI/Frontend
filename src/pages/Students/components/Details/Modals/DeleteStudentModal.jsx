import { Button, Spinner } from "react-bootstrap";
import Modal from "../../../../components/Ui/Modal";

const DeleteStudentModal = ({
    deleteStudent,
    setDeleteStudent,
    handleDeleteStudent,
    deletingStudent
}) => {
    return (
        <Modal
            title="Tasdiqlash"
            anima={deleteStudent}
            close={setDeleteStudent}
            width="30%"
            zIndex={100}
        >
            <p className="fs-4">Haqiqatdan o'chirishni istaysizmi?</p>

            <div className="mt-2 d-flex align-items-center gap-2 justify-content-end">
                <Button
                    className="btn btn-sm px-4 py-2 text-black border-0"
                    style={{ background: "#f9fafb" }}
                    onClick={() => setDeleteStudent(false)}
                >
                    Orqaga
                </Button>
                <Button
                    className="btn btn-sm px-4 py-2 border-0"
                    style={{ background: "#db3232", color: "#fff" }}
                    onClick={handleDeleteStudent}
                >
                    {deletingStudent ? <Spinner animation="border" size="sm" /> : "Ha"}
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteStudentModal;
