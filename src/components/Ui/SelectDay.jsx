import { useEffect, useState } from "react";

const d = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

const SelectDay = ({ data, setData, field }) => {
    const daysValue = data?.[field] || [];

    const [mode, setMode] = useState("");

    // hozirgi tanlangan holatni aniqlash
    const findCurrentDays = () => {
        if (!daysValue?.length) return "";

        const getIds = (arr) => arr.map(item => (typeof item === 'object' ? item?.id : item));
        const ids = getIds(daysValue);

        const equals = (arr1, arr2) =>
            arr1.length === arr2.length && arr1.every(v => arr2.includes(v));

        if (equals(ids, [1, 3, 5])) return "t";
        if (equals(ids, [2, 4, 6])) return "j";

        return "b";
    };

    // mode ni avtomatik sinxron qilish
    useEffect(() => {
        if (daysValue?.length === 0) {
            if (mode !== "b") {
                setMode("");
            }
        } else {
            setMode(findCurrentDays());
        }
    }, [daysValue, mode]);

    const changeDays = (id, isChecked) => {
        setData(prev => {
            const currentDays = Array.isArray(prev[field]) ? prev[field] : [];
            // Normalize to numbers just in case
            const currentIds = currentDays.map(item => (typeof item === 'object' ? item.id : item));

            const filtered = currentIds.filter(item => item !== id);

            return {
                ...prev,
                [field]: isChecked ? [...filtered, id] : filtered
            };
        });
    };

    const selectDays = (value) => {
        if (value === "t") {
            setData(prev => ({
                ...prev,
                [field]: [1, 3, 5]
            }));
        }
        if (value === "j") {
            setData(prev => ({
                ...prev,
                [field]: [2, 4, 6]
            }));
        }
        if (value === "b") {
            setData(prev => ({
                ...prev,
                [field]: []
            }));
        }
        setMode(value)
    }

    console.log(data);

    return (
        <>


            {mode !== "b" ? (
                <select
                    className="form-select"
                    value={mode}
                    onChange={(e) => selectDays(e.target.value)}
                >
                    <option hidden value="">Kun tanlash</option>
                    <option value="t">Toq kunlar (Du,Cho,Ju)</option>
                    <option value="j">Juft kunlar (Se,Pay,Sha)</option>
                    <option value="b">Boshqa kunlar</option>
                </select>
            ) : (
                <div className="d-flex flex-column align-items-start ms-3">
                    <div className="d-flex flex-wrap gap-2">
                        {d.map((day, i) => {
                            const dayId = i + 1;
                            return (
                                <label key={dayId} className="d-flex align-items-center gap-1">
                                    {day}
                                    <input
                                        type="checkbox"
                                        checked={daysValue.some(item => (typeof item === 'object' ? item.id : item) === dayId)}
                                        onChange={(e) =>
                                            changeDays(dayId, e.target.checked)
                                        }
                                    />
                                </label>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mt-2"
                        onClick={() => { setMode(""), setData(prev => ({ ...prev, [field]: [] })) }}
                    >
                        Ortga
                    </button>
                </div>
            )}
        </>
    );
};

export default SelectDay;