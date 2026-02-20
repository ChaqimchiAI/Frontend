import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button, Nav } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useDeleteStudent, useStudent, useUpdateStudent } from "../../data/queries/students.queries";
import { useCreateStudentDiscount, useCreateStudentTransaction, useUpdateStudentDiscount } from "../../data/queries/billing.queries"
import { Input } from "../../components/Ui/Input";
import { ReactSelect } from "../../components/Ui/ReactSelect";
import { useTheme } from "../../Context/Context";
import Notification from "../../components/Ui/Notification";
import Modal from "../../components/Ui/Modal";
import { useCourses } from "../../data/queries/courses.queries";
import { useAddStudentToGroup, useGroups } from "../../data/queries/group.queries";
import Edited from "./components/Edited";
import StudentsGroups from "./components/StudentsGroups";
import { useGroupAttendances, useStudentAttendances, useAttendances, useCreateAttendance } from "../../data/queries/attendances.queries";

// Sub-components
import StudentProfile from "./components/Details/StudentProfile";
import StudentStats from "./components/Details/StudentStats";
import StudentAttendances from "./components/Details/StudentAttendances";
import StudentDiscounts from "./components/Details/StudentDiscounts";
import StudentPassword from "./components/Details/StudentPassword";

const statusStyle = (s) => {
  let st = s === true ? { style: { background: "#01df31" }, t: "Faol" }
    : s === false ? { style: { background: "#ef4444" }, t: "Faol emas" }
      : ""
  return st
}

