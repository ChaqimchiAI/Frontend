import { Icon } from "@iconify/react"
import { Input } from "../../../components/Ui/Input"
import Modal from "../../../components/Ui/Modal"

const AddNewStudents = ({
    addNewUser,
    setAddNewUser,
    handleSearch,
    searchLead
}) => {
    return (
        <Modal
            title="Guruhga yangi o'quvchi qo'shish"
            close={setAddNewUser}
            anima={addNewUser}
            width="35%"
        >
            <Input
                label="O'quvchini Lidlar ro'yxatidan tanlang"
                placeholder="Lidlarni qidirish..."
                type="search"
                onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="d-flex flex-column gap-15 mt-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {searchLead.map(lead => (
                    <div
                        className="d-flex justify-content-between align-items-center p-2 border rounded-3"
                        key={lead.id}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <span
                                style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#0881c2", color: "#fff" }}
                                className="d-flex align-items-center justify-content-center fs-4"
                            >
                                {lead.name.charAt(0)}
                            </span>
                            <div className="d-flex flex-column">
                                <span className="fw-medium">{lead.name}</span>
                                <span className="fs-3">{lead.phone}</span>
                            </div>
                        </div>
                        <button
                            className="btn btn-sm"
                            style={{ background: "#0881c2", color: "#fff" }}
                        >
                            <Icon icon="prime:user-plus" width="20" height="20" className="me-2" />
                            Qo'shish
                        </button>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default AddNewStudents