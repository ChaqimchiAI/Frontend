import { Icon } from '@iconify/react';
import { useTheme } from '../../Context/Context';
import { useProfile } from '../../data/queries/profile.queries';
import { useStudentsData } from '../../data/queries/students.queries';
import { useEffect, useState } from 'react';
import Notification from '../../components/Ui/Notification';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './Modals/PaymentModal';
import ScheduleModal from './Modals/ScheduleModal';
import Lessons from './components/Lessons';
// Modals Imports
import StudentAdd from '../Students/components/StudentAdd';
import NewLead from '../Laeds/components/NewLead';
import AddGroup from '../Groups/GroupDetaileModals/AddGroup';

const Home = () => {
  const navigate = useNavigate()
  const { theme } = useTheme();
  const currentTime = new Date();

  const { data: user } = useProfile()
  const { data: students } = useStudentsData()
  const studentsData = students?.results


  const [notif, setNotif] = useState({ show: false, type: "success", message: "" })
  const [recentStudents, setRecentStudents] = useState([])
  const [paymentModal, setPaymentModal] = useState(false)
  const [scheduleModal, setScheduleModal] = useState(false)

  // Modal states
  const [leadModal, setLeadModal] = useState(false)
  const [studentModal, setStudentModal] = useState(false)
  const [groupModal, setGroupModal] = useState(false)

  useEffect(() => {
    if (studentsData) {
      const recent = studentsData.filter(student => {
        const studentTime = new Date(student.created_at)
        const diffTime = currentTime - studentTime
        const diffHours = diffTime / (1000 * 60 * 60)

        return diffHours <= 12 && diffHours >= 0
      })

      setRecentStudents(recent)
    }
  }, [studentsData])

  // Statistika uchun ma'lumotlar
  const stats = [
    {
      id: 1,
      title: "Leadlar",
      value: "156",
      change: "-2%",
      icon: "ph:user-duotone",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
    },
    {
      id: 2,
      title: "O'quvchilar",
      value: "1,280",
      change: "+12%",
      icon: "ph:student-duotone",
      color: "#6366f1",
      gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
    },
    {
      id: 3,
      title: "Guruhlar",
      value: "42",
      change: "+5%",
      icon: "ph:users-four-duotone",
      color: "#f43f5e",
      gradient: "linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)"
    },
    {
      id: 4,
      title: "Tushum",
      value: "45.2M",
      change: "+18%",
      icon: "ph:wallet-duotone",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
    },
  ];

  // Yaqindagi darslar uchun mock ma'lumotlar
  const upcomingLessons = [
    {
      id: 1,
      groupName: "IELTS Master",
      teacher: "D. Alimov",
      time: "16:00 - 17:30",
      room: "102-xona",
      color: "#6366f1"
    },
    {
      id: 2,
      groupName: "Kids English",
      teacher: "M. Sobirova",
      time: "17:30 - 18:30",
      room: "204-xona",
      color: "#10b981"
    },
    {
      id: 3,
      groupName: "Grammar Alpha",
      teacher: "J. Karimov",
      time: "18:00 - 19:30",
      room: "Online",
      color: "#f59e0b"
    }
  ];

  return (
    <>

      {notif.show && (
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      )}

      {paymentModal && (
        <PaymentModal
          paymentModal={paymentModal}
          setPaymentModal={setPaymentModal}
          setNotif={setNotif}
          studentsData={studentsData}
        />
      )}

      {scheduleModal && (
        <ScheduleModal
          scheduleModal={scheduleModal}
          setScheduleModal={setScheduleModal}
        />
      )}

      {/* Lead Modal */}
      {leadModal && (
        <NewLead
          setNotif={setNotif}
          setShow={setLeadModal}
          show={leadModal}
        />
      )}

      {/* Student Modal */}
      {studentModal && (
        <StudentAdd
          close={setStudentModal}
          setNotif={setNotif}
          open={studentModal}
        />
      )}

      {/* Group Modal */}
      {groupModal && (
        <AddGroup
          addGroup={groupModal}
          setAddGroup={setGroupModal}
          setNotif={setNotif}
        />
      )}

      <div className="card card-body" style={{ minHeight: '100vh', transition: 'all 0.3s' }}>
        {/* 1. Header Section */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 fw-bold">
              DASHBOARD
            </span>
            <h2 className="fw-bold mb-1 welcome-title">Xush kelibsiz, {user?.first_name} 👋</h2>
            <p className="text-muted mb-0 small">Bugungi ko'rsatkichlar va oxirgi yangiliklar bilan tanishing.</p>
          </div>
          <div className="d-none d-md-flex align-items-center gap-3">
            <button
              className="btn btn-sm save-button fs-3 d-flex align-items-center gap-1"
              onClick={() => setPaymentModal(true)}
            >
              <Icon icon="ion:wallet-outline" fontSize={20} />
              To'lov
            </button>
          </div>
        </div>

        {/* 2. Statistika Kartochkalari */}
        <div className="row g-4 mb-5">
          {stats.map((stat) => (
            <div className="col-12 col-md-6 col-lg-3" key={stat.id}>
              <div className="card glass-card stat-card p-4 h-100 border-0 overflow-hidden position-relative">
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: stat.gradient,
                  opacity: '0.1',
                  borderRadius: '50%',
                  filter: 'blur(30px)'
                }}></div>

                <div className="icon-box" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}20` }}>
                  <Icon icon={stat.icon} fontSize={28} style={{ color: stat.color }} />
                </div>

                <div>
                  <p className="text-muted small mb-1 fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>{stat.title}</p>
                  <div className="d-flex align-items-end gap-2">
                    <h3 className={`fw-bold mb-0 ${!theme ? 'text-white' : 'text-dark'}`}>{stat.value}</h3>
                    <span className={`small mb-1 fw-semibold ${stat.change.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-8">

            {/* Yaqindagi darslar */}
            <Lessons theme={theme} upcomingLessons={upcomingLessons} setScheduleModal={setScheduleModal} />

            {/* Oxirgi qo'shilganlar */}
            <div className="card glass-card p-4 border-0">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className={`fw-bold mb-1 ${!theme ? 'text-white' : 'text-dark'}`}>Oxirgi o'quvchilar</h5>
                  <p className="text-muted small mb-0">Oxirgi 12 soat ichida qo'shilganlar</p>
                </div>
                <button
                  className="btn btn-sm btn-link text-primary text-decoration-none fw-bold"
                  onClick={() => navigate('/students')}
                >
                  Hammasini ko'rish
                </button>
              </div>

              <div className="mt-2">
                {recentStudents.length > 0 ? recentStudents.map((student) => (
                  <div
                    className="student-item d-flex align-items-center mb-2"
                    key={student.id}
                    onClick={() => navigate(`/students/${student.id}`)}
                  >
                    <div
                      className={`avatar me-3 rounded-circle d-flex align-items-center justify-content-center border 
                      ${!theme ? 'bg-dark border-secondary' : 'bg-light border-light'}`
                      }
                      style={{ width: '45px', height: '45px' }}
                    >
                      <Icon icon="ph:user-duotone" fontSize={22} className="text-muted" />
                    </div>
                    <div className="flex-grow-1">
                      <div className={`fw-semibold ${!theme ? 'text-white' : 'text-dark'}`}>{student.first_name} {student.last_name}</div>
                      <div className="text-muted small">{student.phone}</div>
                    </div>
                    <div className="text-end d-none d-sm-block">
                      <div className="small text-muted mb-1">{student.created_at?.split('T')[1].slice(0, 5)}</div>
                      <span
                        className={`badge rounded-pill px-3 
                        ${student.is_active === true ? 'bg-success' : 'bg-danger'} bg-opacity-10 
                        ${student.is_active === true ? 'text-success' : 'text-danger'}`
                        }
                      >
                        {student.is_active === true ? 'Faol' : 'Faol emas'}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4">
                    <Icon icon="ph:users-duotone" fontSize={24} className="text-muted" />
                    <div className="text-muted small">Hech qanday talaba topilmadi</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. O'ng taraf - Tezkor Tugmalar */}
          <div className="col-lg-4">
            <div className="card glass-card p-4 h-100 border-0">
              <h5 className={`fw-bold mb-4 ${!theme ? 'text-white' : 'text-dark'}`}>Tezkor amallar</h5>
              <div className="d-grid gap-3">
                <button
                  className="action-btn"
                  onClick={() => setLeadModal(true)}
                >
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10">
                    <Icon icon="ph:plus-circle-duotone" className="text-primary" fontSize={22} />
                  </div>
                  <div>
                    <div className="fw-bold small">Yangi Lead</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>Leadlar bo'limi</div>
                  </div>
                </button>

                <button
                  className="action-btn"
                  onClick={() => setStudentModal(true)}
                >
                  <div className="p-2 rounded-3 bg-warning bg-opacity-10">
                    <Icon icon="ci:user-add" className="text-warning" fontSize={22} />
                  </div>
                  <div>
                    <div className="fw-bold small">Yangi o'quvchi</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>O'quvchilar bo'limi</div>
                  </div>
                </button>

                <button
                  className="action-btn"
                  onClick={() => setGroupModal(true)}
                >
                  <div className="p-2 rounded-3 bg-danger bg-opacity-10">
                    <Icon icon="ph:users-three-duotone" className="text-danger" fontSize={22} />
                  </div>
                  <div>
                    <div className="fw-bold small">Yangi guruh</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>Guruhlar bo'limi</div>
                  </div>
                </button>

                <div className="mt-4 p-4 rounded-4 text-center" style={{
                  background: !theme ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.03)',
                  border: '1px dashed rgba(99, 102, 241, 0.3)'
                }}>
                  <Icon icon="ph:quotes-duotone" className="text-primary mb-2" fontSize={24} />
                  <p className={`small mb-0 italic ${!theme ? 'text-muted' : 'text-secondary'}`} style={{ fontStyle: 'italic' }}>
                    "Bilim olish - har bir inson uchun eng yaxshi sarmoyadir."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>





      <style>
        {`
        .glass-card {
          background: ${!theme ? "rgba(30, 41, 59, 0.7)" : "#f5f5f5"};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid ${!theme ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: ${!theme ? "0 4px 6px -1px rgba(0, 0, 0, 0.2)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)"};
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
          border-color: ${!theme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
        }

        .icon-box {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          margin-bottom: 1.5rem;
        }

        .action-btn {
          background: ${!theme ? "rgba(15, 23, 42, 0.6)" : "rgba(248, 250, 252, 1)"};
          border: 1px solid ${!theme ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
          color: ${!theme ? "#f1f5f9" : "#1e293b"};
          padding: 1rem;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          text-align: left;
          width: 100%;
        }

        .action-btn:hover {
          background: ${!theme ? "rgba(30, 41, 59, 0.8)" : "#fff"};
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateX(8px);
          color: ${!theme ? "#fff" : "#6366f1"};
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .student-item {
          padding: 12px;
          border-radius: 12px;
          transition: background 0.2s;
          border-bottom: 1px solid ${!theme ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"};
        }

        .student-item:hover {
          background: ${!theme ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)"};
        }

        .trend-up { color: #10b981; }
        .trend-down { color: #f43f5e; }
        
        .welcome-title {
          background: ${!theme ? "linear-gradient(to right, #fff, #94a3b8)" : "linear-gradient(to right, #1e293b, #64748b)"};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}
      </style>
    </>
  );
};

export default Home;