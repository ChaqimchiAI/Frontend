import { useTheme } from "../../Context/Context";

const EntriesSelect = ({ value, onChange, options = [10, 25, 50, 100], id = 'entries-select', className = '' }) => {
  const controlled = value !== undefined;
  const { theme } = useTheme();

  return (
    <div className={`d-inline-flex align-items-center ${className}`.trim()}>
      <select
        id={id}
        value={controlled ? String(value) : undefined}
        defaultValue={String(options[0])}
        onChange={e => onChange?.(Number(e.target.value))}
        className="form-select form-select-sm border-0 shadow-none cursor-pointer"
        style={{
          backgroundColor: !theme ? "#1e293b" : "#f5f5f5",
          borderRadius: "8px",
          padding: "8px 12px",
          paddingRight: "35px",
          fontSize: "12px",
          fontWeight: "600",
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23${!theme ? "ffffff" : "000000"}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 10px center",
          backgroundSize: "12px",
          appearance: "none",
          color: !theme ? "white" : "#000"
        }}
        aria-label="Rows per page"
      >
        {options.map(o => (
          <option key={o} value={String(o)} style={{ backgroundColor: !theme ? "#1e293b" : "#f5f5f5", color: !theme ? "white" : "#000" }}>
            {o} rows
          </option>
        ))}
      </select>
    </div>
  );
};

export default EntriesSelect;
