import { useQuery } from "@tanstack/react-query";
import api from "../../data/api/axios"; // Axios instansingni ulab qo'y

const SelectDay = ({ data, setData, field }) => {
    // 1. Hafta kunlarini bazadan olish
    const { data: weekdaysData, isLoading } = useQuery({
        queryKey: ["weekdays"],
        queryFn: () => api.get("/core/weekdays/").then(res => res.data.data.results)
    });

    const days = weekdaysData || [];
    // Tanlangan kunlar ID lari (Normalize)
    const selectedIds = (data?.[field] || []).map(item => (typeof item === 'object' ? item?.id : item));

    // 2. Kunni tanlash/o'chirish
    const toggleDay = (id) => {
        const newDays = selectedIds.includes(id)
            ? selectedIds.filter(d => d !== id)
            : [...selectedIds, id].sort((a, b) => a - b);
        setData({ ...data, [field]: newDays });
    };

    // 3. Shablollar (Toq, Juft, Istalgan)
    const applyTemplate = (type) => {
        let newSelection = [];
        if (type === 'toq') newSelection = [1, 3, 5];
        if (type === 'juft') newSelection = [2, 4, 6];
        if (type === 'all') newSelection = [1, 2, 3, 4, 5, 6, 7];
        if (type === 'clear') newSelection = [];
        
        setData({ ...data, [field]: newSelection });
    };

    if (isLoading) return <div className="small text-muted">Kunlar yuklanmoqda...</div>;

    return (
        <div className="select-day-wrapper p-2 border rounded bg-light-subtle">
            {/* Tezkor tanlash tugmalari */}
            <div className="d-flex flex-wrap gap-1 mb-3">
                <button type="button" onClick={() => applyTemplate('toq')} className="btn btn-outline-primary btn-sm py-1 px-2" style={{fontSize: '11px'}}>Toq</button>
                <button type="button" onClick={() => applyTemplate('juft')} className="btn btn-outline-primary btn-sm py-1 px-2" style={{fontSize: '11px'}}>Juft</button>
                <button type="button" onClick={() => applyTemplate('all')} className="btn btn-outline-success btn-sm py-1 px-2" style={{fontSize: '11px'}}>Istalgan kun</button>
                <button type="button" onClick={() => applyTemplate('clear')} className="btn btn-outline-danger btn-sm py-1 px-2" style={{fontSize: '11px'}}>Tozalash</button>
            </div>

            {/* Kunlar ro'yxati (Checkbox/Badge style) */}
            <div className="d-flex flex-wrap gap-2 justify-content-start">
                {days.map((day) => {
                    const isActive = selectedIds.includes(day.id);
                    return (
                        <div
                            key={day.id}
                            onClick={() => toggleDay(day.id)}
                            className="d-flex flex-column align-items-center cursor-pointer"
                            style={{ width: "42px" }}
                        >
                            <span className="text-muted mb-1" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                                {day.code}
                            </span>
                            <div
                                className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm`}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    border: `2px solid ${isActive ? '#0085db' : '#dee2e6'}`,
                                    background: isActive ? '#0085db' : 'transparent',
                                    color: isActive ? '#fff' : '#6c757d',
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    transition: "0.2s all ease"
                                }}
                            >
                                {day.order}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {selectedIds.length > 0 && (
                <div className="mt-2 text-center border-top pt-1">
                    <span className="text-primary fw-bold" style={{fontSize: '11px'}}>
                        {selectedIds.length} kun tanlandi
                    </span>
                </div>
            )}
        </div>
    );
};

export default SelectDay;