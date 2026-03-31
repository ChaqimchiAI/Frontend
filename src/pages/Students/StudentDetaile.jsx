import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button, Nav } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useDeleteStudent, useStudent, useUpdateStudent } from "../../data/queries/students.queries";
import { useCreateStudentDiscount, useCreateStudentTransaction, useUpdateStudentDiscount, useWithdrawStudentTransaction } from "../../data/queries/billing.queries"
import { Input } from "../../components/Ui/Input";
import { ReactSelect } from "../../components/Ui/ReactSelect";
import { useTheme } from "../../Context/Context";
import { useNotification } from "../../Context/NotificationContext";
import Modal from "../../components/Ui/Modal";
import { useCourses } from "../../data/queries/courses.queries";
import { useAddStudentToGroup, useGroups } from "../../data/queries/group.queries";
import Edited from "./components/Edited";
import StudentsGroups from "./components/StudentsGroups";
import { useStudentAttendances } from "../../data/queries/attendances.queries";

// Sub-components
import StudentProfile from "./components/Details/StudentProfile";
import StudentStats from "./components/Details/StudentStats";
import StudentAttendances from "./components/Details/StudentAttendances";
import StudentDiscounts from "./components/Details/StudentDiscounts";
import StudentPassword from "./components/Details/StudentPassword";
import StudentTransactions from "./components/Details/StudentTransactions";

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
  const { setNotif } = useNotification();

  // Queries
  const { data: currentStudent, isLoading, error } = useStudent(id);
  const { mutate: createStudentTransaction, isPending: creatingStudentTransaction } = useCreateStudentTransaction(id);
  const { mutate: withdrawStudentTransaction, isPending: withdrawingStudentTransaction } = useWithdrawStudentTransaction(id);
  const { mutate: createStudentDiscount, isPending: creatingDiscount } = useCreateStudentDiscount(id);
  const { mutate: updateStudentDiscount } = useUpdateStudentDiscount(id);
  const { data: groupsData } = useGroups();
  const { data: courses } = useCourses();
  const coursesData = courses?.results;

  const { mutate: addStudentToGroup, isPending: addingStudentGroup } = useAddStudentToGroup();
  const { mutate: deleteStudentData, isPending: deletingStudent } = useDeleteStudent();
  const { mutate: updateStudentData, isPending: updatingStudent } = useUpdateStudent();

  // States
  const [student, setStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(false);
  const [addStudentGroup, setAddStudentGroup] = useState(false);
  const [modal, setModal] = useState(null); // 'payment', 'payout', 'withdrawPayment'
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [activeTab, setActiveTab] = useState("tahrirlash");

  const [totalToPay, setTotalToPay] = useState(0);
  const [remainingLessons, setRemainingLessons] = useState(0);
  const [nextClassDates, setNextClassDates] = useState([]);

  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [discount, setDiscount] = useState({ amount: "", comment: "", total_uses: "" });
  const [openDropdown, setOpenDropdown] = useState(null);

  // Hisob-kitoblar (useEffect) - O'zgarishsiz qoldi
  useEffect(() => {
    const allGroups = groupsData?.results || groupsData;
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

      const debt = totalCoursePrice - balance;
      setTotalToPay(debt > 0 ? debt : 0);
      const lessonPrice = totalCoursePrice > 0 ? (totalCoursePrice / (totalLessonsThisMonth || 12)) : 0;
      const count = lessonPrice > 0 ? Math.floor(balance / lessonPrice) : 0;
      setRemainingLessons(count);

      if (allWeekDays.size > 0) {
        const dates = [];
        const targetDays = Array.from(allWeekDays).map(d => dayMap[d]).filter(d => d !== undefined);
        let checkDate = new Date();
        let currentLessons = 0;
        for (let i = 0; i < lastDate; i++) {
          checkDate.setDate(checkDate.getDate() + 1);
          if (checkDate.getMonth() !== month) break;
          if (targetDays.includes(checkDate.getDay())) {
            currentLessons++;
            dates.push({ day: checkDate.getDate(), isPaid: currentLessons <= count });
          }
        }
        setNextClassDates(dates);
      } else {
        setNextClassDates([]);
      }
    }
  }, [groupsData, coursesData, currentStudent]);

  useEffect(() => {
    if (currentStudent) setStudent({ ...currentStudent, save: false });
  }, [currentStudent]);

  const handleChange = (field, value) => {
    setStudent(prev => ({ ...prev, [field]: value, save: true }));
  };

  // 1. Kassa amallari: Balans to'ldirish (cash/card) va Pulni qaytarish (payout)
  const handleTransaction = () => {
    if (!amount) return;
    const body = {
      amount: Number(amount),
      type: modal === "payment" ? paymentType : "payout",
      comment: comment
    };

    createStudentTransaction(body, {
      onSuccess: () => {
        setNotif({
          show: true,
          type: "success",
          message: modal === "payment" ? "Balans to'ldirildi!" : "Pul kassadan qaytarib berildi!"
        });
        setModal(null);
        setAmount("");
        setComment("");
      },
      onError: (err) => {
        setNotif({ show: true, type: "error", message: err.response?.data?.detail || "Xatolik yuz berdi!" });
      }
    });
  };

  // 2. Billing amali: Guruh uchun oylik to'lovni yechish
  const handleWithdrawPayment = () => {
    if (!selectedGroup) {
      setNotif({ show: true, type: "error", message: "Guruhni tanlang!" });
      return;
    }
    const body = {
      group_id: Number(selectedGroup),
      comment: comment
    };

    withdrawStudentTransaction(body, {
      onSuccess: (res) => {
        setNotif({
          show: true,
          type: "success",
          message: `To'lov muvaffaqiyatli yechildi: ${Number(res.amount).toLocaleString()} so'm`
        });
        setModal(null);
        setComment("");
        setSelectedGroup("");
      },
      onError: (err) => {
        console.error("Billing Error:", err);

        // Backenddan kelayotgan strukturaga mos xato xabarini olish
        // Sizning holatingizda: err.response.data.data.error
        const backendError = err.response?.data?.data?.error;

        let errorMsg = "Xatolik yuz berdi!";

        if (Array.isArray(backendError)) {
          errorMsg = backendError[0]; // Agar massiv bo'lsa, birinchi elementni olamiz
        } else if (typeof backendError === 'string') {
          errorMsg = backendError;
        } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        }

        setNotif({
          show: true,
          type: "error",
          message: errorMsg // Toastda aynan o'sha "allaqachon yechilgan" xabari chiqadi
        });
      }
    });
  }

  const handleAddDiscount = () => {
    if (!discount.amount || !discount.total_uses) return;
    createStudentDiscount(discount, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "Chegirma qo'shildi!" });
        setShowAddDiscount(false);
        setDiscount({ amount: "", total_uses: "", comment: "" });
      },
      onError: () => setNotif({ show: true, type: "error", message: "Xatolik!" })
    });
  };

  const handleSaveStudent = () => {
    const formData = new FormData();

    Object.keys(student).forEach((key) => {
      // 1. Keraksiz vaqtinchalik maydonlarni o'chirib tashlaymiz
      if (key === "save" || key === "image_preview") return;

      // 2. Rasm bilan ishlash mantiqi
      if (key === "image") {
        // FAQAT yangi rasm tanlangan bo'lsa (File obyekti bo'lsa) qo'shamiz
        if (student[key] instanceof File) {
          formData.append("image", student[key]);
        }
        // Agar student[key] string (URL) bo'lsa, hech narsa qilmaymiz (append qilmaymiz)
      }
      // 3. Boshqa barcha maydonlar
      else {
        // Null bo'lsa bo'sh string yuboramiz
        formData.append(key, student[key] ?? "");
      }
    });

    // 4. API so'rovi
    updateStudentData({ id, data: formData }, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "Muvaffaqiyatli saqlandi!" });
        setStudent(prev => ({ ...prev, save: false }));
        // Agar rasm yangilangan bo'lsa, preview URLni tozalab yuborsak ham bo'ladi
      },
      onError: (err) => {
        console.error("Xatolik tafsiloti:", err.response?.data);
        setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" });
      }
    });
  };

  const handleAddStudentGroup = () => {
    addStudentToGroup({ id: selectedGroup, student_id: id }, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: "Guruhga qo'shildi!" });
        setAddStudentGroup(false);
      }
    });
  };

  const handleDeleteStudent = () => {
    deleteStudentData(id, {
      onSuccess: () => { navigate(-1); setNotif({ show: true, type: "success", message: "O'chirildi" }); }
    });
  };

  const statusChange = (status, discountId) => {
    updateStudentDiscount({ discountId, data: { is_active: status } }, {
      onSuccess: () => { setNotif({ show: true, type: "success", message: "Status o'zgardi" }); setOpenDropdown(null); }
    });
  };

  const cardBg = !theme ? "#15263a" : "#f6f9fb";
  const textColor = !theme ? "text-white" : "text-black";

  if (isLoading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-dark"><Spinner animation="border" variant="primary" /></div>;

  return (
    <>
      {modal &&
        <Modal
          title={
            modal === "payment" ? "Kassa: Balansni to'ldirish" :
              modal === "payout" ? "Kassa: Pulni naqd qaytarish (Payout)" :
                "Guruh to'lovini yechish (Withdraw)"
          }
          anima={modal}
          close={setModal}
          width="35%"
          zIndex={9999}
        >
          {modal === "payment" && (
            <div className="d-flex gap-4 mt-3 mb-3 justify-content-center">
              <div className="form-check">
                <input className="form-check-input" type="radio" id="cash" value="cash" checked={paymentType === "cash"} onChange={(e) => setPaymentType(e.target.value)} />
                <label className="form-check-label" htmlFor="cash">Naqd</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="card" value="card" checked={paymentType === "card"} onChange={(e) => setPaymentType(e.target.value)} />
                <label className="form-check-label" htmlFor="card">Plastik</label>
              </div>
            </div>
          )}

          {modal === "withdrawPayment" && (
            <div className="mb-3">
              <label className="mb-1 fw-bold">Qaysi guruh uchun yechiladi?</label>
              <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="form-select">
                <option value="" hidden>Guruhni tanlang</option>
                {currentStudent?.groups?.map(sg => {
                  const group = (groupsData?.results || groupsData || []).find(g => g.id === sg.group_id);
                  return group ? <option key={group.id} value={group.id}>{group.name}</option> : null;
                })}
              </select>
              {selectedGroup && (
                <div className="mt-2 text-primary small fw-bold">
                  Dars narxi: {(() => {
                    const group = (groupsData?.results || groupsData || []).find(g => g.id === Number(selectedGroup));
                    const course = coursesData?.find(c => c.course === group?.course || c.name === group?.course_name);
                    return course ? Number(course.price?.split(".")[0]).toLocaleString() + " so'm" : "...";
                  })()}
                </div>
              )}
            </div>
          )}

          {(modal === "payment" || modal === "payout") && (
            <Input label="Summa" type="text" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="Summani kiriting..." containerClassName="mt-2" />
          )}

          <Input label="Izoh" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Izoh (ixtiyoriy)..." containerClassName="mt-3" />

          <div className="mt-4 d-flex justify-content-end gap-2">
            <Button variant="light" className="px-4" onClick={() => setModal(null)}>Bekor qilish</Button>
            <Button className="save-button px-4" onClick={modal === "withdrawPayment" ? handleWithdrawPayment : handleTransaction} disabled={creatingStudentTransaction || withdrawingStudentTransaction}>
              {(creatingStudentTransaction || withdrawingStudentTransaction) ? <Spinner size="sm" /> : (modal === "payment" ? "Kirim qilish" : modal === "payout" ? "Chiqim qilish" : "Yechish")}
            </Button>
          </div>
        </Modal>
      }

      {/* Add Group Modal */}
      {addStudentGroup &&
        <Modal title="Guruhga qo'shish" anima={addStudentGroup} close={setAddStudentGroup} width="30%" zIndex={9999}>
          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="form-select">
            <option value="" hidden>Guruhni tanlang</option>
            {(groupsData?.results || groupsData || []).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <div className="mt-3 d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setAddStudentGroup(false)}>Orqaga</Button>
            <Button className="save-button" onClick={handleAddStudentGroup}>{addingStudentGroup ? <Spinner size="sm" /> : "Qo'shish"}</Button>
          </div>
        </Modal>
      }

      {/* Delete Confirmation */}
      {deleteStudent &&
        <Modal title="Tasdiqlash" anima={deleteStudent} close={setDeleteStudent} width="30%" zIndex={9999}>
          <p>Haqiqatan o'chirmoqchimisiz?</p>
          <div className="mt-3 d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setDeleteStudent(false)}>Yo'q</Button>
            <Button variant="danger" onClick={handleDeleteStudent}>{deletingStudent ? <Spinner size="sm" /> : "Ha, o'chirilsin"}</Button>
          </div>
        </Modal>
      }

      {/* Add Discount Modal */}
      {showAddDiscount &&
        <Modal title="Chegirma qo'shish" anima={showAddDiscount} close={setShowAddDiscount} width="35%" zIndex={9999}>
          <Row>
            <Col md={8}><Input label="Summa" value={discount.amount} onChange={(e) => setDiscount({ ...discount, amount: e.target.value.replace(/\D/g, '') })} placeholder="Summa" containerClassName="mt-2" /></Col>
            <Col md={4}><ReactSelect label="Muddat" value={discount.total_uses ? { value: discount.total_uses, label: `${discount.total_uses} oy` } : null} options={Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: `${i + 1} oy` }))} onChange={(e) => setDiscount({ ...discount, total_uses: e.value })} containerClassName="mt-2" /></Col>
          </Row>
          <label className="mt-2">Izoh</label>
          <textarea className="form-control" rows="3" value={discount.comment} onChange={(e) => setDiscount({ ...discount, comment: e.target.value })}></textarea>
          <div className="mt-3 d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowAddDiscount(false)}>Orqaga</Button>
            <Button className="save-button" onClick={handleAddDiscount} disabled={creatingDiscount}>Saqlash</Button>
          </div>
        </Modal>
      }

      <Container fluid className="card card-body mt-2">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <Button variant="link" onClick={() => navigate(-1)} className={`p-0 ${textColor}`}><Icon icon="fluent:arrow-left-24-filled" width="24" /></Button>
            <h4 className={`mb-0 fw-bold ${textColor}`}>{currentStudent?.first_name} {currentStudent?.last_name}</h4>
          </div>
          <button className="btn btn-sm save-button d-flex align-items-center gap-1" onClick={() => setAddStudentGroup(true)}><Icon icon="material-symbols:group-add-outline" width="18" /> Guruhga qo'shish</button>
        </div>

        <Row>
          <Col lg={4} xl={3}>
            <StudentProfile student={student} currentStudent={currentStudent} cardBg={cardBg} textColor={textColor} setModal={setModal} />
          </Col>
          <Col lg={8} xl={9}>
            <StudentStats nextClassDates={nextClassDates} remainingLessons={remainingLessons} totalToPay={totalToPay} currentStudent={currentStudent} textColor={textColor} cardBg={cardBg} />
            <Card className="border-0" style={{ backgroundColor: cardBg }}>
              <div className="px-4 pt-2 border-bottom border-secondary border-opacity-25">
                <Nav className="gap-4">
                  {["tahrirlash", "guruhlar", "davomat", "chegirma", "parol", "To'lovlar tarixi"].map((tab) => (
                    <Nav.Link key={tab} onClick={() => setActiveTab(tab)} className={`px-0 py-3 text-capitalize ${activeTab === tab ? "text-primary border-bottom border-2 border-primary" : "text-muted opacity-75"}`} style={{ fontSize: "14px" }}>{tab}</Nav.Link>
                  ))}
                </Nav>
              </div>
              <Card.Body className="p-4 mt-2">
                {activeTab === "tahrirlash" && <Edited student={student} handleChange={handleChange} setDeleteStudent={setDeleteStudent} handleSaveStudent={handleSaveStudent} updatingStudent={updatingStudent} theme={theme} textColor={textColor} />}
                {activeTab === "guruhlar" && <StudentsGroups student={student} theme={theme} textColor={textColor} navigate={navigate} />}
                {activeTab === "davomat" && <StudentAttendances textColor={textColor} />}
                {activeTab === "chegirma" && <StudentDiscounts currentStudent={currentStudent} setShowAddDiscount={setShowAddDiscount} textColor={textColor} statusStyle={statusStyle} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} statusChange={statusChange} />}
                {activeTab === "To'lovlar tarixi" && <StudentTransactions studentId={id} textColor={textColor} />}
                {activeTab === "parol" && <StudentPassword currentStudent={currentStudent} />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StudentDetaile;