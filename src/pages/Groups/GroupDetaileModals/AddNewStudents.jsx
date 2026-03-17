import { Icon } from "@iconify/react"
import Modal from "../../../components/Ui/Modal"
import { ReactSelect } from "../../../components/Ui/ReactSelect"
import { useTheme } from "../../../Context/Context"
import { useState } from "react"
import { useAddLeadToGroup, useAddStudentToGroup } from "../../../data/queries/group.queries"
import { useLeads } from "../../../data/queries/leads.queries"
import { useStudentsData } from "../../../data/queries/students.queries"
import { Spinner, Nav } from "react-bootstrap"

const AddNewStudents = ({
    addNewUser,
    setAddNewUser,
    setNotif,
    id
}) => {
    const { theme } = useTheme();

    const { mutate: addLeadToGroup, isPending: addingLead } = useAddLeadToGroup();
    const { mutate: addStudentToGroup, isPending: addingStudent } = useAddStudentToGroup();

    // Fetch leads and students here
    const { data: leads } = useLeads();
    const leadsData = leads?.results || [];

    const { data: students } = useStudentsData();
    const studentsData = students?.results || [];

    const [activeTab, setActiveTab] = useState("leads");
    const [selectedUser, setSelectedUser] = useState(null);

    const addUser = () => {
        if (!selectedUser) return;

        if (activeTab === "leads") {
            addLeadToGroup(
                {
                    id: selectedUser,
                    group_id: Number(id)
                },
                {
                    onSuccess: () => {
                        setNotif({ show: true, type: "success", message: "Guruhga yangi o'quvchi qo'shildi" })
                        setAddNewUser(false)
                        setSelectedUser(null)
                    },
                    onError: (err) => {
                        console.error(err)
                        setNotif({ show: true, type: 'error', message: err?.response?.data?.message || "Xatolik yuz berdi!" })
                    }
                }
            )
        } else {
            addStudentToGroup(
                {
                    student_id: selectedUser,
                    id: Number(id)
                },
                {
                    onSuccess: () => {
                        setNotif({ show: true, type: "success", message: "Guruhga o'quvchi qo'shildi" })
                        setAddNewUser(false)
                        setSelectedUser(null)
                    },
                    onError: (err) => {
                        console.error(err)
                        setNotif({ show: true, type: 'error', message: err?.response?.data?.message || "Xatolik yuz berdi!" })
                    }
                }
            )
        }
    }

    // Modalni yopganda state larni tozalash
    const handleClose = () => {
        setAddNewUser(false);
        setSelectedUser(null);
    }

    const options = activeTab === "leads" 
        ? leadsData.map(user => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name} (${user.phone})`,
            id: user.id
          }))
        : studentsData.map(user => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name} (${user.phone})`,
            id: user.id
          }));

    return (
        <Modal
            title="Guruhga o'quvchi qo'shish"
            close={handleClose}
            anima={addNewUser}
            width="35%"
            zIndex={100}
        >
            <div className="mb-3">
                <Nav variant="pills" className="gap-2">
                    <Nav.Item>
                        <Nav.Link 
                            active={activeTab === "leads"} 
                            onClick={() => { setActiveTab("leads"); setSelectedUser(null); }}
                            className="cursor-pointer"
                        >
                            Lidlar orqali
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link 
                            active={activeTab === "students"} 
                            onClick={() => { setActiveTab("students"); setSelectedUser(null); }}
                            className="cursor-pointer"
                        >
                            O'quvchilar orqali
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>

            <ReactSelect
                label={activeTab === "leads" ? "Lidlar ro'yxatidan tanlang" : "O'quvchilar ro'yxatidan tanlang"}
                containerClassName="mt-2"
                placeholder="Qidirish..."
                menuPortalTarget={document.body}
                options={options}
                value={options.find(opt => opt.value === selectedUser) || null}
                onChange={(option) => {
                    setSelectedUser(option?.id || null)
                }}
            />

            <button
                className="btn btn-sm save-button align-self-end mt-3"
                disabled={!selectedUser}
                onClick={addUser}
            >
                {(addingLead || addingStudent) ? <Spinner animation="border" size="sm" /> : "Qo'shish"}
            </button>
        </Modal>
    )
}

export default AddNewStudents