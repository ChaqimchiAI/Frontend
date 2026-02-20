import { Button, Spinner } from "react-bootstrap";
import Modal from "../../../../components/Ui/Modal";

const AddGroupModal = ({
    addStudentGroup,
    setAddStudentGroup,
    selectedGroup,
    setSelectedGroup,
    groupsData,
    addingStudentGroup,
    handleAddStudentGroup
}) => {
    return (
        <Modal
            title="Guruhga qo'shish"
            anima={addStudentGroup}
            close={setAddStudentGroup}
            width="30%"
            zIndex={100}
        >
            <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                required
                className="form-select"
                disabled={addingStudentGroup}
            >
                <option value="" hidden>Guruhni tanlang</option>
                {(groupsData?.results || groupsData || []).map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
            </select>
            <div className="mt-2 d-flex align-items-center gap-2 justify-content-end">
                <Button
                    className="btn btn-sm px-4 py-2 text-black border-0"
                    style={{ background: "#f9fafb" }}
                    onClick={() => setAddStudentGroup(false)}
                >
                    Orqaga
                </Button>
                <Button
                    className="btn btn-sm save-button"
                    onClick={handleAddStudentGroup}
                >
                    {addingStudentGroup ? <Spinner animation="border" size="sm" /> : "Qo'shish"}
                </Button>
            </div>
        </Modal>
    );
};

export default AddGroupModal;
