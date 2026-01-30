import { useState, useEffect, useRef } from 'react';
import { DateRangePicker } from 'react-date-range';
import { addDays, endOfDay, startOfDay, isSameDay } from 'date-fns';
import { uz } from 'date-fns/locale';
import { Icon } from '@iconify/react';
import { useTheme } from '../../Context/Context';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './CalendarSelected.css';

const staticRangesLabels = [
  {
    label: 'Bugun',
    range: () => ({ startDate: startOfDay(new Date()), endDate: endOfDay(new Date()) }),
  },
  {
    label: 'Kecha',
    range: () => ({
      startDate: startOfDay(addDays(new Date(), -1)),
      endDate: endOfDay(addDays(new Date(), -1)),
    }),
  },
  {
    label: 'Bu hafta',
    range: () => ({
      startDate: startOfDay(addDays(new Date(), -7)),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: 'Bu oy',
    range: () => ({
      startDate: startOfDay(addDays(new Date(), -30)),
      endDate: endOfDay(new Date()),
    }),
  },
];

const CalendarSelector = ({ onRangeSelect, filters }) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  // filters.start_date bo'sh bo'lsa tanlovni bekor qilish
  useEffect(() => {
    if (!filters?.start_date) {
      setIsDateSelected(false);
    }
  }, [filters?.start_date]);

  const [isDateSelected, setIsDateSelected] = useState(!!filters?.start_date);

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, []);

  const handleSelect = (item) => {
    const { selection } = item;
    setState([selection]);
    setIsDateSelected(true); // Tanlov bajarildi

    if (onRangeSelect) {
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      onRangeSelect({
        start: formatDate(selection.startDate),
        end: formatDate(selection.endDate)
      });
    }
  };

  return (
    <div className={`calendar ${!theme ? 'dark-theme' : 'light-theme'}`} ref={ref}>
      <div className="input-box border" onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
        <span className="icon">
          <Icon icon="famicons:calendar-outline" width="20" height="20" />
        </span>
        <input
          readOnly
          // Agar tanlanmagan bo'lsa bo'sh qiymat, placeholder chiqishi uchun
          value={isDateSelected
            ? `${state[0].startDate.toLocaleDateString()} - ${state[0].endDate.toLocaleDateString()}`
            : ""}
          className="date-input"
          placeholder="Sana tanlang"
          style={{ cursor: 'pointer' }}
        />
      </div>

      {open && (
        <div className="calendar-dropdown">
          <DateRangePicker
            onChange={handleSelect}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={state}
            direction="vertical"
            locale={uz}
            staticRanges={staticRangesLabels.map(range => ({
              ...range,
              isSelected: () => isDateSelected &&
                isSameDay(range.range().startDate, state[0].startDate) &&
                isSameDay(range.range().endDate, state[0].endDate)
            }))}
            inputRanges={[]}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarSelector;