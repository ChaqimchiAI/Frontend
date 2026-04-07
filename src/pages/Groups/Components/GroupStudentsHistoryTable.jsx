import { Icon } from "@iconify/react";
import { Badge, Button, Table, Spinner } from "react-bootstrap";
import { useGroupStudentStatusChange } from "../../../data/queries/group.queries";
import { useTheme } from "../../../Context/Context";

const GroupStudentsHistoryTable = ({ historyStudents, groupId, setNotif }) => {
     const { theme } = useTheme();
     const { mutate: changeStatus, isLoading } = useGroupStudentStatusChange();

     const getStatusLabel = (status) => {
          switch (status) {
               case "left":
                    return <Badge bg="danger">Tark etgan</Badge>;
               case "frozen":
                    return <Badge bg="warning" text="dark">Muzlatilgan</Badge>;
               case "finished":
                    return <Badge bg="success">Tugallangan</Badge>;
               default:
                    return <Badge bg="secondary">{status}</Badge>;
          }
     };

     const restoreStudent = (studentId) => {
          if (!window.confirm("O'quvchini haqiqatan ham ushbu guruhga faol o'quvchi sifatida qaytarmoqchimisiz?")) {
               return;
          }

          changeStatus(
               { student_id: studentId, group_id: groupId, status: "active" },
               {
                    onSuccess: () => {
                         setNotif({ show: true, type: "success", message: "O'quvchi guruhga qaytarildi!" });
                    },
                    onError: (err) => {
                         console.error(err);
                         setNotif({ show: true, type: "error", message: "Xatolik yuz berdi" });
                    }
               }
          );
     };

     const formatDate = (dateString) => {
          if (!dateString) return "—";
          return new Date(dateString).toLocaleDateString("ru-RU", {
               day: "2-digit",
               month: "2-digit",
               year: "numeric"
          });
     };

     if (!historyStudents?.length) {
          return (
               <div className="text-center py-5 opacity-50">
                    <Icon icon="solar:users-group-rounded-broken" width="48" className="mb-3" />
                    <p>Ushbu guruhdan chiqib ketgan o'quvchilar yo'q</p>
               </div>
          );
     }

     return (
          <div className="table-responsive mt-3">
               <Table hover variant={!theme ? "dark" : ""} className="align-middle">
                    <thead>
                         <tr>
                              <th className="py-3 px-3">#</th>
                              <th className="py-3 px-3">Ism Familiya</th>
                              <th className="py-3 px-3">Telefon raqam</th>
                              <th className="py-3 px-3">Holati</th>
                              <th className="py-3 px-3">Sababi</th>
                              <th className="py-3 px-3">Qo'shilgan</th>
                              <th className="py-3 px-3">Chiqib ketgan</th>
                              <th className="py-3 px-3 text-end">Amallar</th>
                         </tr>
                    </thead>
                    <tbody>
                         {historyStudents.map((s, index) => (
                              <tr key={s.id}>
                                   <td className="px-3 py-3" style={{ width: "5%" }}>{index + 1}</td>
                                   <td className="px-3" style={{ width: "25%" }}>
                                        <div className="d-flex align-items-center gap-2 font-weight-medium">
                                             <div
                                                  className="rounded-circle d-flex align-items-center justify-content-center text-white p-2 border"
                                                  style={{ background: "linear-gradient(45deg, #0981c2, #00c8ff)", width: "38px", height: "38px" }}
                                             >
                                                  {s.first_name?.charAt(0)}{s.last_name?.charAt(0)}
                                             </div>
                                             {s.first_name} {s.last_name}
                                        </div>
                                   </td>
                                   <td className="px-3 font-monospace">{s.phone}</td>
                                   <td className="px-3">{getStatusLabel(s.status)}</td>
                                   <td className="px-3 text-muted" style={{ maxWidth: "150px", whiteSpace: "normal" }}>
                                        {s.left_reason ? (
                                             <span style={{ fontSize: "0.85rem" }}>{s.left_reason}</span>
                                        ) : (
                                             <span className="text-muted opacity-50">—</span>
                                        )}
                                   </td>
                                   <td className="px-3 text-muted">{formatDate(s.joined_date)}</td>
                                   <td className="px-3 text-muted">{formatDate(s.left_date)}</td>
                                   <td className="px-3 text-end">
                                        <Button
                                             variant="outline-primary"
                                             size="sm"
                                             onClick={() => restoreStudent(s.id)}
                                             disabled={isLoading}
                                             className="d-inline-flex align-items-center gap-2 shadow-sm rounded-pill px-3"
                                        >
                                             <Icon icon="material-symbols:settings-backup-restore-rounded" width="18" />
                                             Guruhga qaytarish
                                        </Button>
                                   </td>
                              </tr>
                         ))}
                    </tbody>
               </Table>
          </div>
     );
};

export default GroupStudentsHistoryTable;
