import { Icon } from "@iconify/react"
import Modal from "../../../components/Ui/Modal"
import { ReactSelect } from "../../../components/Ui/ReactSelect"
import { useTheme } from "../../../Context/Context"
import { useState } from "react"
import { useAddLeadToGroup } from "../../../data/queries/group.queries"
import { Spinner } from "react-bootstrap"

const AddNewStudents = ({
    addNewUser,
    setAddNewUser,
    searchLead,
    setNotif,
    id
}) => {

    const { mutate: addLeadToGroup, isPending: adding } = useAddLeadToGroup();

    const [selectedLead, setSelectedLead] = useState(null)

    const addLead = () => {
        addLeadToGroup(
            {
                id: selectedLead,
                group_id: Number(id)
            },
            {
                onSuccess: () => {
                    setNotif({ show: true, type: "success", message: "Guruhga yangi o'quvchi qo'shildi" })
                    setAddNewUser(false)
                    setSelectedLead(null)
                },
                onError: (err) => {
                    console.error(err)
                    setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                }
            }
        )
    }

    return (
        <Modal
            title="Guruhga yangi o'quvchi qo'shish"
            close={setAddNewUser}
            anima={addNewUser}
            width="35%"
            zIndex={100}
        >
            <ReactSelect
                label="O'quvchini Lidlar ro'yxatidan tanlang"
                containerClassName="mt-2"
                placeholder="Lidlarni qidirish..."
                menuPortalTarget={document.body}
                options={searchLead?.map(lead => ({
                    value: lead.id,
                    label: `${lead.first_name} ${lead.last_name} (${lead.phone})`,
                    ...lead
                }))}
                onChange={(option) => {
                    setSelectedLead(option.id)
                }}
            />

            <button
                className="btn btn-sm save-button align-self-end mt-3"
                disabled={!selectedLead}
                onClick={addLead}
            >
                {adding ? <Spinner animation="border" size="sm" /> : "Qo'shish"}
            </button>
        </Modal>
    )
}

export default AddNewStudents