import { useState } from "react";
import { useTeachersData } from "../../../data/queries/teachers.queries";
import { useCourses } from "../../../data/queries/courses.queries";
import { useCreateLead } from "../../../data/queries/leads.queries";
import { Input } from "../../../components/Ui/Input";
import SelectDay from "../../../components/Ui/SelectDay";
import { Spinner } from "react-bootstrap";
import Modal from "../../../components/Ui/Modal";

const sources = {
     "Instagram": "#ec4899",
     "Telegram": "#06b6d4",
     "Facebook": "#10b981",
     "Tavsiya": "#f59e0b",
     "Banner": "#2f871c",
}

const NewLead = ({ setNotif, show, setShow }) => {
     const { data: AllCoursesData } = useCourses();
     const coursesData = AllCoursesData?.results;

     const { mutate: createLead, isPending: creating } = useCreateLead();

     const [newLidData, setNewLidData] = useState({
          first_name: "",
          last_name: "",
          phone: "",
          course: "",
          source: "",
          status: "new",
          week_days: [],
          comment: "",
          parent_name: "",
          parent_phone: "",
          teacher: null, // Ustoz shart emas
     })

     const handleSubmit = (e) => {
          e.preventDefault()
          
          if (!(newLidData.first_name && newLidData.last_name && newLidData.phone)) {
               alert("Asosiy ma'lumotlar to'ldiring!");
               return;
          }

          // Backend kutayotgan formatga o'tkazamiz (string -> number)
          const payload = {
               ...newLidData,
               course: newLidData.course ? Number(newLidData.course) : null,
               source: newLidData.source ? Number(newLidData.source) : null,
               teacher: null, // Aniq null yuboramiz
               week_days: newLidData.week_days || [],
               create_at: new Date().toISOString()
          };

          createLead(
               payload,
               {
                    onSuccess: () => {
                         setNewLidData({
                              first_name: "",
                              last_name: "",
                              phone: "",
                              course: "",
                              source: "",
                              status: "new",
                              week_days: [],
                              comment: "",
                              parent_name: "",
                              parent_phone: "",
                              teacher: null,
                         })
                         setNotif({ show: true, type: 'success', message: "Yangi lid muvaffaqiyatli qo'shildi" })
                         setShow(false)
                    },
                    onError: (err) => {
                         console.error("Xatolik tafsiloti:", err.response?.data);
                         setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi! Ma'lumotlarni tekshiring." })
                    }
               }
          )
     }

     return (
          <Modal
               title="Yangi lid qo'shish"
               close={setShow}
               anima={show}
               width="50%"
               zIndex={100}
          >
               <form onSubmit={handleSubmit} className="d-flex form-control flex-column mt-3">
                    <div className="row">
                         <Input
                              label="Ism *"
                              placeholder="Ism..."
                              containerClassName="col"
                              value={newLidData.first_name}
                              onChange={(e) => setNewLidData({ ...newLidData, first_name: e.target.value })}
                         />
                         <Input
                              label="Familiya *"
                              placeholder="Familiya..."
                              containerClassName="col"
                              value={newLidData.last_name}
                              onChange={(e) => setNewLidData({ ...newLidData, last_name: e.target.value })}
                         />
                         <Input
                              label="Telifon raqam *"
                              placeholder="Raqam..."
                              containerClassName="col"
                              value={newLidData.phone}
                              onChange={(e) => setNewLidData({ ...newLidData, phone: e.target.value })}
                         />
                    </div>

                    <div className="row">
                         <div className="col d-flex flex-column">
                              <label htmlFor="course" className="form-label">Kurs</label>
                              <select
                                   id="course"
                                   className="form-select"
                                   value={newLidData.course}
                                   onChange={(e) => setNewLidData({ ...newLidData, course: e.target.value })}
                              >
                                   <option value="">Kurs tanlash</option>
                                   {coursesData?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                   ))}
                              </select>
                         </div>

                         <div className="col d-flex flex-column">
                              <label htmlFor="days" className="form-label">Dars kunlari</label>
                              <SelectDay
                                   data={newLidData}
                                   setData={setNewLidData}
                                   field="week_days"
                              />
                         </div>
                    </div>

                    <div className="row mt-3">
                         <div className="col d-flex flex-column">
                              <label htmlFor="source" className="form-label">Manba</label>
                              <select
                                   id="source"
                                   className="form-select"
                                   value={newLidData.source}
                                   onChange={(e) => setNewLidData({ ...newLidData, source: e.target.value })}
                              >
                                   <option value="">Bizni qanday topdingiz?</option>
                                   {Object.keys(sources).map((s, i) => (
                                        <option key={s} value={i + 1}>{s}</option>
                                   ))}
                              </select>
                         </div>
                    </div>

                    <div className="row mt-3">
                         <Input
                              label="Ota-onasining ismi"
                              placeholder="Ism..."
                              value={newLidData.parent_name}
                              containerClassName="col"
                              onChange={(e) => setNewLidData({ ...newLidData, parent_name: e.target.value })}
                         />
                         <Input
                              label="Ota-onasining telifon raqami"
                              placeholder="Raqam..."
                              value={newLidData.parent_phone}
                              containerClassName="col"
                              onChange={(e) => setNewLidData({ ...newLidData, parent_phone: e.target.value })}
                         />
                    </div>

                    <div className="row mt-1">
                         <div className="col-6">
                              <label htmlFor="desc" className="form-label">Izoh</label>
                              <textarea
                                   id="desc"
                                   placeholder="Izoh..."
                                   value={newLidData.comment}
                                   className="form-control"
                                   style={{ resize: "none", height: "80px" }}
                                   onChange={(e) => setNewLidData({ ...newLidData, comment: e.target.value })}
                              />
                         </div>
                    </div>

                    <div className="d-flex align-self-end my-3">
                         <button
                              type="submit"
                              style={{ background: "#0085db" }}
                              disabled={!(newLidData.first_name && newLidData.last_name && newLidData.phone) || creating}
                              className="btn btn-sm px-3 py-2 fs-3 text-white"
                         >
                              {creating ? <Spinner animation="border" size="sm" /> : "Saqlash"}
                         </button>
                    </div>
               </form>
          </Modal>
     )
}

export default NewLead