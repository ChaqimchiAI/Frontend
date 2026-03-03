import './Lessons.css'

import { useTodayLessons } from "../../../data/queries/group.queries"
import { useRoomsData } from "../../../data/queries/room.queries"
import { Icon } from '@iconify/react'

const times = [
    "06:00 - 06:30",
    "06:30 - 07:00",
    "07:00 - 07:30",
    "07:30 - 08:00",
    "08:00 - 08:30",
    "08:30 - 09:00",
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "11:00 - 11:30",
    "11:30 - 12:00",
    "12:00 - 12:30",
    "12:30 - 13:00",
    "13:00 - 13:30",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
    "15:00 - 15:30",
    "15:30 - 16:00",
    "16:00 - 16:30",
    "16:30 - 17:00",
    "17:00 - 17:30",
    "17:30 - 18:00",
    "18:00 - 18:30",
    "18:30 - 19:00",
    "19:00 - 19:30",
    "19:30 - 20:00",
    "20:00 - 20:30",
    "20:30 - 21:00",
    "21:00 - 21:30",
    "21:30 - 22:00",
]

const shortDays = [
    "Yak",
    "Du",
    "Se",
    "Chor",
    "Pa",
    "Ju",
    "Sha"
]

// Mock darslar ma'lumotlari
const mockLessons = [
    {
        id: 1,
        name: "AN Arab tili T(10:00)",
        teacher: "Diyora Madimova",
        room: "London",
        startTime: "9:00",
        endTime: "11:30",
        students: 75,
        maxStudents: 26,
        color: "#00c853"
    },
    {
        id: 2,
        name: "YK Fizika T (12:00)",
        teacher: "Yaxshilik Karimov",
        room: "Payme",
        startTime: "12:00",
        endTime: "13:30",
        students: 4,
        maxStudents: 40,
        color: "#ffd600"
    },
    {
        id: 3,
        name: "ZK Arab tili T(10:00)",
        teacher: "Zaynabxon Karimova",
        room: "Tokio",
        startTime: "10:00",
        endTime: "11:30",
        students: 13,
        maxStudents: 38,
        color: "#00bcd4"
    },
    {
        id: 4,
        name: "MA Arab tili T(10:00)",
        teacher: "Muslimaxon Abduvali...",
        room: "Tashkent",
        startTime: "10:00",
        endTime: "11:30",
        students: 138,
        maxStudents: 100,
        color: "#00bcd4"
    },
    {
        id: 5,
        name: "DE Rus tili T(09:00) Kids",
        teacher: "Dilnoza Elxonova",
        room: "Moscow",
        startTime: "09:00",
        endTime: "10:30",
        students: 38,
        maxStudents: 40,
        color: "#e91e63"
    },
    {
        id: 6,
        name: "DE Rus tili T(10:30)B1",
        teacher: "Dilnoza Elxonova",
        room: "Moscow",
        startTime: "10:30",
        endTime: "12:00",
        students: 74,
        maxStudents: 27,
        color: "#e91e63"
    },
    {
        id: 7,
        name: "ZA Elementary T(08:30...)",
        teacher: "Zulfizar Akramjonova",
        room: "Harvard",
        startTime: "08:30",
        endTime: "10:00",
        students: 58,
        maxStudents: 40,
        color: "#4caf50"
    },
    {
        id: 8,
        name: "GX Elementary T(08:3...)",
        teacher: "Gulbanom Xabibuallayeva",
        room: "Michigan",
        startTime: "08:30",
        endTime: "10:00",
        students: 77,
        maxStudents: 134,
        color: "#4caf50"
    },
    {
        id: 9,
        name: "GX Level 2 T(10:00) Ne...",
        teacher: "Gulbanom Xabibuallayeva",
        room: "Michigan",
        startTime: "10:30",
        endTime: "12:00",
        students: 71,
        maxStudents: 133,
        color: "#9c27b0"
    },
    {
        id: 10,
        name: "OFN Rus tili T(14:00)",
        teacher: "Og'abey Nosirov",
        room: "MIT",
        startTime: "14:00",
        endTime: "15:30",
        students: 84,
        maxStudents: 77,
        color: "#f44336"
    },
    {
        id: 11,
        name: "OA Matem T(14:00)",
        teacher: "Olimpon Abduhonnon",
        room: "Workly",
        startTime: "13:00",
        endTime: "15:30",
        students: 130,
        maxStudents: 118,
        color: "#ff9800"
    },
    {
        id: 12,
        name: "AN Arab tili T(14:00)",
        teacher: "Aziza Ne'matova",
        room: "Cambridge",
        startTime: "14:00",
        endTime: "15:30",
        students: 49,
        maxStudents: 65,
        color: "#00c853"
    },
    {
        id: 13,
        name: "ZK Arab tili T(14:00)",
        teacher: "Zaynabxon Karimova",
        room: "Workly",
        startTime: "15:30",
        endTime: "17:00",
        students: 118,
        maxStudents: 77,
        color: "#00bcd4"
    },
    {
        id: 14,
        name: "MA Arab tili T(14:00)",
        teacher: "Muslimaxon Abduvali...",
        room: "Payme",
        startTime: "14:00",
        endTime: "15:30",
        students: 20,
        maxStudents: 25,
        color: "#00bcd4"
    },
    {
        id: 15,
        name: "DE Rus tili T(14:00) pa...",
        teacher: "Dilnoza Elxonova",
        room: "Moscow",
        startTime: "14:00",
        endTime: "15:30",
        students: 18,
        maxStudents: 26,
        color: "#e91e63"
    },
    {
        id: 16,
        name: "ZA Elementary T(14:00...)",
        teacher: "Zulfizar Akramjonova",
        room: "Michigan",
        startTime: "14:00",
        endTime: "15:30",
        students: 21,
        maxStudents: 25,
        color: "#4caf50"
    },
]

