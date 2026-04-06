import { useState, useMemo, useEffect } from "react";
import './Lessons.css'
import { useTodayLessons } from "../../../data/queries/group.queries"
import { useRoomsData } from "../../../data/queries/room.queries"
import { Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";

const shortDays = ["Yak", "Du", "Se", "Chor", "Pa", "Ju", "Sha"];
const pastelColors = ["#b2dfdb", "#c8e6c9", "#ffe082", "#b3e5fc", "#ffcdd2", "#e1bee7", "#f0f4c3"];

const Lessons = ({ theme }) => {
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());// 1. Initial qiymatni localStorage dan olamiz
    const [intervalMinutes, setIntervalMinutes] = useState(() => {
        return Number(localStorage.getItem('time_interval')) || 90;
    });

    // 2. intervalMinutes o'zgarganda uni localStorage ga yozamiz
    useEffect(() => {
        localStorage.setItem('time_interval', intervalMinutes.toString());
    }, [intervalMinutes]);

    // 3. Select yoki Input o'zgarganda shunchaki set qilish kifoya
    const handleIntervalChange = (newVal) => {
        setIntervalMinutes(Number(newVal));
    };

    const targetDateString = useMemo(() => {
        const today = new Date();
        const diff = selectedDay - today.getDay();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dd = String(targetDate.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, [selectedDay]);

    const { data: todayLessons, isLoading: lessonsLoading } = useTodayLessons(targetDateString);
    const { data: rooms, isLoading: roomsLoading } = useRoomsData();

    const roomsData = rooms?.results || [];
    const lessonsData = Array.isArray(todayLessons) ? todayLessons : (todayLessons?.results || []);

    const timeLabels = useMemo(() => {
        const labels = [];
        let currentMins = 8 * 60; // 08:00 dan boshlanadi
        const endMins = 20 * 60; // Rasmdagi kabi 20:00
        while (currentMins <= endMins) {
            const hStr = Math.floor(currentMins / 60).toString().padStart(2, '0');
            const mStr = (currentMins % 60).toString().padStart(2, '0');
            labels.push(`${hStr}:${mStr}`);
            currentMins += intervalMinutes;
        }
        return labels;
    }, [intervalMinutes]);

    const getMinutesFrom8 = (time) => {
        if (!time) return -1;
        const [h, m] = time.split(":").map(Number);
        return (h * 60 + m) - (8 * 60);
    };

    const getTimeIndex = (time, interval) => {
        const mins = getMinutesFrom8(time);
        if (mins < 0) return -1;
        return Math.floor(mins / interval);
    };

    const getColSpan = (start, end, interval) => {
        if (!start || !end) return 1;
        const duration = getMinutesFrom8(end) - getMinutesFrom8(start);
        return Math.max(1, Math.ceil(duration / interval));
    };

    const getCardColor = (groupId) => {
        if (!groupId) return "#e0e0e0";
        return pastelColors[(typeof groupId === 'number' ? groupId : Array.from(String(groupId)).reduce((s, c) => s + c.charCodeAt(0), 0)) % pastelColors.length];
    };

    // Har bir xonadagi darslar usma-ust tushib qolmasligi uchun "Tracks" hisoblaymiz
    const getRoomTracks = (room) => {
        const roomLessons = lessonsData.filter(l => {
            const rId = l.room?.id || l.room;
            return rId === room.id || rId === room.name;
        });

        // Vaqtga ko'ra tartiblaymiz
        roomLessons.sort((a, b) => getMinutesFrom8(a.begin_time) - getMinutesFrom8(b.begin_time));

        const tracks = [];
        roomLessons.forEach(lesson => {
            const startIdx = getTimeIndex(lesson.begin_time?.slice(0, 5), intervalMinutes);
            const span = getColSpan(lesson.begin_time?.slice(0, 5), lesson.end_time?.slice(0, 5), intervalMinutes);
            const endIdx = startIdx + span;

            let placed = false;
            for (let t = 0; t < tracks.length; t++) {
                const track = tracks[t];
                const lastLesson = track[track.length - 1];
                const lastStartIdx = getTimeIndex(lastLesson.begin_time?.slice(0, 5), intervalMinutes);
                const lastSpan = getColSpan(lastLesson.begin_time?.slice(0, 5), lastLesson.end_time?.slice(0, 5), intervalMinutes);
                const lastEndIdx = lastStartIdx + lastSpan;

                if (startIdx >= lastEndIdx) {
                    track.push(lesson);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                tracks.push([lesson]);
            }
        });

        return tracks.length > 0 ? tracks : [[]]; // Eng kamida 1 xil bo'sh qator yaratiladi
    };

    if (lessonsLoading || roomsLoading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

    return (
        <div className={`card border-0 shadow-sm ${!theme ? 'bg-dark text-white' : 'bg-white'}`} style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className={`d-flex justify-content-between align-items-center mb-3 p-3 pb-0 ${!theme ? 'bg-dark' : 'bg-white'}`}>
                <div className="d-flex gap-2">
                    {shortDays.map((day, i) => (
                        <button key={i} onClick={() => setSelectedDay(i)}
                            className={`btn btn-sm shadow-sm ${selectedDay === i ? 'btn-primary fw-bold text-white' : (!theme ? 'btn-secondary text-light border-secondary' : 'btn-light text-muted border')}`}
                            style={{ borderRadius: '6px', minWidth: '40px' }}>
                            {day}
                        </button>
                    ))}
                </div>

                <select
                    className={`form-select form-select-sm shadow-sm fw-medium border-0 ${!theme ? 'bg-secondary text-white' : 'bg-light text-dark'}`}
                    style={{ width: '120px', borderRadius: '6px' }}
                    value={intervalMinutes}
                    onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                >
                    <option value={60}>1 soat</option>
                    <option value={90}>1.5 soat</option>
                    <option value={120}>2 soat</option>
                </select>
            </div>

            <div className="lesson-table-wrapper px-3 pb-3" style={{ overflowX: 'auto' }}>
                <table className="robbit-table w-100">
                    <thead>
                        <tr>
                            <th className={`sticky-col border-left-0 border-top-0 ${!theme ? 'bg-dark border-secondary' : 'bg-white'}`} style={{ minWidth: '150px' }}></th>
                            {timeLabels.slice(0, -1).map((time, i) => (
                                <th key={i} className={`time-header text-center py-3 fw-bold ${!theme ? 'bg-dark text-white border-secondary' : 'bg-white text-dark'}`}>
                                    {time}-{timeLabels[i + 1]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {roomsData.map((room) => {
                            const tracks = getRoomTracks(room);
                            return tracks.map((trackLessons, trackIdx) => (
                                <tr key={`${room.id}-${trackIdx}`}>
                                    {trackIdx === 0 && (
                                        <td rowSpan={tracks.length} className={`room-name-td sticky-col px-3 align-middle fw-bold ${!theme ? 'bg-dark text-light border-secondary' : 'bg-white text-secondary border'}`}>
                                            {room.name}
                                        </td>
                                    )}
                                    {timeLabels.slice(0, -1).map((time, slotIdx) => {
                                        const occupiedByLesson = trackLessons.find(l => {
                                            const startIdx = getTimeIndex(l.begin_time?.slice(0, 5), intervalMinutes);
                                            const span = getColSpan(l.begin_time?.slice(0, 5), l.end_time?.slice(0, 5), intervalMinutes);
                                            return slotIdx > startIdx && slotIdx < startIdx + span;
                                        });

                                        if (occupiedByLesson) return null;

                                        const lessonStartsHere = trackLessons.find(l =>
                                            getTimeIndex(l.begin_time?.slice(0, 5), intervalMinutes) === slotIdx
                                        );

                                        if (lessonStartsHere) {
                                            const span = getColSpan(lessonStartsHere.begin_time?.slice(0, 5), lessonStartsHere.end_time?.slice(0, 5), intervalMinutes);

                                            const renderTooltip = (props) => (
                                                <Tooltip id={`tooltip-${lessonStartsHere.id}`} {...props}>
                                                    <div className="text-start" style={{ fontSize: '12px' }}>
                                                        <div className="mb-1"><strong style={{ color: '#ffc107' }}>Guruh:</strong> {lessonStartsHere.group?.name || "Noma'lum"}</div>
                                                        <div className="mb-1"><strong style={{ color: '#ffc107' }}>O'qituvchi:</strong> {lessonStartsHere.teacher?.first_name || ""} {lessonStartsHere.teacher?.last_name || ""}</div>
                                                        <div className="mb-1"><strong style={{ color: '#ffc107' }}>Vaqt:</strong> {lessonStartsHere.begin_time?.slice(0, 5)} - {lessonStartsHere.end_time?.slice(0, 5)}</div>
                                                        <div className="mb-1"><strong style={{ color: '#ffc107' }}>Xona:</strong> {lessonStartsHere.room?.name || "Noma'lum"}</div>
                                                        <div><strong style={{ color: '#ffc107' }}>Holati:</strong> {lessonStartsHere.status || "Noma'lum"}</div>
                                                    </div>
                                                </Tooltip>
                                            );

                                            return (
                                                <td key={slotIdx} colSpan={span} className={`p-1 align-top ${!theme ? 'border-secondary' : 'border'}`}>
                                                    <OverlayTrigger placement="top" overlay={renderTooltip}>
                                                        <div className="robbit-card w-100 h-100 shadow-sm"
                                                            style={{ backgroundColor: getCardColor(lessonStartsHere.group?.id || lessonStartsHere.id), borderRadius: '8px' }}>
                                                            <div className="teacher-name fw-bolder" style={{ color: '#102a43', fontSize: '13px' }}>
                                                                {lessonStartsHere.teacher?.first_name} {lessonStartsHere.teacher?.last_name ? lessonStartsHere.teacher.last_name[0] + '.' : ''}
                                                            </div>
                                                            <div className="group-name" style={{ color: '#0056b3', fontSize: '12px', fontWeight: '600' }}>
                                                                {lessonStartsHere.group?.name || 'Guruh nomi'}
                                                            </div>
                                                            <div className="lesson-time fw-bold mt-auto pt-1" style={{ color: '#333', fontSize: '11.5px', opacity: '0.85' }}>
                                                                {lessonStartsHere.begin_time?.slice(0, 5)}-{lessonStartsHere.end_time?.slice(0, 5)}
                                                            </div>
                                                        </div>
                                                    </OverlayTrigger>
                                                </td>
                                            );
                                        }

                                        return <td key={slotIdx} className={`empty-cell ${!theme ? 'border-secondary bg-dark' : 'border bg-white'}`}></td>;
                                    })}
                                </tr>
                            ));
                        })}
                    </tbody>
                </table>
            </div>

            <style>{`
                .robbit-table { border-collapse: separate; border-spacing: 0; table-layout: fixed; }
                .robbit-table th, .robbit-table td { border: 1px solid #dee2e6; min-width: 155px; }
                .robbit-table td { height: 105px; }
                
                .sticky-col { position: sticky; left: 0; z-index: 5; box-shadow: 2px 0 6px rgba(0,0,0,0.03); border-right-width: 2px !important; }
                .time-header { font-size: 13.5px; border-bottom-width: 2px !important; }
                
                .robbit-card { 
                    padding: 8px 12px; 
                    display: flex; 
                    flex-direction: column; 
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                }
                .robbit-card:hover {
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
                    transform: translateY(-2px);
                    z-index: 2;
                    position: relative;
                }
                .robbit-card .teacher-name, .robbit-card .group-name {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `}</style>
        </div>
    );
};

export default Lessons;