import { Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useCreateRoom, useDeleteRoom, useEditRoom, useRoomsData } from "../../data/queries/room.queries";
import DataTable from "../../components/Ui/DataTable";
import Modal from "../../components/Ui/Modal";
import { Input } from "../../components/Ui/Input"
import { useState } from "react";
import { useTheme } from "../../Context/Context";
import Notification from "../../components/Ui/Notification";
import { useBranchesData } from "../../data/queries/branches.queries";

const Rooms = () => {
    const { theme } = useTheme()
    const { data: rooms, isLoading: getting, error: gettingError } = useRoomsData();
    const { mutate: createRoom, isPending: creating } = useCreateRoom()
    const { data: branches, } = useBranchesData();
    const { mutate: deleteRoom, isPending: deleting } = useDeleteRoom()

    const roomsData = rooms?.results || [];
    const branchesData = branches?.results || [];
    

    const [addRoom, setAddRoom] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false); // O'chirish modali uchun state

    const [notif, setNotif] = useState({ show: false, type: "", message: "" });

    const [roomForm, setRoomForm] = useState({
        name: "",
        capacity: "",
        branch: "",
        description: ""
    });

    const { mutate: editRoom, isPending: editing } = useEditRoom(selectedId)
    const isLoading = creating || editing;

    // Tahrirlash bosilganda
    const handleEditClick = (room) => {
        setIsEdit(true);
        setSelectedId(room.id);
        setRoomForm({
            name: room.name,
            capacity: room.capacity,
            branch: room.branch,
            description: room.description || ""
        });
        setAddRoom(true);
    };

    // Saqlash (Edit va Create)
    const handleSave = (e) => {
        e.preventDefault();
        if (!roomForm.name || !roomForm.capacity || !roomForm.branch) {
            setNotif({ show: true, type: "error", message: "Majburiy maydonlarni to'ldiring!" });
            return;
        }

        const mutationOptions = {
            onSuccess: () => {
                setAddRoom(false);
                setIsEdit(false);
                setRoomForm({ name: "", capacity: "", branch: "", description: "" });
                setNotif({ show: true, type: "success", message: `Xona muvaffaqiyatli ${isEdit ? "o'zgartirildi!" : "qo'shildi!"}` });
            },
            onError: (err) => {
                console.log(err);
                setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" })
            }
        };

        if (isEdit) {
            editRoom({ id: selectedId, data: roomForm }, mutationOptions);
        } else {
            createRoom(roomForm, mutationOptions);
        }
    };

    // O'chirishni boshlash
    const openDeleteModal = (id) => {
        setSelectedId(id);
        setDeleteModal(true);
    };

    // O'chirishni tasdiqlash
    const handleConfirmDelete = () => {
        deleteRoom(selectedId, {
            onSuccess: () => {
                setDeleteModal(false);
                setNotif({ show: true, type: "deleted", message: "Xona o'chirildi!" });
            },
            onError: (err) => {
                setDeleteModal(false);
                setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" })
            }
        });
    }

    if (getting) return (
        <div className="d-flex justify-content-center p-5">
            <Spinner animation="border" variant="primary" />
        </div>
    );

    if (gettingError) return (
        <div className="text-center text-danger p-4">{gettingError.message}</div>
    );

    return (
        <>
            {notif.show && <Notification
                type={notif.type}
                message={notif.message}
                onClose={() => setNotif({ ...notif, show: false })}
            />}

            {/* Qo'shish va Tahrirlash Modali */}
            {addRoom &&
                <Modal
                    anima={addRoom}
                    close={() => { setAddRoom(false); setIsEdit(false); setRoomForm({ name: "", capacity: "", branch: "", description: "" }); }}
                    title={isEdit ? "Xonani tahrirlash" : "Yangi xona qo'shish"}
                    width="35%"
                    zIndex={100}
                >
                    <form onSubmit={handleSave} className="p-2">
                        <Input
                            required
                            label="Xona nomi *"
                            placeholder="Nomi"
                            containerClassName="mb-3"
                            value={roomForm.name}
                            onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                        />

                        <div className="d-flex gap-3 mb-3">
                            <Input
                                required
                                type="number"
                                label="Sig'imi (kishi) *"
                                placeholder="Soni"
                                containerClassName="w-50"
                                value={roomForm.capacity}
                                onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                            />
                            <div className="d-flex flex-column w-50">
                                <label className="form-label" htmlFor="branch">Filial * </label>
                                <select
                                    required
                                    id="branch"
                                    className="form-select"
                                    value={roomForm.branch}
                                    onChange={(e) => setRoomForm({ ...roomForm, branch: e.target.value })}
                                >
                                    <option hidden value="">Tanlang</option>
                                    {branchesData.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Input
                            label="Tavsif"
                            placeholder="Qisqacha ma'lumot..."
                            containerClassName="mb-4"
                            value={roomForm.description}
                            onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                        />

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-sm px-4 py-2 text-black"
                                style={{ background: "#c5c5c5" }}
                                onClick={() => setAddRoom(false)}
                            >
                                Orqaga
                            </button>
                            <button
                                type="submit"
                                className="btn btn-sm text-white px-4 py-2"
                                style={{ background: "#0085DB" }}
                                disabled={isLoading}
                            >
                                {isLoading ? <Spinner animation="border" size="sm" /> : (isEdit ? "Saqlash" : "Qo'shish")}
                            </button>
                        </div>
                    </form>
                </Modal>
            }

            {/* O'chirishni tasdiqlash modali */}
            {deleteModal &&
                <Modal
                    anima={deleteModal}
                    close={setDeleteModal}
                    title="O'chirishni tasdiqlash"
                    width="30%"
                    zIndex={110}
                >
                    <p className="text-muted">Haqiqatdan ham ushbu xonani o'chirmoqchimisiz?</p>
                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <button
                            className="btn btn-sm px-4 py-2 text-black"
                            style={{ background: "#c5c5c5" }}
                            onClick={() => setDeleteModal(false)}
                        >
                            Orqaga
                        </button>
                        <button
                            className="btn btn-sm text-white px-4 py-2 border-0"
                            style={{ background: "#cd3232" }}
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? <Spinner animation="border" size="sm" /> : "Ha"}
                        </button>
                    </div>
                </Modal>
            }

            <div className="card card-body p-3" style={{ minHeight: "80vh" }}>
                <DataTable
                    title="Xonalar"
                    data={roomsData}
                    columns={["№", "Xona nomi", "Filial", "Sig'imi", "Tavsif", "Amallar"]}
                    searchKeys={["name", "branch_name", "description"]}
                    button={
                        <button
                            className="btn btn-sm text-white py-2 px-3 mb-3"
                            style={{ background: "#0085DB", borderRadius: "8px" }}
                            onClick={() => { setIsEdit(false); setAddRoom(true); }}
                        >
                            <span>
                                <Icon icon="mdi:plus" className="me-2" fontSize={20} />
                            </span>
                            Yangi qo'shish
                        </button>
                    }
                >
                    {(currentRooms) =>
                        currentRooms.map((room, index) => (
                            <tr key={room.id} className="align-middle">
                                <td className="text-secondary">{index + 1}</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="p-2 rounded-3 me-3"
                                            style={{ background: "rgba(0, 133, 219, 0.1)", color: "#0085DB" }}
                                        >
                                            <Icon icon="solar:bed-bold-duotone" width="24" height="24" />
                                        </div>
                                        <span className={`fw-bold ${!theme ? "text-white" : "text-dark"}`}>{room.name}</span>
                                    </div>
                                </td>
                                <td>{room.branch_name}</td>
                                <td>
                                    <span className="badge bg-opacity-10 bg-info text-info px-3 py-2">
                                        {room.capacity} kishi
                                    </span>
                                </td>
                                <td className="text-muted small">
                                    {room.description || "Izoh yo'q"}
                                </td>
                                <td className="">
                                    <button
                                        title="Tahrirlash"
                                        className="rounded-3 border me-2 "
                                        style={{ background: !theme ? "#15263a" : "#f5f5f5" }}
                                        onClick={() => handleEditClick(room)}
                                    >
                                        <Icon icon="lucide:edit" color="#fca130" />
                                    </button>
                                    <button
                                        title="O'chirish"
                                        className="rounded-3 border"
                                        style={{ background: !theme ? "#15263a" : "#f5f5f5" }}
                                        onClick={() => openDeleteModal(room.id)}
                                    >
                                        <Icon icon="mdi:trash-can-outline" color="#cd3232" className="fs-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </DataTable>
            </div>
        </>
    );
};

export default Rooms;