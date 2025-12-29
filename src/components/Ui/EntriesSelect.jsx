import React from 'react';

const EntriesSelect = ({ value, onChange, options = [10, 25, 50, 100], id = 'entries-select', className = '' }) => {
  const controlled = value !== undefined;

  return (
    <div className={`d-inline-flex align-items-center ${className}`.trim()}>
      <label htmlFor={id} className="me-2 text-muted">Show</label>
      <select
        id={id}
        value={controlled ? String(value) : undefined}
        defaultValue={String(options[0])}
        onChange={e => onChange?.(Number(e.target.value))}
        className="form-select form-select-sm w-auto"
        aria-label="Rows per page"
      >
        {options.map(o => <option key={o} value={String(o)}>{o}</option>)}
      </select>
      <span className="ms-2 text-muted">entries</span>
    </div>
  );
};

export default EntriesSelect;