const StudentDetaile = () => {
  const { theme } = useTheme();

  const { id } = useParams();
  const navigate = useNavigate();


  const { data: currentStudent, isLoading, error } = useStudent(id);
  const { mutate: createStudentTransaction, isPending: creatingStudentTransaction } = useCreateStudentTransaction(id)

  const { mutate: createStudentDiscount, isPending: creatingDiscount } = useCreateStudentDiscount(id)
  const { mutate: updateStudentDiscount } = useUpdateStudentDiscount(id)

  const { data: groupsData, isLoading: groupsLoading } = useGroups()
  const { data: courses } = useCourses();
  const coursesData = courses?.results

  const { mutate: addStudentToGroup, isPending: addingStudentGroup } = useAddStudentToGroup()

  const { mutate: deleteStudentData, isPending: deletingStudent } = useDeleteStudent();
  const { mutate: updateStudentData, isPending: updatingStudent } = useUpdateStudent();



  const { data: attendancesData, isLoading: attendancesLoading, error: attendancesError } = useStudentAttendances(id)

  console.log(attendancesData)


  const [student, setStudent] = useState(null);
  const [notif, setNotif] = useState({ show: false, type: "", message: "" })
  const [deleteStudent, setDeleteStudent] = useState(false)
  const [addStudentGroup, setAddStudentGroup] = useState(false)
  const [modal, setModal] = useState(null)
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [selectedGroup, setSelectedGroup] = useState("");

  const [activeTab, setActiveTab] = useState("tahrirlash");

  const [totalToPay, setTotalToPay] = useState(0);
  const [remainingLessons, setRemainingLessons] = useState(0);
  const [nextClassDates, setNextClassDates] = useState([]);

  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [discount, setDiscount] = useState({
    amount: "",
    comment: "",
    total_uses: ""
  })
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    const allGroups = groupsData?.results || groupsData;
    // Oyda qancha shu kunlar borligini hisoblaymiz
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const lastDate = new Date(year, month + 1, 0).getDate();

    if (Array.isArray(allGroups) && coursesData && currentStudent?.groups) {
      const dayMap = {
        'dushanba': 1, 'mon': 1, 'monday': 1, 'Du': 1,
        'seshanba': 2, 'tue': 2, 'tuesday': 2, 'Se': 2,
        'chorshanba': 3, 'wed': 3, 'wednesday': 3, 'Cho': 3,
        'payshanba': 4, 'thu': 4, 'thursday': 4, 'Pay': 4,
        'juma': 5, 'fri': 5, 'friday': 5, 'Ju': 5,
        'shanba': 6, 'sat': 6, 'saturday': 6, 'Sha': 6,
        'yakshanba': 0, 'sun': 0, 'sunday': 0, 'Ya': 0
      };

      let totalCoursePrice = 0;
      let allWeekDays = new Set();
      let totalLessonsThisMonth = 0;

      let balance = Number(currentStudent.balance?.split(".")[0] || 0);

      currentStudent.groups.forEach(studentGroup => {
        const foundGroup = allGroups.find(g => g.id === studentGroup.group_id);

        if (foundGroup) {
          const foundCourse = coursesData.find(c => c.course === foundGroup.course || c.name === foundGroup.course_name);

          if (foundCourse) {
            const price = Number(foundCourse.price?.split(".")[0] || 0);
            totalCoursePrice += price;

            // Haftalik kunlarni to'playmiz
            if (foundGroup?.schedule_items?.active && foundGroup.schedule_items.active.length > 0) {
              const lastActive = foundGroup.schedule_items.active[foundGroup.schedule_items.active.length - 1];

              if (lastActive?.days_of_week) {
                const dayIndices = lastActive.days_of_week.map(d => dayMap[d.code]);
                lastActive.days_of_week.forEach(d => allWeekDays.add(d.code));


                let count = 0;
                for (let i = 1; i <= lastDate; i++) {
                  const day = new Date(year, month, i).getDay();

                  if (dayIndices.includes(day)) count++;
                }
                totalLessonsThisMonth += count;
              }
            }
          }
        }
      });

      // 1. To'lanishi kerak bo'lgan qarzni hisoblash
      const debt = totalCoursePrice - balance;
      setTotalToPay(debt > 0 ? debt : 0);

      // 2. Qolgan darslar sonini hisoblash
      // Kurs narxi oyda qancha dars borligiga qarab hisoblanadi
      const lessonPrice = totalCoursePrice > 0 ? (totalCoursePrice / (totalLessonsThisMonth || 12)) : 0;
      const count = lessonPrice > 0 ? Math.floor(balance / lessonPrice) : 0;
      setRemainingLessons(count);

      // 3. Kelgusi dars sanalarini topish (shu oy oxirigacha hammasi)
      if (allWeekDays.size > 0) {
        const dates = [];
        const targetDays = Array.from(allWeekDays).map(d => dayMap[d]).filter(d => d !== undefined);

        let checkDate = new Date();
        let currentLessons = 0;

        // Bugundan boshlab oy oxirigacha barcha dars kunlarini qidiramiz
        for (let i = 0; i < lastDate; i++) {
          checkDate.setDate(checkDate.getDate() + 1);

          if (checkDate.getMonth() !== month) break;

          if (targetDays.includes(checkDate.getDay())) {
            currentLessons++;
            dates.push({
              day: checkDate.getDate(),
              isPaid: currentLessons <= count // Balans yetadigan darslar
            });
          }
        }
        setNextClassDates(dates);
      } else {
        setNextClassDates([]);
      }
    }
  }, [groupsData, coursesData, currentStudent]);

  useEffect(() => {
    if (currentStudent) {
      setStudent({ ...currentStudent, save: false });
    }
  }, [currentStudent]);

  const handleChange = (field, value) => {
    setStudent(prev => ({ ...prev, [field]: value, save: true }));
  };

  // Card va Tugma ranglari
  const cardBg = !theme ? "#15263a" : "#f6f9fb";
  const btnColor = "#0085db";
  const textColor = !theme ? "text-white" : "text-black";

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Spinner animation="border" style={{ color: btnColor }} />
      </div>
    );
  }

  if (error) return <div className="text-danger p-5 text-center">Xatolik yuz berdi!</div>;

  // for transaction
  const handleTransaction = () => {
    if (!amount) return;
    const body = {
      amount: Number(amount),
      type: modal === "payment" ? paymentType : modal,
      comment: comment
    };
    createStudentTransaction(body, {
      onSuccess: () => {
        setNotif({
          show: true,
          type: "success",
          message: modal === "payment" ? "Muvaffaqiyatli to'landi!" : "Muvaffaqiyatli qaytarildi!"
        });
        setModal(null);
        setAmount("");
        setComment("");
        setPaymentType("cash");
      },
      onError: (err) => {
        console.error(err);
        setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    })
  }

  // for discount
  const handleAddDiscount = () => {
    if (!discount.amount || !discount.total_uses) return;
    createStudentDiscount(discount, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "Chegirma muvaffaqiyatli qo'shildi!" });
        setModal(null);
        setDiscount({ amount: "", total_uses: "", comment: "" });
        setShowAddDiscount(false);
      },
      onError: (err) => {
        console.error(err);
        setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    })
  }

  // for student
  const handleSaveStudent = () => {
    const { save, ...dataToSave } = student;
    updateStudentData({ id, data: dataToSave }, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "Ma'lumotlar muvaffaqiyatli saqlandi!" });
        setStudent(prev => ({ ...prev, save: false }));
      },
      onError: (err) => {
        console.error(err);
        setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    });
  }

  const handleAddStudentGroup = () => {
    addStudentToGroup({ id: selectedGroup, student_id: id }, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "Guruhga qo'shish muvaffaqiyatli amalga oshirildi!" });
        setAddStudentGroup(false);
        setSelectedGroup("");
      },
      onError: (err) => {
        console.error(err);
        setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    });
  }

  const handleDeleteStudent = () => {
    deleteStudentData(id, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "O'quvchini o'chirish muvaffaqiyatli amalga oshirildi" });
        navigate(-1);
      },
      onError: (err) => {
        console.error(err)
        setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    })
  }

  const statusChange = (status, discountId) => {
    updateStudentDiscount({ discountId, data: { is_active: status } }, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "Status muvaffaqiyatli o'zgartirildi!" });
        setOpenDropdown(null);
      }
    })
  }

  return (
    <>
      {notif.show &&
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      }

      {modal &&
        <Modal
          title={`${modal === "payment" ? "To'lov qilish" : "Pul qaytarish"}`}
          anima={modal}
          close={setModal}
          width="30%"
          zIndex={100}
        >
          {modal === "payment" && (
            <div className="d-flex gap-3 mt-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentType"
                  id="cash"
                  value="cash"
                  checked={paymentType === "cash"}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                <label className={`form-check-label`} htmlFor="cash">Naqd</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentType"
                  id="card"
                  value="card"
                  checked={paymentType === "card"}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                <label className={`form-check-label`} htmlFor="card">Plastik</label>
              </div>
            </div>
          )}

          <Input
            label="Summa"
            type="text"
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
            placeholder="Summa"
            required
            disabled={creatingStudentTransaction}
            containerClassName="mt-2"
          />

          {modal === "withdraw" && (
            <Input
              label="Izoh"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Izoh..."
              disabled={creatingStudentTransaction}
              containerClassName="mt-2"
            />
          )}

          <div className="mt-2 d-flex align-items-center gap-2 justify-content-end">
            <Button
              className="btn btn-sm px-4 py-2 text-black border-0"
              style={{ background: "#f7f7f7" }}
              onClick={() => setModal(null)}
            >
              Orqaga
            </Button>
            <Button
              className="btn btn-sm save-button"
              onClick={handleTransaction}
            >
              {creatingStudentTransaction ? <Spinner animation="border" size="sm" /> : (modal === "payment" ? "To'lash" : "Qaytarish")}
            </Button>
          </div>
        </Modal>
      }

      {addStudentGroup &&
        <Modal
          title="Guruhga qo'shish"
          anima={addStudentGroup}
          close={setAddStudentGroup}
          width="30%"
          zIndex={100}
        >
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            required
            className="form-select"
            disabled={addingStudentGroup}
          >
            <option value="" hidden>Guruhni tanlang</option>
            {(groupsData?.results || groupsData || []).map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <div className="mt-2 d-flex align-items-center gap-2 justify-content-end">
            <Button
              className="btn btn-sm px-4 py-2 text-black border-0"
              style={{ background: "#f9fafb" }}
              onClick={() => setAddStudentGroup(false)}
            >
              Orqaga
            </Button>
            <Button
              className="btn btn-sm save-button"
              onClick={handleAddStudentGroup}
            >
              {addingStudentGroup ? <Spinner animation="border" size="sm" /> : "Qo'shish"}
            </Button>
          </div>
        </Modal>
      }

      {deleteStudent &&
        <Modal
          title="Tasdiqlash"
          anima={deleteStudent}
          close={setDeleteStudent}
          width="30%"
          zIndex={100}
        >
          <p className="fs-4">Haqiqatdan o'chirishni istaysizmi?</p>

          <div className="mt-2 d-flex align-items-center gap-2 justify-content-end">
            <Button
              className="btn btn-sm px-4 py-2 text-black border-0"
              style={{ background: "#f9fafb" }}
              onClick={() => setDeleteStudent(false)}
            >
              Orqaga
            </Button>
            <Button
              className="btn btn-sm px-4 py-2 border-0"
              style={{ background: "#db3232", color: "#fff" }}
              onClick={handleDeleteStudent}
            >
              {deletingStudent ? <Spinner animation="border" size="sm" /> : "Ha"}
            </Button>
          </div>
        </Modal>
      }

      {showAddDiscount &&
        <Modal
          title="Chegirma qo'shish"
          anima={showAddDiscount}
          close={setShowAddDiscount}
          width="30%"
          zIndex={100}
        >
          <Row>
            <Input
              label="Chegirma summasi"
              value={discount.amount}
              onChange={(e) => setDiscount({ ...discount, amount: e.target.value.replace(/\D/g, '') })}
              placeholder="Chegirma..."
              required
              disabled={creatingDiscount}
              containerClassName="mt-2 col-8"
            />

            <ReactSelect
              label="Muddat"
              containerClassName="mt-2 col-4"
              placeholder="Muddat"
              value={discount.total_uses ? { value: discount.total_uses, label: `${discount.total_uses} oy` } : null}
              options={[
                { value: "1", label: "1 oy" },
                { value: "2", label: "2 oy" },
                { value: "3", label: "3 oy" },
                { value: "4", label: "4 oy" },
                { value: "5", label: "5 oy" },
                { value: "6", label: "6 oy" },
                { value: "7", label: "7 oy" },
                { value: "8", label: "8 oy" },
                { value: "9", label: "9 oy" },
                { value: "10", label: "10 oy" },
                { value: "11", label: "11 oy" },
                { value: "12", label: "12 oy" },
              ]}
              onChange={(e) => setDiscount({ ...discount, total_uses: e.value })}
            />
          </Row>

          <label htmlFor="desc">Izoh</label>
          <textarea
            id="desc"
            className="form-control mt-2"
            style={{ resize: "none" }}
            placeholder="Izoh..."
            rows="3"
            value={discount.comment}
            onChange={(e) => setDiscount({ ...discount, comment: e.target.value })}
          ></textarea>

          <div className="mt-2 d-flex align-items-center gap-2 justify-content-end">
            <Button
              className="btn btn-sm px-4 py-2 text-black border-0"
              style={{ background: "#f9fafb" }}
              onClick={() => setShowAddDiscount(false)}
            >
              Orqaga
            </Button>
            <Button
              className="btn btn-sm save-button"
              onClick={handleAddDiscount}
              disabled={creatingDiscount}
            >
              {creatingDiscount ? <Spinner animation="border" size="sm" /> : "Qo'shish"}
            </Button>
          </div>
        </Modal>
      }

      <Container fluid className="card card-body">
        <div className="d-flex align-items-center gap-3 mb-4 justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <Button
              variant="link"
              onClick={() => navigate(-1)}
              className={`p-0 opacity-75 hover-opacity-100 ${textColor}`}
            >
              <Icon icon="fluent:arrow-left-24-filled" width="24" />
            </Button>
            <h4 className={`mb-0 fw-bold ${textColor}`}>{currentStudent?.first_name} {currentStudent?.last_name}</h4>
          </div>

          {currentStudent?.groups?.length === 0 && (
            <button
              className="btn btn-sm fs-2 d-flex align-items-center gap-1 save-button"
              onClick={() => setAddStudentGroup(true)}
            >
              <Icon icon="material-symbols:group-add-outline" width="18" />
              Guruhga qo'shish
            </button>
          )}
        </div>

        <Row>
          <Col lg={4} xl={3}>
            <StudentProfile
              student={student}
              currentStudent={currentStudent}
              cardBg={cardBg}
              textColor={textColor}
              setModal={setModal}
            />
          </Col>

          <Col lg={8} xl={9}>
            <StudentStats
              nextClassDates={nextClassDates}
              remainingLessons={remainingLessons}
              totalToPay={totalToPay}
              currentStudent={currentStudent}
              textColor={textColor}
              btnColor={btnColor}
              cardBg={cardBg}
            />

            <Card className="border-0" style={{ backgroundColor: cardBg }}>
              <div className="px-4 pt-3 border-bottom border-secondary border-opacity-25">
                <Nav className="gap-4 mb-0">
                  {["tahrirlash", "guruhlar", "davomat", "chegirma", "parol"].map((tab) => (
                    <Nav.Link
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-0 py-3 text-capitalize ${activeTab === tab ? "text-primary border-bottom border-2 border-primary" : "text-muted opacity-75"}`}
                      style={{ fontSize: "14px" }}
                    >
                      {tab}
                    </Nav.Link>
                  ))}
                </Nav>
              </div>

              <Card.Body className="p-4 mt-2">
                {activeTab === "tahrirlash" && (
                  <Edited
                    student={student}
                    handleChange={handleChange}
                    setDeleteStudent={setDeleteStudent}
                    handleSaveStudent={handleSaveStudent}
                    updatingStudent={updatingStudent}
                    theme={theme}
                    textColor={textColor}
                  />
                )}

                {activeTab === "guruhlar" && (
                  <StudentsGroups
                    student={student}
                    theme={theme}
                    textColor={textColor}
                    navigate={navigate}
                  />
                )}

                {activeTab === "davomat" && (
                  <StudentAttendances textColor={textColor} />
                )}

                {activeTab === "chegirma" && (
                  <StudentDiscounts
                    currentStudent={currentStudent}
                    setShowAddDiscount={setShowAddDiscount}
                    textColor={textColor}
                    statusStyle={statusStyle}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    statusChange={statusChange}
                  />
                )}

                {activeTab === "parol" && (
                  <StudentPassword currentStudent={currentStudent} />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StudentDetaile;