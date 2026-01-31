import { useState } from "react";
import { useTeachersData } from "../../../data/queries/teachers.queries";
import { useCourses } from "../../../data/queries/courses.queries";
import { useCreateLead } from "../../../data/queries/leads.queries";
import { Input } from "../../../components/Ui/Input";
import SelectDay from "../../../components/Ui/SelectDay";
import { Spinner } from "react-bootstrap";

const d = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"]

const sources = {
     "Instagram": "#ec4899",
     "Telegram": "#06b6d4",
     "Facebook": "#10b981",
     "Tavsiya": "#f59e0b",
     "Banner": "#2f871c",
}

const date = new Date()

const NewLead = ({ setNotif }) => {

     const { data: AllTeacherData } = useTeachersData();
     const { data: AllCoursesData } = useCourses();

     const teacherData = AllTeacherData?.results
     const coursesData = AllCoursesData?.results

     // yangi lid yaratish uchun
     const { mutate: createLead, isPending: creating } = useCreateLead();


     const [newLidData, setNewLidData] = useState({
          first_name: "",
          last_name: "",
          phone: "",
          course: 0,
          source: "",
          status: "new",
          create_at: date,
          week_days: [],
          comment: "",
          parent_name: "",
          parent_phone: "",
          teacher: "",
          updated_at: null,
          deleted_at: null
     })

     // Yangi lid qoshish
     const handleSubmit = (e) => {
          e.preventDefault()
          if (!(newLidData.first_name && newLidData.last_name && newLidData.phone && newLidData.course && newLidData.source && newLidData.teacher && newLidData.week_days)) {
               alert("Asosiy ma'lumotlar to'ldiring!");
               return;
          }

          console.log(newLidData);


          createLead(
               newLidData,
               {
                    onSuccess: () => {
                         setNewLidData({
                              first_name: "",
                              last_name: "",
                              phone: "",
                              course: 0,
                              source: "",
                              status: "new",
                              create_at: date,
                              week_days: [],
                              comment: "",
                              parent_name: "",
                              parent_phone: "",
                              teacher: "",
                         })

                         // bidirishnoma
                         setNotif({ show: true, type: 'success', message: "Yangi lid muvoffaqyatli qo'shildi" })
                    },
                    onError: (err) => {
                         console.error(err)
                         setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                    }
               }
          )

     }

     return (
          <>
               <div className="d-flex flex-column gap-1">
                    <h4 className="fs-6">
                         Yangi lid qo'shish
                    </h4>
                    <span className="text-muted">
                         Yangi lid ma'lumotlarini kiritish
                    </span>
               </div>

               <form
                    onSubmit={handleSubmit}
                    className="d-flex form-control flex-column mt-3"
               >
                    <div className="row">
                         <Input
                              label="Ism"
                              placeholder="Ism..."
                              containerClassName="col"
                              value={newLidData.first_name}
                              onChange={(e) => setNewLidData({ ...newLidData, first_name: e.target.value })}
                         />
                         <Input
                              label="Familiya"
                              placeholder="Familiya..."
                              containerClassName="col"
                              value={newLidData.last_name}
                              onChange={(e) => setNewLidData({ ...newLidData, last_name: e.target.value })}
                         />
                         <Input
                              label="Telifon raqam"
                              placeholder="Raqam..."
                              containerClassName="col"
                              value={newLidData.phone}
                              onChange={(e) => setNewLidData({ ...newLidData, phone: e.target.value })}
                         />
                    </div>

                    <div className="row">
                         <div className="col d-flex flex-column">
                              <label htmlFor="course" className="form-label">
                                   Kurs
                              </label>
                              <select
                                   id="course"
                                   className="form-select"
                                   value={newLidData.course}
                                   onChange={(e) => setNewLidData({ ...newLidData, course: e.target.value })}
                              >
                                   <option hidden>Kurs tanlash</option>

                                   {coursesData?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                   ))}
                              </select>
                         </div>
                         <div className="col d-flex flex-column">
                              <label htmlFor="teacher" className="form-label">O'qituvchi</label>
                              <select
                                   id="teacher"
                                   className="form-select"
                                   value={newLidData.teacher}
                                   onChange={(e) => setNewLidData({ ...newLidData, teacher: e.target.value })}
                              >
                                   <option hidden value="">O'qituvchi tanlash</option>

                                   {teacherData?.map(t => (
                                        <option key={t.id} value={t.id}>{t.first_name} {" "} {t.last_name}</option>
                                   ))}
                              </select>
                         </div>
                    </div>

                    <div className="row mt-3">
                         <div className="col d-flex flex-column">
                              <label htmlFor="days" className="form-label">
                                   Dars Kunlari
                              </label>
                              <SelectDay
                                   data={newLidData}
                                   setData={setNewLidData}
                                   field="week_days"
                              />
                         </div>

                         <div className="col d-flex flex-column">
                              <label htmlFor="source" className="form-label">Manba</label>
                              <select
                                   id="source"
                                   className="form-select"
                                   value={newLidData.source}
                                   onChange={(e) => setNewLidData({ ...newLidData, source: e.target.value })}
                              >
                                   <option hidden>Bizni qanday topdingiz ?</option>

                                   {Object.keys(sources).map((s, i) => (
                                        <option value={i + 1}>{s}</option>
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
                              >
                              </textarea>
                         </div>
                    </div>

                    <div className="d-flex align-self-end my-3">
                         <button

                              type="submit"
                              style={{ background: "#0085db" }}
                              disabled={
                                   !(newLidData.first_name && newLidData.last_name && newLidData.phone && newLidData.course && newLidData.teacher && newLidData.source && newLidData.week_days) || creating
                              }
                              className="btn btn-sm px-3 py-2 fs-3 text-white"
                         >
                              {creating ? <Spinner animation="border" size="sm" /> : "Saqlash"}
                         </button>
                    </div>
               </form>
          </>
     )
}

export default NewLead