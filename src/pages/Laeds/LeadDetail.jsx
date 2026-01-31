import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import Modal from "../../components/Ui/Modal"
import { useLead, useLeadHistory, useUpdateLead, useDeleteLead } from "../../data/queries/leads.queries";
import { Card, Button, Row, Col, Badge, ListGroup, Form, Spinner, Dropdown } from "react-bootstrap";
import Notification from "../../components/Ui/Notification";
import Back from "../../components/Ui/Back";
import { useGroups } from "../../data/queries/group.queries";

const LeadDetail = () => {
     const { id } = useParams()
     const navigate = useNavigate()
     const [notif, setNotif] = useState({ show: false, type: 'success', message: '' })

     const { data: groups } = useGroups();
     const { data: lead, isLoading, error } = useLead(id);
     const { data: history, isLoading: isHistoryLoading } = useLeadHistory(id);
     const deleteLeadMutation = useDeleteLead();

     const [addGroup, setAddGroup] = useState(false)
     const [removeLead, setRemoveLead] = useState(false)
     const [editLead, setEditLead] = useState(false)
     const [selectedGroup, setSelectedGroup] = useState("")

     const updateLeadMutation = useUpdateLead();

     if (isLoading) return (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
               <Spinner animation="border" variant="primary" />
          </div>
     )

     if (error) return (
          <div className="container mt-5 text-center">
               <div className="alert alert-danger shadow-sm border-0 d-inline-block px-5 py-4 rounded-4">
                    <Icon icon="material-symbols:error-outline" width="48" className="mb-3" />
                    <h4 className="mb-2">Xatolik yuz berdi</h4>
                    <p className="mb-0 text-muted">{error.message}</p>
               </div>
               <div className="mt-4">
                    <Button variant="outline-light" onClick={() => navigate(-1)} className="rounded-pill px-4 py-2 border-opacity-25">
                         <Icon icon="material-symbols:arrow-back-rounded" /> Ortga qaytish
                    </Button>
               </div>
          </div>
     )

     const handleRemoveLead = () => {
          deleteLeadMutation.mutate(id, {
               onSuccess: () => {
                    navigate("/leads")
               }
          });
     }

     const getStatusBadge = (status) => {
          // If status is an object, try to get its code or name
          const statusValue = typeof status === 'object' ? (status?.code || status?.name || status?.id) : status;

          const statusMap = {
               'new': { label: 'Yangi', color: '#0dcaf0', icon: 'qlementine-icons:new-16' },
               'registered': { label: 'Tastiqlangan', color: '#198754', icon: 'material-symbols:check-circle-outline' },
               'lost': { label: 'Bekor qilingan', color: '#dc3545', icon: 'material-symbols:cancel-outline' },
               'contacted': { label: "Bog'lanilgan", color: '#6610f2', icon: 'material-symbols:call-made' },
          };

          const s = statusMap[statusValue] || {
               label: typeof status === 'object' ? (status?.name || status?.code || 'Noaniq') : (status || 'Noaniq'),
               color: '#6c757d',
               icon: 'material-symbols:help-outline'
          };

          return (
               <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ background: `${s.color}50`, color: s.color, border: `1px solid ${s.color}40`, fontSize: '0.85rem', fontWeight: '600' }}>
                    <Icon icon={s.icon} />
                    {String(s.label)}
               </div>
          );
     }

     const formatDate = (dateString) => {
          if (!dateString) return 'Aniqlanmagan';
          return new Date(dateString).toLocaleString('uz-UZ', {
               day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
          });
     }

     const glassStyle = {
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          color: "white"
     };

     const addGroupToLead = () => {
          updateLeadMutation.mutate({ id, data: { group: selectedGroup } }, {
               onSuccess: () => {
                    setAddGroup(false);
                    setNotif({ show: true, type: 'success', message: 'Lid guruhga muvaffaqiyatli qo\'shildi' });
               },
               onError: (err) => {
                    setNotif({ show: true, type: 'error', message: err.message || 'Xatolik yuz berdi' });
               }
          });
     }

     return (
          <div className="container-fluid p-4" style={{ color: '#e2e2e2' }}>
               {/* Notification */}
               {notif.show && (
                    <Notification
                         type={notif.type}
                         message={notif.message}
                         onClose={() => setNotif({ ...notif, show: false })}
                    />
               )}

               {/* Modal for adding group */}
               {addGroup &&
                    <Modal
                         title="Guruhga qo'shish"
                         close={() => setAddGroup(false)}
                         anima={addGroup}
                         width="400px"
                    >
                         <div className="p-3">
                              <label htmlFor="group" className="form-label text-white-50 small mb-2">Guruhni tanlang</label>
                              <select
                                   id="group"
                                   className="form-select bg-dark text-white border-secondary"
                                   onChange={(e) => setSelectedGroup(e.target.value)}
                              >
                                   <option hidden value="">Guruhni tanlang</option>
                                   {groups?.map((group) => (
                                        <option key={group.id} value={group.id}>
                                             {group.name}
                                        </option>
                                   ))}
                              </select>
                              <div className="mt-4 d-flex justify-content-end gap-2">
                                   <Button variant="link" className="text-white-50 text-decoration-none" onClick={() => setAddGroup(false)}>
                                        Bekor qilish
                                   </Button>
                                   <Button
                                        variant="primary"
                                        className="px-4 btn-sm shadow-sm"
                                        style={{ background: '#0085db', border: 'none' }}
                                        onClick={addGroupToLead}
                                        disabled={updateLeadMutation.isPending}
                                   >
                                        {updateLeadMutation.isPending ? <Spinner size="sm" animation="border" /> : "Saqlash"}
                                   </Button>
                              </div>
                         </div>
                    </Modal>
               }

               {/* Modal for removing lead */}
               {removeLead &&
                    <Modal
                         title="O'quvchini ro'yhatdan o'chirish"
                         close={() => setRemoveLead(false)}
                         anima={removeLead}
                         width="400px"
                    >
                         <div className="p-3">
                              <div className="text-center mb-4">
                                   <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 mb-3">
                                        <Icon icon="material-symbols:delete-outline" width="32" className="text-danger" />
                                   </div>
                                   <h5>Ishonchingiz komilmi?</h5>
                                   <p className="text-white-50 small">Siz bu lidni ro'yxatdan butunlay o'chirib yubormoqchisiz. Bu amalni ortga qaytarib bo'lmaydi.</p>
                              </div>
                              <div className="d-flex justify-content-center gap-2">
                                   <Button variant="secondary" className="px-4 rounded-pill bg-opacity-50" onClick={() => setRemoveLead(false)}>
                                        Bekor qilish
                                   </Button>
                                   <Button variant="danger" className="px-4 rounded-pill shadow-sm" onClick={handleRemoveLead}>
                                        O'chirish
                                   </Button>
                              </div>
                         </div>
                    </Modal>
               }

               <Back style={{ transform: "translate(-10px, -20px)" }} />

               {/* Top Navigation & Actions */}
               <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-white border-opacity-10">
                    <div>
                         <h5 className="mb-0 fw-bold">Lid tafsilotlari</h5>
                         <small className="text-white-50">Lid barcha ma'lumotlari va tarixi</small>
                    </div>
                    <div className="d-flex gap-2">
                         <button
                              className="btn py-2 px-3 fs-3 button-delate"
                              style={{ border: "2px solid #cd3232", color: "#cd3232" }}
                              onClick={() => setRemoveLead(true)}
                         >
                              <Icon icon="iconamoon:trash" width="24" className="me-1" height="24" />
                              O'chirish
                         </button>
                         <Button
                              variant="primary"
                              className="rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                              style={{ background: 'linear-gradient(45deg, #0085db, #00c8ff)', border: 'none' }}
                              onClick={() => setAddGroup(true)}
                         >
                              <Icon icon="material-symbols:group-add-outline" width="18" />
                              <span className="d-none d-md-inline">Guruhga qo'shish</span>
                         </Button>
                    </div>
               </div>

               <Row className="g-4">
                    {/* Left Column - Main Details */}
                    <Col lg={8}>
                         {/* Profile Header Card */}
                         <Card style={glassStyle} className="mb-4 overflow-hidden border-0 shadow-lg">
                              <div style={{ height: '80px', background: 'linear-gradient(90deg, #0085db30, #00c8ff30)' }}></div>
                              <Card.Body className="position-relative pt-0 px-4">
                                   <div className="position-relative" style={{ marginTop: '-40px' }}>
                                        <div className="d-flex flex-column flex-md-row align-items-end gap-3 mb-3">
                                             <div className="rounded-circle overflow-hidden border border-4 border-dark shadow-lg bg-secondary d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', fontSize: '2.5rem', background: 'linear-gradient(45deg, #2b364c, #1a2233)' }}>
                                                  {lead?.first_name?.charAt(0)}{lead?.last_name?.charAt(0)}
                                             </div>
                                             <div className="flex-grow-1 mb-2">
                                                  <div className="d-flex align-items-center gap-3">
                                                       <h2 className="mb-0 fw-bold">{lead?.first_name} {lead?.last_name}</h2>
                                                       {getStatusBadge(lead?.status)}
                                                  </div>
                                                  <div className="text-white-50 d-flex align-items-center gap-2 mt-1">
                                                       <Icon icon="material-symbols:calendar-today-outline" />
                                                       <span>Qo'shildi: {new Date(lead?.created_at).toLocaleDateString()}</span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <hr className="my-4 border-white border-opacity-10" />

                                   <Row className="py-2">
                                        <Col md={4} className="mb-3 mb-md-0 border-end border-white border-opacity-10">
                                             <div className="d-flex flex-column">
                                                  <span className="text-white-50 small mb-1">Telifon raqam</span>
                                                  <a href={`tel:${lead?.phone}`} className="text-white text-decoration-none fw-semibold d-flex align-items-center gap-2">
                                                       <Icon icon="material-symbols:call" className="text-primary" />
                                                       {lead?.phone}
                                                  </a>
                                             </div>
                                        </Col>
                                        <Col md={4} className="mb-3 mb-md-0 border-end border-white border-opacity-10">
                                             <div className="d-flex flex-column">
                                                  <span className="text-white-50 small mb-1">Kurs</span>
                                                  <span className="fw-semibold d-flex align-items-center gap-2 text-warning">
                                                       <Icon icon="material-symbols:school-outline" />
                                                       {lead?.course?.name || "Tanlanmagan"}
                                                  </span>
                                             </div>
                                        </Col>
                                        <Col md={4}>
                                             <div className="d-flex flex-column">
                                                  <span className="text-white-50 small mb-1">O'qituvchi</span>
                                                  <span className="fw-semibold d-flex align-items-center gap-2">
                                                       <Icon icon="material-symbols:person-outline" className="text-success" />
                                                       {lead?.teacher?.first_name ? `${lead?.teacher?.first_name} ${lead?.teacher?.last_name}` : "Tayinlanmagan"}
                                                  </span>
                                             </div>
                                        </Col>
                                   </Row>
                              </Card.Body>
                         </Card>

                         {/* Timeline / Activity */}
                         <Card style={glassStyle} className="border-0 shadow-sm">
                              <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3 d-flex justify-content-between align-items-center">
                                   <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                        <Icon icon="material-symbols:history-rounded" className="text-primary" width="20" />
                                        Harakatlar tarixi
                                   </h6>
                                   <Button variant="link" className="text-white-50 text-decoration-none p-0 small">
                                        Barchasini ko'rish
                                   </Button>
                              </Card.Header>
                              
                              <Card.Body className="px-4 py-4">
                                   {isHistoryLoading ? (
                                        <div className="text-center py-4"><Spinner size="sm" animation="border" /></div>
                                   ) : history && history.length > 0 ? (
                                        <div className="timeline">
                                             {history.map((item, idx) => (
                                                  <div key={idx} className="position-relative ps-4 pb-4 timeline-item">
                                                       <div className="position-absolute start-0 top-0 mt-1 rounded-circle bg-primary shadow" style={{ width: '12px', height: '12px', marginLeft: '-6px', zIndex: 1 }}></div>
                                                       {idx !== history.length - 1 && <div className="position-absolute start-0 h-100 border-start border-primary border-opacity-25" style={{ top: '12px', marginLeft: '-1px' }}></div>}
                                                       <div className="small text-white-50 mb-1">{formatDate(item.created_at)}</div>
                                                       <div className="fw-semibold mb-1">{item.title || "Status o'zgartirildi"}</div>
                                                       <div className="text-white-50 small">{item.comment || "Tafsilotlar mavjud emas"}</div>
                                                       {item.status && <div className="mt-2">{getStatusBadge(item.status)}</div>}
                                                  </div>
                                             ))}
                                        </div>
                                   ) : (
                                        <div className="text-center py-5 text-white-50">
                                             <Icon icon="material-symbols:history-off" width="48" className="mb-2 opacity-25" />
                                             <p className="mb-0">Hozircha hech qanday harakat qayd etilmagan</p>
                                        </div>
                                   )}
                              </Card.Body>
                         </Card>
                    </Col>

                    {/* Right Column - Sidebar Info */}
                    <Col lg={4}>
                         {/* Other Info */}
                         <Card style={glassStyle} className="mb-4 border-0 shadow-sm overflow-hidden">
                              <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3">
                                   <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                        <Icon icon="material-symbols:info-outline" className="text-info" width="20" />
                                        Qo'shimcha ma'lumotlar
                                   </h6>
                              </Card.Header>
                              <ListGroup variant="flush">
                                   <ListGroup.Item className="bg-transparent border-white border-opacity-10 py-3">
                                        <div className="text-white-50 small mb-1">Ota-onasi</div>
                                        <div className="fw-semibold">{lead?.parent_name || 'Ma\'lumot yo\'q'}</div>
                                   </ListGroup.Item>
                                   <ListGroup.Item className="bg-transparent border-white border-opacity-10 py-3">
                                        <div className="text-white-50 small mb-1">Ota-onasi raqami</div>
                                        <div className="fw-semibold">
                                             {lead?.parent_phone ? (
                                                  <a href={`tel:${lead.parent_phone}`} className="text-white text-decoration-none d-flex align-items-center gap-2">
                                                       <Icon icon="material-symbols:call-outline" size="sm" />
                                                       {lead.parent_phone}
                                                  </a>
                                             ) : 'Ma\'lumot yo\'q'}
                                        </div>
                                   </ListGroup.Item>
                                   <ListGroup.Item className="bg-transparent border-white border-opacity-10 py-3">
                                        <div className="text-white-50 small mb-1">Kelish manbasi</div>
                                        <div className="d-flex align-items-center gap-2">
                                             <Icon icon="material-symbols:share-outline" />
                                             <span className="fw-semibold">
                                                  {lead?.source?.name}
                                             </span>
                                        </div>
                                   </ListGroup.Item>
                                   <ListGroup.Item className="bg-transparent border-white border-opacity-10 py-3">
                                        <div className="text-white-50 small mb-1">Dars kunlari</div>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                             {lead?.week_days && lead.week_days.length > 0 ? (
                                                  lead.week_days.map((day, dIdx) => (
                                                       <Badge key={dIdx} bg="dark" className="border border-white border-opacity-10 fw-normal">
                                                            {day?.code || dIdx}
                                                       </Badge>
                                                  ))
                                             ) : (
                                                  <span className="text-white-50 small">Belgilanmagan</span>
                                             )}
                                        </div>
                                   </ListGroup.Item>
                              </ListGroup>
                         </Card>

                         {/* Notes / Admin Comment */}
                         <Card style={glassStyle} className="border-0 shadow-sm">
                              <Card.Header className="bg-transparent border-bottom border-white border-opacity-10 py-3 d-flex justify-content-between align-items-center">
                                   <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                        <Icon icon="material-symbols:notes-rounded" className="text-warning" width="20" />
                                        Admin izohi
                                   </h6>
                                   <Icon icon="material-symbols:edit-outline" role="button" className="text-white-50 hover-text-white" />
                              </Card.Header>
                              <Card.Body>
                                   <div className="p-3 rounded-4 bg-dark bg-opacity-25 border border-white border-opacity-10">
                                        <p className="mb-0 small line-height-lg text-white-50 italic">
                                             {lead?.comment ? `"${lead.comment}"` : "Hali hech qanday izoh qoldirilmagan. Lid bilan bog'laning va tafsilotlarni bu yerga yozing."}
                                        </p>
                                   </div>
                                   <Button variant="link" className="text-primary text-decoration-none small mt-3 w-100 text-center fw-semibold">
                                        Yangi izoh qo'shish
                                   </Button>
                              </Card.Body>
                         </Card>
                    </Col>
               </Row>

               {/* Custom Styles for Timeline */}
               <style>{`
                    .timeline-item::after {
                         content: '';
                         clear: both;
                         display: table;
                    }
                    .hover-bg-light:hover {
                         background: rgba(255, 255, 255, 0.1) !important;
                    }
                    .hover-text-white:hover {
                         color: white !important;
                    }
               `}</style>
          </div>
     );
}

export default LeadDetail
