import { useState } from "react";
import { Icon } from "@iconify/react";
import { Spinner, Nav } from "react-bootstrap";
import Modal from "../../components/Ui/Modal";
import { ReactSelect } from "../../components/Ui/ReactSelect";
import { useTheme } from "../../Context/Context";

import { useAddStudentToArchiveGroup } from "../../data/queries/archive.queries";
import { useStudentsData } from "../../data/queries/students.queries";
import { useLeads } from "../../data/queries/leads.queries"; // If you want to allow adding leads directly. But archive API only has addStudent endpoint right now. Let's assume we use addStudentToArchiveGroup for students.

const ArchiveAddStudentModal = ({
    showModal,
    setShowModal,
    setNotif,
    groupId
}) => {
    const { theme } = useTheme();

    const { mutate: addStudentToGroup, isPending: addingStudent } = useAddStudentToArchiveGroup();

    // Faqat studentlarni olamiz
    const { data: students } = useStudentsData();
    const studentsData = students?.results || [];

    const [selectedUser, setSelectedUser] = useState(null);

    const addUser = () => {
        if (!selectedUser) return;

        addStudentToGroup(
            {
                id: Number(groupId),
                student_id: selectedUser,
            },
            {
                onSuccess: () => {
                    setNotif({ show: true, type: "success", message: "Guruhga o'quvchi qo'shildi" });
                    setShowModal(false);
                    setSelectedUser(null);
                },
                onError: (err) => {
                    console.error(err);
                    setNotif({ show: true, type: 'error', message: err?.response?.data?.message || "Xatolik yuz berdi!" });
                }
            }
        );
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const options = studentsData.map(user => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name} (${user.phone})`,
        id: user.id
    }));

    return (
        <Modal
            title="Guruhga o'quvchi qo'shish"
            close={handleClose}
            anima={showModal}
            width="35%"
            zIndex={100}
        >
            <ReactSelect
                label="O'quvchilar ro'yxatidan tanlang"
                containerClassName="mt-2"
                placeholder="Qidirish..."
                menuPortalTarget={document.body}
                options={options}
                value={options.find(opt => opt.value === selectedUser) || null}
                onChange={(option) => {
                    setSelectedUser(option?.id || null);
                }}
            />

            <div className="d-flex justify-content-end mt-4">
                <button
                    className="btn btn-sm save-button"
                    disabled={!selectedUser}
                    onClick={addUser}
                >
                    {addingStudent ? <Spinner animation="border" size="sm" /> : "Qo'shish"}
                </button>
            </div>
        </Modal>
    );
};

export default ArchiveAddStudentModal;