const ROW_HEIGHT = 28

// Vaqtni minutga aylantirish (masalan "10:00" -> 600)
const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number)
    return h * 60 + m
}

// Dars qaysi vaqt slotida boshlanishini aniqlash
const getTimeSlotIndex = (startTime) => {
    const minutes = timeToMinutes(startTime)
    const baseMinutes = timeToMinutes("06:00")
    return Math.floor((minutes - baseMinutes) / 30)
}

// Dars nechta slot egallashini aniqlash
const getRowSpan = (startTime, endTime) => {
    const startMin = timeToMinutes(startTime)
    const endMin = timeToMinutes(endTime)
    return Math.ceil((endMin - startMin) / 30)
}

const Lessons = ({ theme }) => {

    const { data: todayLessons } = useTodayLessons()
    const { data: rooms } = useRoomsData()
    const roomsData = rooms?.results

    // Har bir xona va vaqt slot uchun darsni topish
    const getLessonForCell = (roomName, timeIndex) => {
        return mockLessons.find(lesson => {
            const lessonStart = getTimeSlotIndex(lesson.startTime)
            return lesson.room === roomName && lessonStart === timeIndex
        })
    }

    // Bu hujayra dars bilan band ekanligini tekshirish (rowSpan tufayli)
    const isCellOccupied = (roomName, timeIndex) => {
        return mockLessons.some(lesson => {
            const lessonStart = getTimeSlotIndex(lesson.startTime)
            const span = getRowSpan(lesson.startTime, lesson.endTime)
            return lesson.room === roomName && timeIndex > lessonStart && timeIndex < lessonStart + span
        })
    }

    return (
        <div className="card col-lg-12 glass-card p-4 border-0 mb-4">
            <div className="mb-4">
                <h5 className={`fw-bold mb-1 ${!theme ? 'text-white' : 'text-dark'}`}>Darslar jadvali</h5>
                <p className="text-muted small mb-0">Bugungi darslar jadvali</p>
            </div>

            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2 mb-3">
                    {shortDays.map((day, index) => (
                        <button
                            key={index}
                            className={`btn px-3 py-1 fs-2 ${theme ? 'btn-outline-dark' : 'btn-outline-light'}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                
            </div>

            <div className="lesson-table-wrapper">
                <table
                    className="lesson-table"
                    style={{
                        minWidth: roomsData?.length > 8
                            ? `${100 + roomsData.length * 150}px`
                            : '100%'
                    }}
                >
                    <thead className='position-sticky t0' style={{ background: theme ? '#fff' : '#1a2536' }}>
                        <tr>
                            <th className='position-sticky l0' style={{ zIndex: 101, background: theme ? '#fff' : '#1a2536' }}></th>
                            {roomsData?.map(r =>
                                <th key={r.id}>{r.name}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((time, index) => (
                            <tr key={index}>
                                <td className='time-td position-sticky l0' style={{ background: theme ? '#fff' : '#1a2536' }}>{time}</td>
                                {roomsData?.map(r => {
                                    if (isCellOccupied(r.name, index)) {
                                        return null
                                    }

                                    const lesson = getLessonForCell(r.name, index)

                                    if (lesson) {
                                        const span = getRowSpan(lesson.startTime, lesson.endTime)
                                        const cardHeight = span * ROW_HEIGHT - 4
                                        return (
                                            <td key={r.id} rowSpan={span} className="lesson-cell">
                                                <div className="position-relative d-flex align-items-center justify-content-center">
                                                    <div className="lesson-info fs-1 d-flex flex-column align-items-start">
                                                        <p className="d-flex align-items-center justify-content-between w-100 m-0 pb-1">
                                                            <span>Guruh:</span>
                                                            <span>{lesson.name}</span>
                                                        </p>
                                                        <p className="d-flex align-items-center justify-content-between w-100 m-0 pb-1">
                                                            <span>Xona:</span>
                                                            <span>{lesson.room}</span>
                                                        </p>
                                                        <p className="d-flex align-items-center justify-content-between w-100 m-0 pb-1">
                                                            <span>Dars vaqti:</span>
                                                            <span>{lesson.startTime} - {lesson.endTime}</span>
                                                        </p>
                                                        <p className="d-flex align-items-center justify-content-between w-100 m-0 pb-1">
                                                            <span>O'qituvchi:</span>
                                                            <span>{lesson.teacher}</span>
                                                        </p>
                                                        <p className="d-flex align-items-center justify-content-between w-100 m-0 pb-1">
                                                            <span>Kurs: </span>
                                                            <span>{lesson.course}</span>
                                                        </p>
                                                        <p className="d-flex align-items-center justify-content-between w-100 m-0 pb-1">
                                                            <span>Sana:</span>
                                                            <span>{lesson.date}</span>
                                                        </p>
                                                        <p className="d-flex align-items-center justify-content-between w-100 m-0 pb-1">
                                                            <span>Boshlanish vaqti:</span>
                                                            <span>{lesson.startTime}</span>
                                                        </p>
                                                        <p className="d-flex align-items-center justify-content-between w-100 m-0 pb-1">
                                                            <span>Tugash vaqti:</span>
                                                            <span>{lesson.endTime}</span>
                                                        </p>
                                                    </div>
                                                    <div
                                                        className="lesson-card"
                                                        style={{
                                                            backgroundColor: lesson.color + '80',
                                                            height: `${cardHeight}px`
                                                        }}
                                                    >
                                                        <div className="lesson-card-name">{lesson.name}</div>
                                                        <div className="lesson-card-teacher">{lesson.teacher}</div>
                                                        <div className="lesson-card-room">Xona: {lesson.room}</div>
                                                        <div className="lesson-card-stats d-flex justify-content-center">
                                                            <span>👤 {lesson.students}/{r.capacity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        )
                                    }

                                    return <td key={r.id} className="empty-cell">—</td>
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Lessons