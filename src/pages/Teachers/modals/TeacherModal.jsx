import { useState, useEffect } from "react";
import Modal from "../../../components/Ui/Modal";
import { useCreateTeacher, useUpdateTeacher } from "../../../data/queries/teachers.queries";
import { Input } from "../../../components/Ui/Input";
import { Form, Spinner, Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react";

const TeacherModal = ({ show, setShow, setNotif, editData = null }) => {
  const isEdit = !!editData;
  const { mutate: createTeacher, isPending: creatingTeacher } = useCreateTeacher();
  const { mutate: updateTeacher, isPending: updatingTeacher } = useUpdateTeacher();

  // Barcha fieldlar rasmga asosan joylandi
  const initialState = {
    first_name: "",
    last_name: "",
    middle_name: "",
    phone: "+998",
    email: "",
    address: "",
    date_of_birth: "",
    hire_date: new Date().toISOString().split('T')[0],
    experience_duration: "",
    photo_url: null
  };

  const [formData, setFormData] = useState(initialState);

  // Tahrirlashda barcha ma'lumotlarni statega yuklash
  useEffect(() => {
    if (editData && show) {
      setFormData({
        ...initialState,
        ...editData,
        photo_url: editData.photo_url || null // Eski rasm bo'lsa URL turadi
      });
    } else if (!isEdit && show) {
      setFormData(initialState);
    }
  }, [editData, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      // Faqat o'zgargan yoki mavjud qiymatlarni append qilish
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    const mutation = isEdit ? updateTeacher : createTeacher;
    const payload = isEdit ? { id: editData.id, data } : data;

    mutation(payload, {
      onSuccess: () => {
        setNotif({ show: true, type: "success", message: `Muvaffaqiyatli ${isEdit ? "tahrirlandi" : "qo'shildi"}!` });
        setShow(false);
      },
      onError: (err) => {
        console.error(err)
        setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" })
      }
    });
  };

  const isLoading = creatingTeacher || updatingTeacher;

  return (
    <Modal
      title={isEdit ? "O'qituvchi ma'lumotlarini tahrirlash" : "Yangi o'qituvchi qo'shish"}
      close={() => setShow(false)}
      anima={show}
      width="55%"
      zIndex={1050}
    >
      <Form onSubmit={handleSubmit} className="p-2">
        {/* Rasm yuklash qismi */}
        <div className="d-flex flex-column align-items-center mb-4">
          <div
            className="rounded-circle border border-3 border-primary d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: "110px", height: "110px", cursor: "pointer", overflow: "hidden", background: "#f8fafc30" }}
            onClick={() => document.getElementById('photoInput').click()}
          >
            {formData.photo_url ? (
              <img
                src={typeof formData.photo_url === 'string' ? formData.photo_url : URL.createObjectURL(formData.photo_url)}
                className="w-100 h-100 object-fit-cover"
                alt="Profile"
              />
            ) : (
              <span className="fs-2 text-white d-flex align-items-center gap-1 flex-column">
                <Icon icon="lucide:camera" className="fs-5" /> Rasm yuklash
              </span>
            )}
          </div>
          <input type="file" id="photoInput" hidden accept="image/*" onChange={(e) => setFormData({ ...formData, photo_url: e.target.files[0] })} />
          <small className="mt-3 fs-3 text-muted fw-medium">Profil rasmi ( Ixtiyoriy )</small>
        </div>

        <Row className="g-3">
          {/* Asosiy ma'lumotlar */}
          <Col md={4}>
            <Input label="Ism *" value={formData.first_name} placeholder="Ism" onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
          </Col>
          <Col md={4}>
            <Input label="Familiya *" value={formData.last_name} placeholder="Familiya" onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
          </Col>
          <Col md={4}>
            <Input label="Sharif" value={formData.middle_name} placeholder="Sharif" onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })} />
          </Col>

          {/* Kontaktlar */}
          <Col md={6}>
            <Input label="Telefon *" value={formData.phone} placeholder="Telefon" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </Col>
          <Col md={6}>
            <Input label="Email" type="email" value={formData.email} placeholder="example@gmail.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </Col>

          {/* Manzil */}
          <Col md={12}>
            <Input label="Manzil" value={formData.address} placeholder="" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </Col>

          {/* Sanalar va Tajriba */}
          <Col md={4}>
            <Input label="Tug'ilgan sana *" type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} />
          </Col>
          <Col md={4}>
            <Input label="Ishga kirgan sana *" type="date" value={formData.hire_date} onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })} required />
          </Col>
          <Col md={4}>
            <Input label="Tajriba" placeholder="1 yil, 2 oy" value={formData.experience_duration} onChange={(e) => setFormData({ ...formData, experience_duration: e.target.value })} />
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button
            onClick={() => setShow(false)}
            className="btn btn-sm px-4 py-2 text-black"
            style={{ background: "#fff" }}
          >
            Orqaga
          </button>
          <button
            type="submit"
            className="btn btn-sm px-4 py-2 text-white fw-bold d-flex align-items-center gap-2"
            disabled={isLoading}
            style={{ background: "#0085db", borderRadius: "8px" }}
          >
            {isLoading ? <Spinner size="sm" /> : (isEdit ? "O'zgarishlarni saqlash" : "Saqlash")}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default TeacherModal;