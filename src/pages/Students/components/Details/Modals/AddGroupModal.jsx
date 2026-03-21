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
            // Eng yuqori qatlamda turishi uchun
            zIndex={9999} 
        >
            <div className="p-2">
                <label className="mb-2 small fw-bold">Guruhni tanlang</label>
                <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="form-select shadow-sm"
                    disabled={addingStudentGroup}
                >
                    <option value="" hidden>Tanlang...</option>
                    {(groupsData?.results || groupsData || []).map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
                
                <div className="mt-4 d-flex gap-2 justify-content-end">
                    <Button
                        variant="light"
                        className="px-4 border"
                        onClick={() => setAddStudentGroup(false)}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        className="save-button px-4"
                        onClick={handleAddStudentGroup}
                        disabled={addingStudentGroup || !selectedGroup}
                    >
                        {addingStudentGroup ? <Spinner size="sm" /> : "Qo'shish"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddGroupModal;